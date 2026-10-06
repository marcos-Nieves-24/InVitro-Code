/**
 * Central validator for avatar uploads.
 * Normalization: `jpeg` is normalized to `jpg` for consistent file naming.
 * All checks are case-insensitive via `toLowerCase()`.
 */
export const ALLOWED_EXTS = ["jpg", "jpeg", "png", "webp"] as const;
export const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_SIZE = 2 * 1024 * 1024; // 2MB

type AllowedExt = (typeof ALLOWED_EXTS)[number];
type AllowedMime = (typeof ALLOWED_MIME)[number];

/**
 * Validates an avatar File.
 * - Checks file.size against MAX_SIZE
 * - Checks file.type is in ALLOWED_MIME allowlist
 * - Extracts ext via file.name.split(".").pop()?.toLowerCase() and validates against ALLOWED_EXTS
 *   (e.g. avatar.png.exe → ext "exe" → throw)
 * - Validates ext ↔ mime coherence (jpg|jpeg ↔ image/jpeg, png ↔ image/png, webp ↔ image/webp)
 * - Sniffs magic bytes (first 12 bytes) and verifies signature matches declared mime.
 * @throws Error with descriptive message on validation failure (caller should map to 400)
 * @returns { ext } normalized — `jpeg` is normalized to `jpg`, others lowercased as-is
 */
export async function validateAvatar(file: File): Promise<{ ext: string }> {
  if (file.size > MAX_SIZE) {
    throw new Error("File too large. Max size: 2MB");
  }

  if (!ALLOWED_MIME.includes(file.type as AllowedMime)) {
    throw new Error("Invalid file type. Allowed: JPG, PNG, WebP");
  }

  const rawExt = file.name.split(".").pop()?.toLowerCase();

  if (!rawExt || !ALLOWED_EXTS.includes(rawExt as AllowedExt)) {
    throw new Error("Invalid file extension. Allowed: JPG, PNG, WebP");
  }

  // ext ↔ mime coherence
  const mimeForExt: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
  };

  const expectedMime = mimeForExt[rawExt];
  if (file.type !== expectedMime) {
    throw new Error("File extension does not match MIME type");
  }

  // Magic bytes sniffing — read first 12 bytes
  const buffer = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const isJpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng =
    bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  const isWebP =
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50;

  let signatureValid = false;
  if (file.type === "image/jpeg") signatureValid = isJpeg;
  else if (file.type === "image/png") signatureValid = isPng;
  else if (file.type === "image/webp") signatureValid = isWebP;

  if (!signatureValid) {
    throw new Error("Invalid image signature");
  }

  // Normalize jpeg → jpg for consistent storage naming
  const ext = rawExt === "jpeg" ? "jpg" : rawExt;

  return { ext };
}
