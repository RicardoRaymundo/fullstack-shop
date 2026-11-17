'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ProductFormPage() {
  const router = useRouter();
  const params = useParams();
  
  // Identifica se estamos a criar ou a editar com base no ID do URL
  const productId = params?.id;
  const isEditing = productId && productId !== 'new';

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  // Se for edição, busca os dados atuais do produto para preencher o formulário
  useEffect(() => {
    if (!isEditing) return;

    async function fetchProduct() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${API_URL}/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Erro ao carregar dados do produto.');

        const data = await res.json();
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

    fetchProduct();
  }, [isEditing, productId, API_URL]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Define dinamicamente o método HTTP e o endpoint dependendo da ação
      const endpoint = isEditing ? `${API_URL}/products/${productId}` : `${API_URL}/products`;
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
        }),
      });

      if (!res.ok) throw new Error(isEditing ? 'Erro ao atualizar produto' : 'Erro ao cadastrar produto');

      router.push('/products');
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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Pão Artesanal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Feito com fermentação natural"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço (€ / R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 shadow-sm text-sm"
              >
                {loading ? 'Salvando...' : isEditing ? 'Guardar Alterações' : 'Cadastrar Produto'}
              </button>
              <a
                href="/products"
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium text-sm text-center flex items-center justify-center"
              >
                Cancelar
              </a>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}