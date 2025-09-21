"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Dither from "@/components/Dither";

export default function ImagesPage() {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Placeholder images - replace with actual image paths
  const images = [
    "/images/jewelry-1.jpg",
    "/images/jewelry-2.jpg",
    "/images/jewelry-3.jpg",
    "/images/jewelry-4.jpg",
    "/images/photography-1.jpg",
    "/images/photography-2.jpg",
    "/images/photography-3.jpg"
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-w-full" style={{ backgroundColor: '#F7FCFE' }}>
      {/* Dither background - exact same as page.tsx */}
      <div className="fixed z-0 inset-0 h-screen w-screen">
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
      <div className="fixed z-10 inset-0 h-[300px] w-screen bg-gradient-to-b to-transparent" style={{ backgroundImage: 'linear-gradient(to bottom, #F7FCFE, transparent)' }}></div>

      {/* Back button */}
      <button
        onClick={() => router.push('/')}
        className="fixed top-8 left-8 z-30 border-1 border-dark px-4 py-2 font-semibold text-xs text-dark hover:bg-gray-100 transition-colors cursor-pointer"
        style={{ backgroundColor: '#F7FCFE' }}
      >
        ← Back
      </button>

      {/* Image carousel */}
      <div className="relative z-20 flex items-center justify-center min-h-screen p-8">
        <div className="relative max-w-4xl w-full">
          {/* Navigation buttons */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 border-1 border-dark w-12 h-12 hover:bg-gray-100 transition-colors flex items-center justify-center text-dark"
            style={{ backgroundColor: '#F7FCFE' }}
          >
            ←
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 border-1 border-dark w-12 h-12 hover:bg-gray-100 transition-colors flex items-center justify-center text-dark"
            style={{ backgroundColor: '#F7FCFE' }}
          >
            →
          </button>

          {/* Image container */}
          <div className="relative aspect-video bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={images[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback for missing images
                (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg width='800' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='800' height='600' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='%23666' text-anchor='middle' dy='.3em'%3EImage ${currentImageIndex + 1}%3C/text%3E%3C/svg%3E`;
              }}
            />
          </div>

          {/* Thumbnail navigation */}
          <div className="flex justify-center mt-6 space-x-2 overflow-x-auto">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 transition-colors ${
                  index === currentImageIndex ? 'bg-dark' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}