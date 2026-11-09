interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
}

// async function getProducts(): Promise<Product[]> {
//   try {
//     const res = await fetch('http://localhost:3000/products', {
//       cache: 'no-store', // Garante que busca sempre os dados atualizados
//     });

//     if (!res.ok) {
//       throw new Error('Falha ao buscar produtos');
//     }

//     return res.json();
//   } catch (error) {
//     console.error('Erro na requisição:', error);
//     return [];
//   }
// };

async function getProductsWithBypass(): Promise<Product[]> {
  try {
    // 1. Faz o login automático com as credenciais do backend para obter o token
    const loginRes = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@admin.com',
        pass: '123456',
      }),
      cache: 'no-store',
    });

    if (!loginRes.ok) {
      throw new Error('Falha no bypass de autenticação');
    }

    const { access_token } = await loginRes.json();

    // 2. Usa o token obtido para buscar os produtos na rota protegida
    const productsRes = await fetch('http://localhost:3000/products', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: 'no-store',
    });

    if (!productsRes.ok) {
      throw new Error('Falha ao buscar produtos');
    }

    return productsRes.json();
  } catch (error) {
    console.error('Erro no bypass/requisição:', error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProductsWithBypass();

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Lista de Produtos</h1>

        {products.length === 0 ? (
          <p className="text-gray-500">Nenhum produto cadastrado ou API indisponível.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                  <p className="text-gray-600 text-sm mt-1">{product.description || 'Sem descrição'}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">
                    R$ {Number(product.price).toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{product.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}