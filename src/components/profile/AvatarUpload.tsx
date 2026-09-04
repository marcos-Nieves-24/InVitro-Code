"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, X } from "lucide-react";

interface AvatarUploadProps {
  currentAvatar?: string | null;
  onUpload: (file: File) => Promise<void>;
}

export function AvatarUpload({ currentAvatar, onUpload }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await onUpload(file);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayName = "Avatar";
  const initials = "A";

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : currentAvatar ? (
          <img
            src={currentAvatar}
            alt={displayName}
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-fog text-xl font-bold text-ink">
            {initials}
          </div>
        )}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-mint text-ink shadow-sm transition-colors hover:bg-fog disabled:pointer-events-none disabled:opacity-50"
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-btn bg-mint px-4 py-2 text-sm font-medium text-ink shadow-sm transition-colors hover:bg-fog disabled:pointer-events-none disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
            {uploading ? "Subiendo..." : "Subir foto"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-btn border border-surface-raised px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-card disabled:pointer-events-none disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
