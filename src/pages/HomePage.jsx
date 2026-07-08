function HomePage() {
  return (
    <section className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/70 p-10 shadow-2xl shadow-slate-950/40 backdrop-blur">
        <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-300">
          React + Vite + Tailwind CSS
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Facturando está listo para comenzar.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          Esta base inicial incluye una estructura organizada para componentes, páginas, hooks, utilidades y estilos,
          preparada para empezar el desarrollo sin lógica de negocio.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h2 className="text-lg font-medium text-white">Estructura inicial</h2>
            <p className="mt-2 text-sm text-slate-400">src/components, src/pages, src/hooks, src/utils y src/styles.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h2 className="text-lg font-medium text-white">Tooling</h2>
            <p className="mt-2 text-sm text-slate-400">Vite para desarrollo, ESLint para calidad y Tailwind CSS para estilos.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomePage
