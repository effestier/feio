import CursorSystem from "@/components/shared/CursorSystem";
import NoiseOverlay from "@/components/shared/NoiseOverlay";
import DimensionRouter from "@/components/shared/DimensionRouter";

export default function Home() {
  return (
    <>
      <CursorSystem />
      <NoiseOverlay />
      <DimensionRouter />
    </>
  );
}
