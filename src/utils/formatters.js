export const currencyFormatter = new Intl.NumberFormat('es-DO', {
  style: 'currency',
  currency: 'DOP',
  minimumFractionDigits: 2,
})

export const dateFormatter = new Intl.DateTimeFormat('es-DO', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})
