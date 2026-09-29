import type { ReactNode } from "react";
import { HubConsole } from "@/components/labs/consoles/HubConsole";
import { IntroConsole } from "@/components/labs/consoles/IntroConsole";
import { PythonConsole } from "@/components/labs/consoles/PythonConsole";
import { StatsConsole } from "@/components/labs/consoles/StatsConsole";
import { MlConsole } from "@/components/labs/consoles/MlConsole";

export function getConsoleForModule(slug: string): ReactNode {
  switch (slug) {
    case "ia":
      return <IntroConsole />;
    case "python":
      return <PythonConsole />;
    case "estadistica":
      return <StatsConsole />;
    case "machine-learning":
      return <MlConsole />;
    default:
      return <HubConsole />;
  }
}
