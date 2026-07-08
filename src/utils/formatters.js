// Formateador de moneda para pesos dominicanos (DOP)
// Ejemplo de salida: "RD$ 1,234.56"
export const currencyFormatter = new Intl.NumberFormat('es-DO', {
  style: 'currency',
  currency: 'DOP',
  minimumFractionDigits: 2,
})

// Formateador de fecha en español dominicano
// Ejemplo de salida: "8 de julio de 2026"
export const dateFormatter = new Intl.DateTimeFormat('es-DO', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})
