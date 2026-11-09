import { Suspense } from "react";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
}

async function ProductList() {
  const loginRes = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@admin.com', pass: '123456' }),
  });
  
  const { access_token } = await loginRes.json();

  const res = await fetch('http://localhost:3000/products', {
    headers: { Authorization: `Bearer ${access_token}` },
    cache: 'no-store',
  });
  
  const products: Product[] = await res.json();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
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
  );
}

export default function ProductsPage() {
  return (
    // Fundo cinza claro padrão em toda a tela (min-h-screen bg-gray-50) e largura fluida com padding (max-w-7xl mx-auto px-6 py-10)
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Lista de Produtos</h1>
            <p className="text-sm text-gray-500 mt-1">Gerencie o catálogo de produtos da sua loja</p>
          </div>
          <a
            href="/products/new"
            className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors text-sm"
          >
            + Novo Produto
          </a>
        </div>

        {/* Lista / Grid de Produtos */}
        <Suspense fallback={<p className="text-gray-500 animate-pulse py-4">Carregando produtos...</p>}>
          <ProductList />
        </Suspense>

      </main>
    </div>
  );
}