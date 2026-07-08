import { ITBIS_RATE } from '../utils/invoiceCalculations'
import { currencyFormatter } from '../utils/formatters'

function InvoiceSummary({ subtotal, itbis, total, showItbisRate = false }) {
  return (
    <dl className="space-y-3 text-sm">
      <div className="flex items-center justify-between text-slate-300 print:text-slate-600">
        <dt>Subtotal</dt>
        <dd>{currencyFormatter.format(subtotal)}</dd>
      </div>
      <div className="flex items-center justify-between text-slate-300 print:text-slate-600">
        <dt>ITBIS{showItbisRate ? ` (${(ITBIS_RATE * 100).toFixed(0)}%)` : ''}</dt>
        <dd>{currencyFormatter.format(itbis)}</dd>
      </div>
      <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-base font-semibold text-white print:border-slate-300 print:text-slate-900">
        <dt>Total</dt>
        <dd>{currencyFormatter.format(total)}</dd>
      </div>
    </dl>
  )
}

export default InvoiceSummary
