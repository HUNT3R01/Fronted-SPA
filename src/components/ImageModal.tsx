import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageModalProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function ImageModal({ images, currentIndex, onClose, onNext, onPrev }: ImageModalProps) {
  // Manejar eventos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Bloquear el scroll del fondo cuando el modal está abierto
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, onNext, onPrev]);

  if (!images || images.length === 0) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose} // Cerrar al hacer clic en el fondo oscuro (backdrop)
    >
      {/* Botón de cerrar (X) */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4 text-white hover:bg-white/20 z-50"
        onClick={onClose}
      >
        <X className="h-8 w-8" />
      </Button>

      {/* Contador de imágenes (ej. "3 de 10") */}
      <div className="absolute top-4 left-4 text-white font-medium z-50 text-lg">
        {currentIndex + 1} de {images.length}
      </div>

      {/* Contenedor de la Imagen Principal */}
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] flex items-center justify-center px-12"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={images[currentIndex]} 
          alt={`Imagen ${currentIndex + 1}`} 
          className="max-w-full max-h-[85vh] object-contain rounded-md select-none"
        />

        {/* Botones de navegación (solo si hay más de 1 imagen) */}
        {images.length > 1 && (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={onPrev}
            >
              <ChevronLeft className="h-10 w-10" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={onNext}
            >
              <ChevronRight className="h-10 w-10" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}