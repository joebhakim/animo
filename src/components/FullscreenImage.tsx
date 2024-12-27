import { useState } from 'react';
import Image from 'next/image';

interface FullscreenImageProps {
  src: string;
  alt: string;
}

export default function FullscreenImage({ src, alt }: FullscreenImageProps) {
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const LoadingSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500" />
    </div>
  );

  const ErrorFallback = () => (
    <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500">
      <div className="text-center">
        <p className="text-sm">Failed to load image</p>
        <button
          onClick={() => setImageError(false)}
          className="mt-2 text-sm text-blue-500 hover:text-blue-600"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="aspect-[4/3] relative rounded-lg overflow-hidden group bg-white">
        <div
          onClick={() => !imageError && setIsImageFullscreen(!isImageFullscreen)}
          className={`relative w-full h-full flex items-center justify-center bg-white ${!imageError && 'cursor-pointer'}`}
        >
          <div className="relative w-full h-full">
            <LoadingSpinner />
            {imageError ? <ErrorFallback /> : (
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                onError={handleImageError}
                loading="lazy"
              />
            )}
          </div>
          {!imageError && (
            <div className="absolute top-4 right-4 bg-black/50 px-3 py-1.5 rounded-md text-white text-sm 
              opacity-0 group-hover:opacity-100 transition-opacity">
              Fullscreen
            </div>
          )}
        </div>
      </div>

      {isImageFullscreen && !imageError && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setIsImageFullscreen(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center bg-black p-4">
            <div className="relative w-full h-full flex items-center justify-center">
              <LoadingSpinner />
              <Image
                src={src}
                alt={alt}
                fill
                sizes="100vw"
                priority
                className="object-contain"
                onError={handleImageError}
              />
            </div>
            <button
              className="absolute top-4 right-4 bg-black/50 px-3 py-1.5 rounded-md text-white text-sm hover:bg-black/70 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsImageFullscreen(false);
              }}
            >
              Exit fullscreen
            </button>
          </div>
        </div>
      )}
    </>
  );
} 