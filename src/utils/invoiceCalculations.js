// Tasa del ITBIS en República Dominicana: 18%
export const ITBIS_RATE = 0.18

// Convierte cualquier valor a número y lo redondea a 2 decimales
// Si el valor no es un número válido, devuelve 0
export function roundToTwoDecimals(value) {
  const numericValue = Number(value ?? 0)

  // Si la conversión falló (por ejemplo con texto), devolvemos 0
  if (Number.isNaN(numericValue)) {
    return 0
  }

  return Number(numericValue.toFixed(2))
}

// Convierte un valor de input a número no negativo
// Si el campo está vacío o el valor es inválido, devuelve 0
export function normalizeNonNegativeNumber(value) {
  if (value === '') {
    return 0
  }

  const numericValue = Number(value)

  // Si no es un número válido, devolvemos 0
  if (Number.isNaN(numericValue)) {
    return 0
  }

  // Math.max asegura que no se guarden valores negativos
  return Math.max(0, numericValue)
}

// Calcula el subtotal de un producto multiplicando cantidad × precio
// y redondeando a 2 decimales
export function calculateProductSubtotal(product) {
  return roundToTwoDecimals(product.quantity * product.price)
}

// Suma los subtotales de todos los productos para obtener el subtotal general
export function calculateSubtotal(products) {
  return roundToTwoDecimals(
    products.reduce((accumulator, product) => accumulator + calculateProductSubtotal(product), 0),
  )
}

// Calcula el ITBIS aplicando la tasa (18%) al subtotal
export function calculateItbis(subtotal) {
  return roundToTwoDecimals(subtotal * ITBIS_RATE)
}

// Calcula el total sumando el subtotal más el ITBIS
export function calculateTotal(subtotal, itbis) {
  return roundToTwoDecimals(subtotal + itbis)
}
