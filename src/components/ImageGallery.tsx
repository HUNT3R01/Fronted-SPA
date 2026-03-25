import { useState } from 'react';
import { ImageModal } from './ImageModal';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setModalOpen(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="space-y-4">
      {/* Cuadrícula de miniaturas (Thumbnails grid) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {/* Imagen principal destacada */}
        <div 
          className={`relative rounded-lg overflow-hidden cursor-pointer ${images.length > 1 ? 'md:col-span-3 md:row-span-2' : 'col-span-1'}`}
          onClick={() => openModal(0)}
        >
          <img
            src={images[0]}
            alt={`${title} - Principal`}
            className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Miniaturas secundarias (máximo 4 a la vista) */}
        {images.length > 1 && images.slice(1, 5).map((img, index) => {
          const actualIndex = index + 1;
          const isLastVisible = index === 3;
          const remainingImages = images.length - 5;

          return (
            <div 
              key={actualIndex} 
              className="relative rounded-lg overflow-hidden cursor-pointer hidden md:block"
              onClick={() => openModal(actualIndex)}
            >
              <img
                src={img}
                alt={`${title} - Imagen ${actualIndex + 1}`}
                className="w-full h-[196px] object-cover hover:scale-105 transition-transform duration-300"
              />
              {/* Si hay más imágenes ocultas, mostramos un contador sobre la última miniatura */}
              {isLastVisible && remainingImages > 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-semibold text-xl">+{remainingImages}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Renderizar el Modal si está abierto */}
      {modalOpen && (
        <ImageModal
          images={images}
          currentIndex={currentIndex}
          onClose={() => setModalOpen(false)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
}