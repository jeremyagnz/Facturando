// useMemo nos permite calcular un valor solo cuando cambian sus dependencias
// useState es el hook para guardar datos que pueden cambiar
import { useMemo, useState } from 'react'
// Funciones matemáticas para calcular el subtotal, ITBIS y total de la factura
import {
  calculateItbis,
  calculateSubtotal,
  calculateTotal,
  normalizeNonNegativeNumber,
} from '../utils/invoiceCalculations'
// Funciones para validar y limpiar los datos del formulario
import { hasFormErrors, sanitizeNcfInput, validateDoc, validateForm, validateNcf } from '../utils/validation'

// Productos de ejemplo que aparecen por defecto al cargar la app
const initialProducts = [
  { id: 1, description: 'Servicio de consultoría', quantity: 1, price: 2500 },
  { id: 2, description: 'Diseño de propuesta', quantity: 2, price: 1200 },
]

// Estado inicial de los errores — todos vacíos al inicio
const initialErrors = { clientName: '', clientDoc: '', clientNcf: '', products: {} }

// Crea un producto vacío con el id que le pasemos
function createEmptyProduct(id) {
  return { id, description: '', quantity: 1, price: 0 }
}

// Calcula cuál sería el próximo id disponible para un producto nuevo
// Toma el id más alto de la lista y le suma 1
function calculateNextProductId(products) {
  return products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1
}

// Normaliza el valor de un campo de producto:
// si es cantidad o precio, lo convierte a número no negativo
// si es otro campo (descripción), lo deja igual
function normalizeProductField(field, value) {
  if (field === 'quantity' || field === 'price') {
    return normalizeNonNegativeNumber(value)
  }
  return value
}

// Cuando el usuario sale del input de cantidad, si el valor es 0 lo cambiamos a 1
// porque no tiene sentido tener 0 unidades de algo
function normalizeQuantityBlurValue(value) {
  return value === 0 ? 1 : value
}

// Hook principal que contiene toda la lógica del formulario de factura
// Devuelve los datos actuales y las funciones para modificarlos
export function useInvoiceForm() {
  // Estado del cliente
  const [clientName, setClientName] = useState('')
  const [clientDoc, setClientDoc] = useState('')
  const [clientNcf, setClientNcf] = useState('')
  // Lista de productos de la factura
  const [products, setProducts] = useState(initialProducts)
  // ID que se le asignará al próximo producto que se agregue
  const [nextProductId, setNextProductId] = useState(calculateNextProductId(initialProducts))
  // La factura generada — es null hasta que el usuario envía el formulario
  const [invoice, setInvoice] = useState(null)
  // Errores de validación de cada campo
  const [errors, setErrors] = useState(initialErrors)

  // Recalculamos subtotal, ITBIS y total cada vez que cambia la lista de productos
  // useMemo evita recalcular si products no cambió
  const { subtotal, itbis, total } = useMemo(() => {
    const nextSubtotal = calculateSubtotal(products)
    const nextItbis = calculateItbis(nextSubtotal)
    return { subtotal: nextSubtotal, itbis: nextItbis, total: calculateTotal(nextSubtotal, nextItbis) }
  }, [products])

  // Actualiza un campo específico de un producto (descripción, cantidad o precio)
  const handleProductChange = (productId, field, value) => {
    const normalizedValue = normalizeProductField(field, value)
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        // Solo modificamos el producto cuyo id coincide
        product.id !== productId ? product : { ...product, [field]: normalizedValue },
      ),
    )
  }

  // Se ejecuta cuando el usuario sale del input de cantidad
  // Si quedó en 0, lo corregimos a 1
  const handleProductBlur = (productId, field) => {
    setProducts((currentProducts) => {
      const productIndex = currentProducts.findIndex((p) => p.id === productId)
      // Si no encontramos el producto o no es el campo cantidad, no hacemos nada
      if (productIndex === -1 || field !== 'quantity') return currentProducts

      const product = currentProducts[productIndex]
      const normalizedValue = normalizeQuantityBlurValue(product.quantity)
      // Si el valor no cambió, devolvemos el mismo array para evitar re-renders
      if (normalizedValue === product.quantity) return currentProducts

      const nextProducts = [...currentProducts]
      nextProducts[productIndex] = { ...product, quantity: normalizedValue }
      return nextProducts
    })
  }

  // Agrega un producto vacío al final de la lista y actualiza el contador de IDs
  const handleAddProduct = () => {
    setProducts((currentProducts) => [...currentProducts, createEmptyProduct(nextProductId)])
    setNextProductId((currentId) => currentId + 1)
  }

  // Elimina el producto con el id recibido de la lista
  const handleRemoveProduct = (productId) => {
    setProducts((currentProducts) => currentProducts.filter((p) => p.id !== productId))
  }

  // Actualiza el nombre del cliente y valida que no esté vacío
  const handleClientNameChange = (value) => {
    setClientName(value)
    setErrors((e) => ({ ...e, clientName: value.trim() ? '' : 'El nombre es obligatorio.' }))
  }

  // Actualiza el documento del cliente y lo valida (RNC o cédula)
  const handleClientDocChange = (value) => {
    setClientDoc(value)
    setErrors((e) => ({ ...e, clientDoc: validateDoc(value) }))
  }

  // Limpia el NCF de caracteres especiales, lo pone en mayúsculas y lo valida
  const handleClientNcfChange = (value) => {
    const sanitized = sanitizeNcfInput(value)
    setClientNcf(sanitized)
    setErrors((e) => ({ ...e, clientNcf: validateNcf(sanitized) }))
  }

  // Resetea todo el formulario a su estado inicial para empezar una nueva factura
  const handleNewInvoice = () => {
    setInvoice(null)
    setClientName('')
    setClientDoc('')
    setClientNcf('')
    setProducts(initialProducts)
    setNextProductId(calculateNextProductId(initialProducts))
    setErrors(initialErrors)
  }

  // Se ejecuta al enviar el formulario:
  // 1) valida todos los campos
  // 2) si hay errores los muestra y detiene el envío
  // 3) si todo está bien, genera el objeto factura con la fecha actual
  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validateForm({ clientName, clientDoc, clientNcf, products })
    setErrors(nextErrors)
    if (hasFormErrors(nextErrors)) return
    setInvoice({ clientName, clientDoc, clientNcf, products, subtotal, itbis, total, date: new Date() })
  }

  // Devolvemos todos los datos y funciones que los componentes necesitan
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
