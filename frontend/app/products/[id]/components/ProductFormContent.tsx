'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getProductById, createProduct, updateProduct } from '@/services/productService';

export default function ProductFormContent() {
  const router = useRouter();
  const params = useParams();

  const productId = params?.id as string;
  const isEditing = productId && productId !== 'new';

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(Boolean(isEditing));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditing) return;

    async function loadProduct() {
      try {
        const data = await getProductById(productId);
        setName(data.name);
        setDescription(data.description || '');
        setPrice(data.price.toString());
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar as informações do produto.');
      } finally {
        setFetching(false);
      }
    }

    loadProduct();
  }, [isEditing, productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        name,
        description,
        price: Number(price),
      };

      if (isEditing) {
        await updateProduct(productId, payload);
      } else {
        await createProduct(payload);
      }

      router.push('/products');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError('Ocorreu um erro ao salvar o produto.');
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
        A carregar dados do produto...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-950">
      <main className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">
            {isEditing ? 'Editar Produto' : 'Novo Produto'}
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                placeholder="Ex: Pão Artesanal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                placeholder="Ex: Feito com fermentação natural"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$ / €)</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                placeholder="0.00"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 shadow-sm text-sm"
              >
                {loading ? 'A salvar...' : isEditing ? 'Guardar Alterações' : 'Cadastrar Produto'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/products')}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium text-sm text-center flex items-center justify-center"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}