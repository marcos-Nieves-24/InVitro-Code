export type HeroVideo = {
  src: string;
  poster: string;
  alt: string;
};

export const HERO_VIDEOS: Record<string, HeroVideo> = {
  ia: {
    src: "/videos/lab-hero-ia.mp4",
    poster: "/videos/lab-hero-ia-poster.jpg",
    alt: "Laboratorio IA",
  },
  python: {
    src: "/videos/lab-hero-python.mp4",
    poster: "/videos/lab-hero-python-poster.jpg",
    alt: "Laboratorio Python",
  },
  estadistica: {
    src: "/videos/lab-hero-estadistica.mp4",
    poster: "/videos/lab-hero-estadistica-poster.jpg",
    alt: "Laboratorio Estadística",
  },
  "machine-learning": {
    src: "/videos/lab-hero-ml.mp4",
    poster: "/videos/lab-hero-ml-poster.jpg",
    alt: "Laboratorio Machine Learning",
  },
  fallback: {
    src: "/videos/circuit-growth-animation.mp4",
    poster: "",
    alt: "Laboratorio",
  },
};

export function getHeroVideo(slug: string): HeroVideo {
  return HERO_VIDEOS[slug] ?? HERO_VIDEOS.fallback;
}
