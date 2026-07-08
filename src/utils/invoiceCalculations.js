export const ITBIS_RATE = 0.18

export function roundToTwoDecimals(value) {
  return Math.round(value * 100) / 100
}

export function normalizeNonNegativeNumber(value) {
  if (value === '') {
    return 0
  }

  const numericValue = Number(value)

  if (Number.isNaN(numericValue)) {
    return 0
  }

  return Math.max(0, numericValue)
}

export function calculateProductSubtotal(product) {
  return roundToTwoDecimals(product.quantity * product.price)
}

export function calculateSubtotal(products) {
  return roundToTwoDecimals(
    products.reduce((accumulator, product) => accumulator + calculateProductSubtotal(product), 0),
  )
}

export function calculateItbis(subtotal) {
  return roundToTwoDecimals(subtotal * ITBIS_RATE)
}

export function calculateTotal(subtotal, itbis) {
  return roundToTwoDecimals(subtotal + itbis)
}
