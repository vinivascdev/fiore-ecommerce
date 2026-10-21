export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-amber-100 text-center">
        <span className="text-xs uppercase tracking-widest font-semibold text-amber-700 bg-amber-100/60 px-3 py-1 rounded-full">
          Haute Parfumerie
        </span>
        <h1 className="text-4xl font-serif font-bold text-stone-900 mt-4 tracking-tight">
          Fiore
        </h1>
        <p className="text-stone-600 mt-2 text-sm leading-relaxed">
          Estrutura base do frontend pronta para desenvolvimento com React, TypeScript e Tailwind CSS.
        </p>
        <div className="mt-6 pt-6 border-t border-stone-100 text-xs text-stone-400">
          API Backend: <span className="font-mono text-stone-600">http://localhost:3333</span>
        </div>
      </div>
    </div>
  );
}
