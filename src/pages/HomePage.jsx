const sampleProducts = [
  { description: 'Servicio de consultoría', quantity: '1', unitPrice: 'RD$ 2,500.00', subtotal: 'RD$ 2,500.00' },
  { description: 'Diseño de propuesta', quantity: '2', unitPrice: 'RD$ 1,200.00', subtotal: 'RD$ 2,400.00' },
]

const sampleSummary = {
  subtotal: 'RD$ 4,900.00',
  itbis: 'RD$ 882.00',
  total: 'RD$ 5,782.00',
}

function HomePage() {
  return (
    <section className="flex flex-1 justify-center py-6 sm:py-10">
      <div className="w-full max-w-6xl">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Generador de Facturas</h1>
        </header>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/40 backdrop-blur sm:p-8">
          <section>
            <h2 className="text-lg font-medium text-white sm:text-xl">Datos del Cliente</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <label htmlFor="client-name" className="mb-2 block text-sm font-medium text-slate-200">
                  Nombre del Cliente
                </label>
                <input
                  id="client-name"
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                />
              </div>

              <div>
                <label htmlFor="client-doc" className="mb-2 block text-sm font-medium text-slate-200">
                  RNC/Cédula
                </label>
                <input
                  id="client-doc"
                  type="text"
                  placeholder="Ej. 001-1234567-8"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                />
              </div>

              <div>
                <label htmlFor="client-ncf" className="mb-2 block text-sm font-medium text-slate-200">
                  NCF
                </label>
                <input
                  id="client-ncf"
                  type="text"
                  placeholder="Ej. B0100000001"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                />
              </div>
            </div>
          </section>

          <section className="mt-8">
            <div className="overflow-hidden rounded-2xl border border-slate-800">
              <div className="overflow-x-auto">
                <table aria-label="Lista de productos de la factura" className="min-w-full divide-y divide-slate-800 text-left">
                  <caption className="sr-only">Lista de productos de la factura</caption>
                  <thead className="bg-slate-950/60">
                    <tr>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-200">Descripción</th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-200">Cantidad</th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-200">Precio Unitario</th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-200">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/40 text-sm text-slate-300">
                    {sampleProducts.map((product) => (
                      <tr key={`${product.description}-${product.quantity}`}>
                        <td className="px-4 py-4">{product.description}</td>
                        <td className="px-4 py-4">{product.quantity}</td>
                        <td className="px-4 py-4">{product.unitPrice}</td>
                        <td className="px-4 py-4">{product.subtotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              type="button"
              className="mt-4 inline-flex items-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-400/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            >
              Agregar Producto
            </button>
          </section>

          <section className="mt-8 flex justify-end">
            <div className="w-full max-w-xs rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
              <h3 className="text-base font-medium text-white">Resumen</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between text-slate-300">
                  <dt>Subtotal</dt>
                  <dd>{sampleSummary.subtotal}</dd>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <dt>ITBIS</dt>
                  <dd>{sampleSummary.itbis}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-base font-semibold text-white">
                  <dt>Total</dt>
                  <dd>{sampleSummary.total}</dd>
                </div>
              </dl>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}

export default HomePage
