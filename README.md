# 🛍️ Fullstack Shop

Uma aplicação e-commerce fullstack moderna com arquitetura Monorepo, contendo API RESTful em NestJS, ORM Prisma com banco de dados PostgreSQL e interface reativa SSR/RSC construída com Next.js 14 e Tailwind CSS.

---

## 🔗 Links de Produção

* **Frontend (Vercel):** [https://fullstack-shop-nu.vercel.app](https://fullstack-shop-nu.vercel.app)
* **Backend (Render):** `https://fullstack-shop-api.onrender.com` *(Endpoints protegidos por JWT)*

---

## 🚀 Tecnologias Utilizadas

### Backend
* **Node.js** & **NestJS**: Arquitetura modular e escalável.
* **Prisma ORM**: Modelagem e manipulação tipada do banco PostgreSQL.
* **PostgreSQL (Neon.tech)**: Banco de dados relacional hospedado em nuvem.
* **Passport.js & JWT**: Autenticação stateless com tokens seguros.
* **Class Validator & Swagger**: Validação de DTOs e documentação interativa da API.

### Frontend
* **Next.js 14 (App Router)**: Renderização híbrida (Server & Client Components).
* **React 18 & TypeScript**: Tipagem estática fim a fim.
* **Tailwind CSS**: Estilização moderna e layout responsivo de tela cheia.
* **React Hook Form**: Manipulação otimizada de formulários.

### DevOps & Infraestrutura
* **GitHub Actions**: Pipeline de CI/CD para automação de validações, geração do Prisma Client e build.
* **Vercel**: Hospedagem global para o frontend Next.js.
* **Render**: Servidor de aplicação em nuvem para a API NestJS.

---

## 📐 Estrutura do Monorepo

```text
fullstack-shop/
├── .github/
│   └── workflows/
│       └── ci.yml             # Pipeline de CI/CD do GitHub Actions
├── backend/                    # API NestJS
│   ├── prisma/
│   │   └── schema.prisma      # Modelagem das entidades e banco
│   ├── src/
│   │   ├── auth/              # Módulo de Autenticação JWT & Guardas
│   │   ├── products/          # CRUD de Produtos, DTOs e Controllers
│   │   └── main.ts            # Bootstrapping e documentação Swagger
│   └── package.json
└── frontend/                   # Aplicação Next.js
    ├── src/
    │   ├── app/               # App Router (Pages, Layouts e Client Components)
    │   └── components/        # Componentes visuais reutilizáveis
    └── package.json