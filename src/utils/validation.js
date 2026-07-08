// Elimina cualquier carácter que no sea letra o número del NCF
// y lo convierte a mayúsculas para estandarizarlo
export function sanitizeNcfInput(value) {
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
}

// Valida que el NCF tenga el formato correcto:
// - obligatorio
// - exactamente 11 caracteres
// - solo letras y números
// - debe comenzar con B01 o B02
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

  // Solo se aceptan comprobantes B01 (crédito fiscal) y B02 (consumidor final)
  const upperCasedNcf = normalizedValue.toUpperCase()
  if (!upperCasedNcf.startsWith('B01') && !upperCasedNcf.startsWith('B02')) {
    return 'El NCF debe comenzar con B01 o B02.'
  }

  // Si llegamos aquí, el NCF es válido
  return ''
}

// Valida una cédula dominicana usando el algoritmo de dígito verificador
// Recibe los 11 dígitos como string y devuelve true si la cédula es válida
function validateDominicanCedula(digits) {
  // Pesos alternados 1 y 2 para los primeros 10 dígitos
  const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2]
  let sum = 0

  for (let i = 0; i < 10; i++) {
    // Multiplicamos cada dígito por su peso
    let product = parseInt(digits[i], 10) * weights[i]
    // Si el resultado es mayor a 9, le restamos 9 (equivale a sumar los dígitos)
    if (product > 9) product -= 9
    sum += product
  }

  // El dígito verificador se calcula con esta fórmula
  const expectedCheckDigit = (10 - (sum % 10)) % 10
  // Comparamos con el último dígito de la cédula
  return parseInt(digits[10], 10) === expectedCheckDigit
}

// Valida el campo RNC/Cédula:
// - RNC: 9 dígitos (solo se verifica la longitud)
// - Cédula: 11 dígitos (se verifica con el algoritmo de dígito verificador)
export function validateDoc(value) {
  if (!value.trim()) {
    return 'El RNC/Cédula es obligatorio.'
  }

  // Quitamos todo lo que no sea número para contar solo los dígitos
  const digits = value.replace(/\D/g, '')

  if (digits.length === 9) {
    // RNC válido (solo verificamos la longitud)
    return ''
  }

  if (digits.length === 11) {
    // Cédula: verificamos con el algoritmo
    if (!validateDominicanCedula(digits)) {
      return 'La cédula no es válida.'
    }
    return ''
  }

  return 'El RNC debe tener 9 dígitos o la cédula debe tener 11 dígitos.'
}

// Verifica que un valor sea un número entero positivo (mayor que 0)
// Lo usamos para validar las cantidades de los productos
export function isValidPositiveInteger(value) {
  return Number.isFinite(value) && value > 0 && Number.isInteger(value)
}

// Valida todo el formulario de una vez y devuelve un objeto con los errores
// Si un campo no tiene error, su valor es string vacío ''
export function validateForm({ clientName, clientDoc, clientNcf, products }) {
  // Inicializamos el objeto de errores con todo vacío
  const errors = {
    clientName: '',
    clientDoc: '',
    clientNcf: '',
    products: {},
  }

  // Validamos que el nombre no esté en blanco
  if (!clientName.trim()) {
    errors.clientName = 'El nombre es obligatorio.'
  }

  // Validamos el documento: primero que no esté vacío, luego el formato
  if (!clientDoc.trim()) {
    errors.clientDoc = 'El RNC/Cédula es obligatorio.'
  } else {
    errors.clientDoc = validateDoc(clientDoc)
  }

  // Validamos el NCF con su función específica
  errors.clientNcf = validateNcf(clientNcf)

  // Validamos cada producto: cantidad y precio deben ser números válidos y positivos
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

    // Solo guardamos errores para los productos que los tienen
    if (Object.keys(productErrors).length > 0) {
      errors.products[product.id] = productErrors
    }
  })

  return errors
}

// Revisa si el objeto de errores tiene al menos un error
// Devuelve true si hay algún error, false si todo está bien
export function hasFormErrors(errors) {
  return (
    Boolean(errors.clientName) ||
    Boolean(errors.clientDoc) ||
    Boolean(errors.clientNcf) ||
    Object.keys(errors.products).length > 0
  )
}
