import { useMemo, useState } from 'react'
import {
  calculateItbis,
  calculateSubtotal,
  calculateTotal,
  normalizeNonNegativeNumber,
} from '../utils/invoiceCalculations'
import { hasFormErrors, sanitizeNcfInput, validateDoc, validateForm, validateNcf } from '../utils/validation'

const initialProducts = [
  { id: 1, description: 'Servicio de consultoría', quantity: 1, price: 2500 },
  { id: 2, description: 'Diseño de propuesta', quantity: 2, price: 1200 },
]

const initialErrors = { clientName: '', clientDoc: '', clientNcf: '', products: {} }

function createEmptyProduct(id) {
  return { id, description: '', quantity: 1, price: 0 }
}

function calculateNextProductId(products) {
  return products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1
}

function normalizeProductField(field, value) {
  if (field === 'quantity' || field === 'price') {
    return normalizeNonNegativeNumber(value)
  }
  return value
}

function normalizeQuantityBlurValue(value) {
  return value === 0 ? 1 : value
}

export function useInvoiceForm() {
  const [clientName, setClientName] = useState('')
  const [clientDoc, setClientDoc] = useState('')
  const [clientNcf, setClientNcf] = useState('')
  const [products, setProducts] = useState(initialProducts)
  const [nextProductId, setNextProductId] = useState(calculateNextProductId(initialProducts))
  const [invoice, setInvoice] = useState(null)
  const [errors, setErrors] = useState(initialErrors)

  const { subtotal, itbis, total } = useMemo(() => {
    const nextSubtotal = calculateSubtotal(products)
    const nextItbis = calculateItbis(nextSubtotal)
    return { subtotal: nextSubtotal, itbis: nextItbis, total: calculateTotal(nextSubtotal, nextItbis) }
  }, [products])

  const handleProductChange = (productId, field, value) => {
    const normalizedValue = normalizeProductField(field, value)
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id !== productId ? product : { ...product, [field]: normalizedValue },
      ),
    )
  }

  const handleProductBlur = (productId, field) => {
    setProducts((currentProducts) => {
      const productIndex = currentProducts.findIndex((p) => p.id === productId)
      if (productIndex === -1 || field !== 'quantity') return currentProducts

      const product = currentProducts[productIndex]
      const normalizedValue = normalizeQuantityBlurValue(product.quantity)
      if (normalizedValue === product.quantity) return currentProducts

      const nextProducts = [...currentProducts]
      nextProducts[productIndex] = { ...product, quantity: normalizedValue }
      return nextProducts
    })
  }

  const handleAddProduct = () => {
    setProducts((currentProducts) => [...currentProducts, createEmptyProduct(nextProductId)])
    setNextProductId((currentId) => currentId + 1)
  }

  const handleRemoveProduct = (productId) => {
    setProducts((currentProducts) => currentProducts.filter((p) => p.id !== productId))
  }

  const handleClientNameChange = (value) => {
    setClientName(value)
    setErrors((e) => ({ ...e, clientName: value.trim() ? '' : 'El nombre es obligatorio.' }))
  }

  const handleClientDocChange = (value) => {
    setClientDoc(value)
    setErrors((e) => ({ ...e, clientDoc: validateDoc(value) }))
  }

  const handleClientNcfChange = (value) => {
    const sanitized = sanitizeNcfInput(value)
    setClientNcf(sanitized)
    setErrors((e) => ({ ...e, clientNcf: validateNcf(sanitized) }))
  }

  const handleNewInvoice = () => {
    setInvoice(null)
    setClientName('')
    setClientDoc('')
    setClientNcf('')
    setProducts(initialProducts)
    setNextProductId(calculateNextProductId(initialProducts))
    setErrors(initialErrors)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validateForm({ clientName, clientDoc, clientNcf, products })
    setErrors(nextErrors)
    if (hasFormErrors(nextErrors)) return
    setInvoice({ clientName, clientDoc, clientNcf, products, subtotal, itbis, total, date: new Date() })
  }

  return {
    clientName,
    clientDoc,
    clientNcf,
    products,
    invoice,
    errors,
    subtotal,
    itbis,
    total,
    handleProductChange,
    handleProductBlur,
    handleAddProduct,
    handleRemoveProduct,
    handleClientNameChange,
    handleClientDocChange,
    handleClientNcfChange,
    handleNewInvoice,
    handleSubmit,
  }
}
