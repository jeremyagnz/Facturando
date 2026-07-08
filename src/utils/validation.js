export function sanitizeNcfInput(value) {
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
}

export function validateNcf(value) {
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

export function validateDoc(value) {
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

export function isValidPositiveInteger(value) {
  return Number.isFinite(value) && value > 0 && Number.isInteger(value)
}

export function validateForm({ clientName, clientDoc, clientNcf, products }) {
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

export function hasFormErrors(errors) {
  return (
    Boolean(errors.clientName) ||
    Boolean(errors.clientDoc) ||
    Boolean(errors.clientNcf) ||
    Object.keys(errors.products).length > 0
  )
}
