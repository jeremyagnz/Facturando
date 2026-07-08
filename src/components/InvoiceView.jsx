import { calculateProductSubtotal } from '../utils/invoiceCalculations'
import { currencyFormatter, dateFormatter } from '../utils/formatters'
import InvoiceSummary from './InvoiceSummary'

function InvoiceView({ invoice, onNewInvoice }) {
  const { clientName, clientDoc, clientNcf, products, subtotal, itbis, total, date } = invoice

  return (
    <div className="w-full max-w-6xl">
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Factura Generada</h1>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center rounded-xl border border-slate-600/40 bg-slate-700/30 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-slate-400/50 print:hidden"
          >
            Imprimir
          </button>
          <button
            type="button"
            onClick={onNewInvoice}
            className="inline-flex items-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-400/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 print:hidden"
          >
            Nueva Factura
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/40 backdrop-blur sm:p-8 print:rounded-none print:border-none print:bg-white print:p-0 print:shadow-none">
        {/* Invoice header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-2xl font-bold tracking-tight text-white print:text-slate-900">FACTURA</p>
            <p className="mt-1 text-sm text-slate-400 print:text-slate-500">
              NCF: <span className="font-mono font-semibold text-slate-200 print:text-slate-800">{clientNcf}</span>
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-slate-400 print:text-slate-500">
              Fecha: <span className="font-medium text-slate-200 print:text-slate-800">{dateFormatter.format(date)}</span>
            </p>
          </div>
        </div>

        {/* Client data */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-4 print:rounded-none print:border-slate-200 print:bg-transparent">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 print:text-slate-400">
            Facturado a
          </p>
          <p className="mt-1 text-base font-semibold text-white print:text-slate-900">{clientName}</p>
          <p className="text-sm text-slate-400 print:text-slate-500">RNC/Cédula: {clientDoc}</p>
        </div>

        {/* Products table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 print:rounded-none print:border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800 text-left print:divide-slate-200">
              <thead className="bg-slate-950/60 print:bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-200 print:text-slate-700">Descripción</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-200 print:text-slate-700">
                    Cantidad
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-200 print:text-slate-700">
                    Precio
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-200 print:text-slate-700">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/40 text-sm text-slate-300 print:divide-slate-200 print:bg-white print:text-slate-700">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-3">{product.description || '—'}</td>
                    <td className="px-4 py-3 text-right">{product.quantity}</td>
                    <td className="px-4 py-3 text-right">{currencyFormatter.format(product.price)}</td>
                    <td className="px-4 py-3 text-right">{currencyFormatter.format(calculateProductSubtotal(product))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-xs rounded-2xl border border-slate-800 bg-slate-950/60 p-4 print:rounded-none print:border-slate-200 print:bg-transparent sm:p-5">
            <InvoiceSummary subtotal={subtotal} itbis={itbis} total={total} showItbisRate />
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceView

