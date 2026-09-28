export const LAB_HERO_IMAGES: Record<string, string> = {
  hub: "/laboratorio/banner.png",
  ia: "/laboratorio/modulo-1.png",
  python: "/laboratorio/modulo-2.png",
  estadistica: "/laboratorio/modulo-3.png",
  "machine-learning": "/laboratorio/modulo-4.png",
};

export const PROYECTO_HERO_IMAGES: Record<string, string> = {
  hub: "/proyectos/proyectos.png",
  ia: "/proyectos/proyecto-modulo-1.png",
  python: "/proyectos/proyecto-modulo-2.png",
  estadistica: "/proyectos/proyecto-modulo-3.png",
  "machine-learning": "/proyectos/proyecto-modulo-4.png",
};

export function getLabHeroImage(slug: string): string {
  return LAB_HERO_IMAGES[slug] ?? LAB_HERO_IMAGES.hub;
}

export function getProyectoHeroImage(slug: string): string {
  return PROYECTO_HERO_IMAGES[slug] ?? PROYECTO_HERO_IMAGES.hub;
}
