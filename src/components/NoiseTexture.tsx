export default function NoiseTexture() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.04]">
      <svg className="absolute left-0 top-0 h-full w-full" opacity="1">
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.75" 
            numOctaves="3"
            stitchTiles="stitch" 
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}
