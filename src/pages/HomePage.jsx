import { useMemo, useState } from 'react'
import InvoiceView from '../components/InvoiceView'
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

function normalizeQuantityBlurValue(value) {
  if (value === 0) {
    return 1
  }

  return value
}

function calculateNextProductId(products) {
  return products.length > 0 ? Math.max(...products.map((product) => product.id)) + 1 : 1
}

function validateNcf(value) {
  const normalizedValue = value.trim()

  if (!normalizedValue) {
    return 'El NCF es obligatorio.'
  }

  if (normalizedValue.length !== 11) {
    return 'El NCF debe tener exactamente 11 caracteres.'
  }

  if (!/^[a-zA-Z0-9]+$/.test(normalizedValue)) {
    return 'El NCF debe ser alfanumérico.'
  }

  const upperCasedNcf = normalizedValue.toUpperCase()
  if (!upperCasedNcf.startsWith('B01') && !upperCasedNcf.startsWith('B02')) {
    return 'El NCF debe comenzar con B01 o B02.'
  }

  return ''
}

function validateDominicanCedula(digits) {
  const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2]
  let sum = 0

  for (let i = 0; i < 10; i++) {
    let product = parseInt(digits[i], 10) * weights[i]
    if (product > 9) product -= 9
    sum += product
  }

  const expectedCheckDigit = (10 - (sum % 10)) % 10
  return parseInt(digits[10], 10) === expectedCheckDigit
}

function validateDoc(value) {
  if (!value.trim()) {
    return 'El RNC/Cédula es obligatorio.'
  }

  const digits = value.replace(/\D/g, '')

  if (digits.length === 9) {
    return ''
  }

  if (digits.length === 11) {
    if (!validateDominicanCedula(digits)) {
      return 'La cédula no es válida.'
    }
    return ''
  }

  return 'El RNC debe tener 9 dígitos o la cédula debe tener 11 dígitos.'
}

function validateForm({ clientName, clientDoc, clientNcf, products }) {
  const errors = {
    clientName: '',
    clientDoc: '',
    clientNcf: '',
    products: {},
  }

  if (!clientName.trim()) {
    errors.clientName = 'El nombre es obligatorio.'
  }

  if (!clientDoc.trim()) {
    errors.clientDoc = 'El RNC/Cédula es obligatorio.'
  } else {
    errors.clientDoc = validateDoc(clientDoc)
  }

  errors.clientNcf = validateNcf(clientNcf)

  products.forEach((product) => {
    const productErrors = {}

    const normalizedQuantity = Number(product.quantity)
    if (!isValidPositiveInteger(normalizedQuantity)) {
      productErrors.quantity = 'La cantidad debe ser un número entero mayor que 0.'
    }

    const normalizedPrice = Number(product.price)
    if (!Number.isFinite(normalizedPrice) || normalizedPrice <= 0) {
      productErrors.price = 'El precio debe ser un número mayor que 0.'
    }

    if (Object.keys(productErrors).length > 0) {
      errors.products[product.id] = productErrors
    }
  })

  return errors
}

function isValidPositiveInteger(value) {
  return Number.isFinite(value) && value > 0 && Number.isInteger(value)
}

function hasFormErrors(errors) {
  return (
    Boolean(errors.clientName) ||
    Boolean(errors.clientDoc) ||
    Boolean(errors.clientNcf) ||
    Object.keys(errors.products).length > 0
  )
}

function HomePage() {
  const [clientName, setClientName] = useState('')
  const [clientDoc, setClientDoc] = useState('')
  const [clientNcf, setClientNcf] = useState('')
  const [products, setProducts] = useState(initialProducts)
  const [nextProductId, setNextProductId] = useState(calculateNextProductId(initialProducts))
  const [invoice, setInvoice] = useState(null)
  const [errors, setErrors] = useState({
    clientName: '',
    clientDoc: '',
    clientNcf: '',
    products: {},
  })

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
    setProducts((currentProducts) => {
      const productIndex = currentProducts.findIndex((product) => product.id === productId)

      if (productIndex === -1 || field !== 'quantity') {
        return currentProducts
      }

      const product = currentProducts[productIndex]
      const normalizedValue = normalizeQuantityBlurValue(product.quantity)

      if (normalizedValue === product.quantity) {
        return currentProducts
      }

      const nextProducts = [...currentProducts]
      nextProducts[productIndex] = {
        ...product,
        quantity: normalizedValue,
      }

      return nextProducts
    })
  }

  const handleAddProduct = () => {
    setProducts((currentProducts) => [...currentProducts, createEmptyProduct(nextProductId)])
    setNextProductId((currentId) => currentId + 1)
  }

  const handleRemoveProduct = (productId) => {
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId))
  }

  const handleClientFieldChange = (value, setter, field, validator) => {
    setter(value)
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validator(value),
    }))
  }

  const handleNewInvoice = () => {
    setInvoice(null)
    setClientName('')
    setClientDoc('')
    setClientNcf('')
    setProducts(initialProducts)
    setNextProductId(calculateNextProductId(initialProducts))
    setErrors({ clientName: '', clientDoc: '', clientNcf: '', products: {} })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = validateForm({
      clientName,
      clientDoc,
      clientNcf,
      products,
    })
    setErrors(nextErrors)

    if (hasFormErrors(nextErrors)) {
      return
    }

    setInvoice({
      clientName,
      clientDoc,
      clientNcf,
      products,
      subtotal,
      itbis,
      total,
      date: new Date(),
    })
  }

  return (
    <section className="flex flex-1 justify-center py-6 sm:py-10">
      <div className="w-full max-w-6xl">
        {invoice ? (
          <InvoiceView invoice={invoice} onNewInvoice={handleNewInvoice} />
        ) : (
          <>
            <header className="mb-6 sm:mb-8">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Generador de Facturas</h1>
            </header>

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/40 backdrop-blur sm:p-8"
            >
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
                      value={clientName}
                      onChange={(event) =>
                        handleClientFieldChange(
                          event.target.value,
                          setClientName,
                          'clientName',
                          (value) => (value.trim() ? '' : 'El nombre es obligatorio.'),
                        )
                      }
                      placeholder="Ej. Juan Pérez"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                    />
                    {errors.clientName ? <p className="mt-2 text-xs text-red-400">{errors.clientName}</p> : null}
                  </div>

                  <div>
                    <label htmlFor="client-doc" className="mb-2 block text-sm font-medium text-slate-200">
                      RNC/Cédula
                    </label>
                    <input
                      id="client-doc"
                      type="text"
                      value={clientDoc}
                      onChange={(event) =>
                        handleClientFieldChange(event.target.value, setClientDoc, 'clientDoc', validateDoc)
                      }
                      placeholder="Ej. 001-1234567-8"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                    />
                    {errors.clientDoc ? <p className="mt-2 text-xs text-red-400">{errors.clientDoc}</p> : null}
                  </div>

                  <div>
                    <label htmlFor="client-ncf" className="mb-2 block text-sm font-medium text-slate-200">
                      NCF
                    </label>
                    <input
                      id="client-ncf"
                      type="text"
                      value={clientNcf}
                      maxLength={11}
                      onChange={(event) => {
                        const sanitized = event.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
                        handleClientFieldChange(sanitized, setClientNcf, 'clientNcf', validateNcf)
                      }}
                      placeholder="Ej. B0100000001"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                    />
                    {errors.clientNcf ? <p className="mt-2 text-xs text-red-400">{errors.clientNcf}</p> : null}
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
                          products.map((product) => {
                            const productErrors = errors.products[product.id]

                            return (
                              <tr key={product.id}>
                                <td className="px-4 py-4">
                                  <input
                                    type="text"
                                    value={product.description}
                                    onChange={(event) =>
                                      handleProductChange(product.id, 'description', event.target.value)
                                    }
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
                                    onChange={(event) =>
                                      handleProductChange(product.id, 'quantity', event.target.value)
                                    }
                                    onBlur={() => handleProductBlur(product.id, 'quantity')}
                                    className="w-24 rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                                  />
                                  {productErrors?.quantity && (
                                    <p className="mt-2 text-xs text-red-400">{productErrors.quantity}</p>
                                  )}
                                </td>
                                <td className="px-4 py-4">
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={product.price}
                                    onChange={(event) =>
                                      handleProductChange(product.id, 'price', event.target.value)
                                    }
                                    className="w-32 rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                                  />
                                  {productErrors?.price && (
                                    <p className="mt-2 text-xs text-red-400">{productErrors.price}</p>
                                  )}
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
                            )
                          })
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

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                >
                  Enviar Factura
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  )
}

export default HomePage
