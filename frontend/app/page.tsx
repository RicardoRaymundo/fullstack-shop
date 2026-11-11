'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Incremento fluido por passos de tempo
    const startTime = Date.now();
    const duration = 2000; // 2 segundos de animação

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(Math.floor((elapsed / duration) * 100), 100);
      
      setProgress(currentProgress);

      if (currentProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        // Chegou a 100%, inicia o fade-out e redireciona
        setIsFadingOut(true);
        setTimeout(() => {
          router.push('/login');
        }, 500);
      }
    };

    const animationFrame = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrame);
  }, [router]);

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex flex-col items-center space-y-6">
        {/* Logo com efeito visual */}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/50 animate-pulse">
          <span className="text-3xl font-bold tracking-wider">FS</span>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Fullstack Shop</h1>
          <p className="text-sm text-slate-400">A carregar ambiente de produção...</p>
        </div>

        {/* Barra de progresso */}
        <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-slate-500 font-mono">{progress}%</span>
      </div>
    </main>
  );
}