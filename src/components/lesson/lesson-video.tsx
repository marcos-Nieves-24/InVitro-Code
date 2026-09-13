interface LessonVideoProps {
  src: string;
  caption?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
}

/**
 * Inline lesson video player for MP4 animations.
 * Renders a native HTML5 video inside the standard lesson media frame.
 */
export function LessonVideo({
  src,
  caption,
  poster,
  autoPlay = false,
  loop = true,
}: LessonVideoProps) {
  return (
    <figure className="my-6">
      <div className="overflow-hidden rounded-[12px] border border-gray-200 bg-black">
        <video
          src={src}
          poster={poster}
          controls
          autoPlay={autoPlay}
          muted={autoPlay}
          loop={loop}
          playsInline
          preload="metadata"
          className="block w-full"
        >
          Tu navegador no soporta video HTML5.
        </video>
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs leading-relaxed text-gray-500 font-mono">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
