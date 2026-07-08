import { useMemo, useState } from 'react'
import {
  calculateItbis,
  calculateProductSubtotal,
  calculateSubtotal,
  calculateTotal,
  normalizeNonNegativeNumber,
} from '../utils/invoiceCalculations'

const initialProducts = [
  { id: 1, description: 'Servicio de consultoría', quantity: 1, price: 2500 },
  { id: 2, description: 'Diseño de propuesta', quantity: 2, price: 1200 },
]

const TABLE_COLUMN_COUNT = 5

const currencyFormatter = new Intl.NumberFormat('es-DO', {
  style: 'currency',
  currency: 'DOP',
  minimumFractionDigits: 2,
})

function createEmptyProduct(id) {
  return {
    id,
    description: '',
    quantity: 1,
    price: 0,
  }
}

function normalizeProductField(field, value) {
  if (field === 'quantity' || field === 'price') {
    return normalizeNonNegativeNumber(value)
  }

  return value
}

function normalizeProductBlurValue(field, value) {
  if (field === 'quantity') {
    return value === 0 ? 1 : value
  }

  return value
}

function calculateNextProductId(products) {
  return products.length > 0 ? Math.max(...products.map((product) => product.id)) + 1 : 1
}

function HomePage() {
  const [products, setProducts] = useState(initialProducts)
  const [nextProductId, setNextProductId] = useState(calculateNextProductId(initialProducts))

  const { subtotal, itbis, total } = useMemo(() => {
    const nextSubtotal = calculateSubtotal(products)
    const nextItbis = calculateItbis(nextSubtotal)

    return {
      subtotal: nextSubtotal,
      itbis: nextItbis,
      total: calculateTotal(nextSubtotal, nextItbis),
    }
  }, [products])

  const handleProductChange = (productId, field, value) => {
    const normalizedValue = normalizeProductField(field, value)

    setProducts((currentProducts) =>
      currentProducts.map((product) => {
        if (product.id !== productId) {
          return product
        }

        return {
          ...product,
          [field]: normalizedValue,
        }
      }),
    )
  }

  const handleProductBlur = (productId, field) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) => {
        if (product.id !== productId) {
          return product
        }

        return {
          ...product,
          [field]: normalizeProductBlurValue(field, product[field]),
        }
      }),
    )
  }

  const handleAddProduct = () => {
    setProducts((currentProducts) => [...currentProducts, createEmptyProduct(nextProductId)])
    setNextProductId((currentId) => currentId + 1)
  }

  const handleRemoveProduct = (productId) => {
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId))
  }

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
                <table className="min-w-full divide-y divide-slate-800 text-left">
                  <caption className="sr-only">Lista de productos de la factura</caption>
                  <thead className="bg-slate-950/60">
                    <tr>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-200">Descripción</th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-200">Cantidad</th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-200">Precio</th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-200">Subtotal</th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-200">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/40 text-sm text-slate-300">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={TABLE_COLUMN_COUNT} className="px-4 py-6 text-center text-slate-400">
                          No hay productos. Agrega una nueva fila para comenzar.
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-4 py-4">
                            <input
                              type="text"
                              value={product.description}
                              onChange={(event) => handleProductChange(product.id, 'description', event.target.value)}
                              placeholder="Describe el producto o servicio"
                              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={product.quantity}
                              onChange={(event) => handleProductChange(product.id, 'quantity', event.target.value)}
                              onBlur={() => handleProductBlur(product.id, 'quantity')}
                              className="w-24 rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={product.price}
                              onChange={(event) => handleProductChange(product.id, 'price', event.target.value)}
                              className="w-32 rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                            />
                          </td>
                          <td className="px-4 py-4">
                            {currencyFormatter.format(calculateProductSubtotal(product))}
                          </td>
                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() => handleRemoveProduct(product.id)}
                              className="inline-flex items-center rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-400/20 focus:outline-none focus:ring-2 focus:ring-rose-400/50"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddProduct}
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
                  <dd>{currencyFormatter.format(subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <dt>ITBIS</dt>
                  <dd>{currencyFormatter.format(itbis)}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-base font-semibold text-white">
                  <dt>Total</dt>
                  <dd>{currencyFormatter.format(total)}</dd>
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
