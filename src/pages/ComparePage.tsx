import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getCompareList, setCompareList, type Property } from '@/components/CompareButton';
import { toast } from 'sonner';

export function ComparePage() {
  const [properties, setProperties] = useState<Property[]>([]);

  const loadProperties = () => {
    setProperties(getCompareList());
  };

  useEffect(() => {
    loadProperties();
    window.addEventListener('compareUpdated', loadProperties);
    return () => window.removeEventListener('compareUpdated', loadProperties);
  }, []);

  const removeProperty = (id: string) => {
    const newList = properties.filter(p => p.id !== id);
    setCompareList(newList);
    toast.info('Propiedad removida');
    window.dispatchEvent(new Event('compareUpdated'));
  };

  // Estado vacío
  if (properties.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Comparación de Propiedades</h1>
        <p className="text-muted-foreground mb-6">No has seleccionado ninguna propiedad para comparar.</p>
        <Link to="/">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    );
  }

  // Cálculos para resaltar los mejores valores
  const lowestPrice = Math.min(...properties.map(p => p.price));
  const highestArea = Math.max(...properties.map(p => p.area));
  const lowestPricePerSqm = Math.min(...properties.map(p => p.price / p.area));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Comparación de Propiedades</h1>
      
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm text-left">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="p-4 font-medium text-muted-foreground w-1/4">Características</th>
              {properties.map(p => (
                <th key={p.id} className="p-4 font-semibold text-center w-1/4">
                  <div className="flex flex-col items-center gap-2">
                    <span className="truncate w-full">{p.title}</span>
                    <Button variant="destructive" size="sm" onClick={() => removeProperty(p.id)}>
                      Remover
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {/* Precio */}
            <tr>
              <td className="p-4 font-medium">Precio</td>
              {properties.map(p => (
                <td key={p.id} className={`p-4 text-center ${p.price === lowestPrice ? 'text-green-600 font-bold bg-green-50/50 dark:bg-green-900/10' : ''}`}>
                  ${p.price.toLocaleString()}
                </td>
              ))}
            </tr>
            {/* Área */}
            <tr>
              <td className="p-4 font-medium">Área (m²)</td>
              {properties.map(p => (
                <td key={p.id} className={`p-4 text-center ${p.area === highestArea ? 'text-green-600 font-bold bg-green-50/50 dark:bg-green-900/10' : ''}`}>
                  {p.area} m²
                </td>
              ))}
            </tr>
            {/* Precio por m2 */}
            <tr>
              <td className="p-4 font-medium">Precio / m²</td>
              {properties.map(p => {
                const pricePerSqm = p.price / p.area;
                return (
                  <td key={p.id} className={`p-4 text-center ${pricePerSqm === lowestPricePerSqm ? 'text-green-600 font-bold bg-green-50/50 dark:bg-green-900/10' : ''}`}>
                    ${pricePerSqm.toFixed(2)}
                  </td>
                );
              })}
            </tr>
            {/* Habitaciones */}
            <tr>
              <td className="p-4 font-medium">Habitaciones</td>
              {properties.map(p => (
                <td key={p.id} className="p-4 text-center">{p.bedrooms}</td>
              ))}
            </tr>
            {/* Baños */}
            <tr>
              <td className="p-4 font-medium">Baños</td>
              {properties.map(p => (
                <td key={p.id} className="p-4 text-center">{p.bathrooms}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}