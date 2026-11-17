'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function HomePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                    Bem-vindo ao Painel de Administração
                </h1>
            </div>
        </div>
    );
}