"use client";

import { CommandPalette, type CommandPaletteLesson, type CommandPaletteModule } from "./CommandPalette";

interface Props {
  modules: CommandPaletteModule[];
  lessons: CommandPaletteLesson[];
}

export function CommandPaletteProvider({ modules, lessons }: Props) {
  return <CommandPalette modules={modules} lessons={lessons} />;
}
