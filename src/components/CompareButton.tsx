import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Interfaz básica de Propiedad (ajústala según tu modelo real)
export interface Property {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl?: string;
}

// Utilidades para manejar el LocalStorage
export const getCompareList = (): Property[] => JSON.parse(localStorage.getItem('compareList') || '[]');
export const setCompareList = (list: Property[]) => localStorage.setItem('compareList', JSON.stringify(list));

interface CompareButtonProps {
  property: Property;
}

export function CompareButton({ property }: CompareButtonProps) {
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const list = getCompareList();
      setIsComparing(list.some(p => p.id === property.id));
    };
    
    checkStatus();
    // Escuchar cambios para mantener los botones sincronizados
    window.addEventListener('compareUpdated', checkStatus);
    return () => window.removeEventListener('compareUpdated', checkStatus);
  }, [property.id]);

  const toggleCompare = () => {
    const list = getCompareList();
    const exists = list.some(p => p.id === property.id);

    if (exists) {
      const newList = list.filter(p => p.id !== property.id);
      setCompareList(newList);
      toast.success('Propiedad removida de la comparación');
    } else {
      if (list.length >= 3) {
        toast.error('Puedes comparar un máximo de 3 propiedades simultáneamente.');
        return;
      }
      const newList = [...list, property];
      setCompareList(newList);
      toast.success('Propiedad agregada a la comparación');
    }
    
    // Disparamos un evento global para que la página de comparación (y otros botones) se enteren
    window.dispatchEvent(new Event('compareUpdated'));
  };

  return (
    <Button 
      variant={isComparing ? "secondary" : "outline"} 
      onClick={toggleCompare}
      className="w-full mt-2"
    >
      {isComparing ? 'Quitar de comparación' : 'Comparar'}
    </Button>
  );
}