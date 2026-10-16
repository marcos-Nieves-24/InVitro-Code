interface InteractiveFrameProps {
  src: string;
  height?: string;
  caption?: string;
}

export function InteractiveFrame({
  src,
  height = "650px",
  caption,
}: InteractiveFrameProps) {
  return (
    <div className="my-3">
      <div className="overflow-hidden rounded-[12px] border border-gray-200">
        <iframe
          src={src}
          width="100%"
          height={height}
          style={{ height, maxHeight: "min(52vh, 480px)" }}
          className="block w-full"
          title={caption ?? src}
        />
      </div>
      {caption && (
        <p className="mt-1.5 text-center font-mono text-xs leading-relaxed text-storm">
          {caption}
        </p>
      )}
    </div>
  );
}
