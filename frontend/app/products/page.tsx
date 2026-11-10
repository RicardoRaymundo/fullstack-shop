'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    async function fetchProducts() {
      const token = localStorage.getItem('access_token');

      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`${API_URL}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('access_token');
            router.push('/login');
            return;
          }
          throw new Error('Erro ao carregar os produtos.');
        }

        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'Erro de conexão com o servidor.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('access_token');
    router.push('/login');
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
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <h2 className="font-semibold text-lg text-gray-900 mb-1">{product.name}</h2>
                  <p className="text-gray-500 text-sm mb-4">{product.description}</p>
                </div>
                <span className="text-indigo-600 font-bold text-base">
                  R$ {product.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}