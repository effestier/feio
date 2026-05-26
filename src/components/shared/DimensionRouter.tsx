"use client";

import { useDimensionStore } from "@/systems/progression/dimensionStore";
import SurfaceHero from "@/components/dimension0/SurfaceHero";
import FractureTransition from "@/components/dimension1/FractureTransition";
import DepthScene from "@/components/dimension2/DepthScene";
import TemporalChamber from "@/components/dimension4/TemporalChamber";
import LogicChamber from "@/components/dimension5/LogicChamber";
import ObserverChamber from "@/components/dimension6/ObserverChamber";
import CollapseChamber from "@/components/dimension7/CollapseChamber";

export default function DimensionRouter() {
  const currentDimension = useDimensionStore((s) => s.currentDimension);

  return (
    <>
      {currentDimension === 0 && <SurfaceHero />}
      {currentDimension === 1 && <SurfaceHero />}
      {currentDimension >= 2 && currentDimension < 4 && <DepthScene />}
      {currentDimension >= 4 && currentDimension < 5 && <TemporalChamber />}
      {currentDimension >= 5 && currentDimension < 6 && <LogicChamber />}
      {currentDimension >= 6 && currentDimension < 7 && <ObserverChamber />}
      {currentDimension >= 7 && <CollapseChamber />}

      <FractureTransition />
    </>
  );
}
