import { Suspense } from 'react';
import ProductFormContent from './components/ProductFormContent';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">A carregar...</div>}>
      <ProductFormContent />
    </Suspense>
  );
}