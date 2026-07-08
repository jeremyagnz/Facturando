// Necesitamos la tasa del ITBIS para mostrarla opcionalmente en el label
import { ITBIS_RATE } from '../utils/invoiceCalculations'
// Formateador de moneda para mostrar los valores en DOP
import { currencyFormatter } from '../utils/formatters'

// InvoiceSummary muestra el resumen de totales: subtotal, ITBIS y total
// showItbisRate es opcional: si es true, muestra el porcentaje del ITBIS junto al label
function InvoiceSummary({ subtotal, itbis, total, showItbisRate = false }) {
  return (
    // dl = lista de definiciones, ideal para pares de etiqueta/valor
    <dl className="space-y-3 text-sm">

      {/* Fila de subtotal */}
      <div className="flex items-center justify-between text-slate-300 print:text-slate-600">
        <dt>Subtotal</dt>
        <dd>{currencyFormatter.format(subtotal)}</dd>
      </div>

      {/* Fila de ITBIS — si showItbisRate es true, muestra "ITBIS (18%)" */}
      <div className="flex items-center justify-between text-slate-300 print:text-slate-600">
        <dt>ITBIS{showItbisRate ? ` (${(ITBIS_RATE * 100).toFixed(0)}%)` : ''}</dt>
        <dd>{currencyFormatter.format(itbis)}</dd>
      </div>

      {/* Fila de total — tiene más peso visual para destacarlo */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-base font-semibold text-white print:border-slate-300 print:text-slate-900">
        <dt>Total</dt>
        <dd>{currencyFormatter.format(total)}</dd>
      </div>
    </dl>
  )
}

export default InvoiceSummary
