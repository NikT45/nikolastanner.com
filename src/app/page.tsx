import HomePage from "@/components/HomePage";
import Dither from "@/components/Dither";
export default function Home() {
  return (
    <div className="absolute z-0 inset-0 h-full w-full">
      <Dither
        waveColor={[0, 0, 1]}
        disableAnimation={false}
        enableMouseInteraction={false}
        mouseRadius={0.3}
        colorNum={4}
        waveAmplitude={0.3}
        waveFrequency={3}
        waveSpeed={0.01}
        opacity={0.2}
      />
    </div>
    /*<HomePage />*/
  );
}
