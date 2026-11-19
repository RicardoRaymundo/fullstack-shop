'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProducts, deleteProduct } from '@/services/productService';
import { toast, Toaster } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estado para controlar o modal de confirmação de exclusão
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar os produtos.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('access_token');
    router.push('/login');
  }

  async function handleConfirmDelete() {
    if (!productToDelete) return;

    setDeleting(true);
    setError('');

    try {
      await deleteProduct(productToDelete.id);
      setProducts((prev) => prev.filter((item) => item.id !== productToDelete.id));
      setProductToDelete(null);
      toast.success('Produto eliminado com sucesso!');
    } catch (err: any) {
      toast.error(err.message || 'Não foi possível eliminar o produto.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Lista de Produtos</h1>
            <p className="text-sm text-gray-500 mt-1">Gerencie o catálogo de produtos da sua loja</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/products/new"
              className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors text-sm"
            >
              + Novo Produto
            </a>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2.5 rounded-lg transition-colors text-sm"
            >
              Sair
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500 animate-pulse py-4">Carregando produtos...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500 py-4">Nenhum produto cadastrado ainda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between gap-4"
              >
                <div>
                  <h2 className="font-semibold text-lg text-gray-900 mb-1">{product.name}</h2>
                  <p className="text-gray-500 text-sm">{product.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-indigo-600 font-bold text-base">
                    {product.price.toFixed(2)} €
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/products/${product.id}`}
                      className="text-xs font-medium px-2.5 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Editar
                    </a>
                    <button
                      type="button"
                      onClick={() => setProductToDelete(product)}
                      className="text-xs font-medium px-2.5 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Confirmação */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Eliminar produto</h2>
            <p className="text-sm text-gray-600 mt-2">
              Tens a certeza que queres eliminar{' '}
              <span className="font-semibold text-gray-900">{productToDelete.name}</span>? Esta ação não pode ser desfeita.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleting ? 'A eliminar...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}