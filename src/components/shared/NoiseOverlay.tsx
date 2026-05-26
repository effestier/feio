"use client";

import { useEffect, useRef } from "react";

const GRAIN_SIZE = 128;

export default function NoiseOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = GRAIN_SIZE;
    canvas.height = GRAIN_SIZE;

    let frame: number;

    const render = () => {
      const imageData = ctx.createImageData(GRAIN_SIZE, GRAIN_SIZE);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 12;
      }

      ctx.putImageData(imageData, 0, 0);
      frame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9990] h-full w-full opacity-[0.18]"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
