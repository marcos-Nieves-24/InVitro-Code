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
          className="block"
          title={caption ?? src}
        />
      </div>
      {caption && (
        <p className="mt-1.5 text-xs leading-relaxed text-gray-500 font-mono">
          {caption}
        </p>
      )}
    </div>
  );
}
