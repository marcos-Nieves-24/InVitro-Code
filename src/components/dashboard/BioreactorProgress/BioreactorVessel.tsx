"use client";

import { BioreactorSvg } from "./BioreactorSvg";

type Props = {
  percent: number;
  fast: boolean;
  shouldReduce: boolean;
};

export function BioreactorVessel({ percent, fast, shouldReduce }: Props) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-visible">
      <BioreactorSvg percent={percent} fast={fast} shouldReduce={shouldReduce} />
    </div>
  );
}
