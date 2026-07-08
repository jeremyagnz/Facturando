// Importamos la función que calcula el subtotal de un producto (cantidad × precio)
import { calculateProductSubtotal } from '../utils/invoiceCalculations'
// Importamos el formateador de moneda para mostrar los precios en DOP
import { currencyFormatter } from '../utils/formatters'

// Cuántas columnas tiene la tabla (lo usamos para el colSpan del mensaje vacío)
const TABLE_COLUMN_COUNT = 5

// ProductsTable muestra la tabla editable de productos de la factura
// Permite cambiar descripción, cantidad y precio de cada producto, y agregar o eliminar filas
function ProductsTable({ products, errors, onProductChange, onProductBlur, onAddProduct, onRemoveProduct }) {
  return (
    <section className="mt-8">
      {/* Contenedor con bordes redondeados y scroll horizontal en pantallas pequeñas */}
      <div className="overflow-hidden rounded-2xl border border-slate-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-left">
            {/* Texto oculto para lectores de pantalla */}
            <caption className="sr-only">Lista de productos de la factura</caption>

            {/* Encabezados de la tabla */}
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
              {/* Si no hay productos mostramos un mensaje, si hay los recorremos */}
              {products.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_COLUMN_COUNT} className="px-4 py-6 text-center text-slate-400">
                    No hay productos. Agrega una nueva fila para comenzar.
                  </td>
                </tr>
              ) : (
                // Por cada producto generamos una fila editable
                products.map((product) => {
                  // Errores específicos de este producto (cantidad o precio inválidos)
                  const productErrors = errors.products[product.id]

                  return (
                    <tr key={product.id}>
                      {/* Input de descripción del producto */}
                      <td className="px-4 py-4">
                        <input
                          type="text"
                          value={product.description}
                          onChange={(event) => onProductChange(product.id, 'description', event.target.value)}
                          placeholder="Describe el producto o servicio"
                          className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                        />
                      </td>

                      {/* Input de cantidad — onBlur corrige valores menores a 1 */}
                      <td className="px-4 py-4">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={product.quantity}
                          onChange={(event) => onProductChange(product.id, 'quantity', event.target.value)}
                          onBlur={() => onProductBlur(product.id, 'quantity')}
                          className="w-24 rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                        />
                        {/* Mostramos error de cantidad si existe */}
                        {productErrors?.quantity && (
                          <p className="mt-2 text-xs text-red-400">{productErrors.quantity}</p>
                        )}
                      </td>

                      {/* Input de precio unitario */}
                      <td className="px-4 py-4">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={product.price}
                          onChange={(event) => onProductChange(product.id, 'price', event.target.value)}
                          className="w-32 rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                        />
                        {/* Mostramos error de precio si existe */}
                        {productErrors?.price && (
                          <p className="mt-2 text-xs text-red-400">{productErrors.price}</p>
                        )}
                      </td>

                      {/* Subtotal calculado automáticamente (cantidad × precio) */}
                      <td className="px-4 py-4">{currencyFormatter.format(calculateProductSubtotal(product))}</td>

                      {/* Botón para eliminar esta fila de la tabla */}
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => onRemoveProduct(product.id)}
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

      {/* Botón para agregar una nueva fila vacía a la tabla */}
      <button
        type="button"
        onClick={onAddProduct}
        className="mt-4 inline-flex items-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-400/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
      >
        Agregar Producto
      </button>
    </section>
  )
}

export default ProductsTable
