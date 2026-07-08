import { useInvoiceForm } from '../hooks/useInvoiceForm'
import ClientFields from '../components/ClientFields'
import InvoiceSummary from '../components/InvoiceSummary'
import InvoiceView from '../components/InvoiceView'
import ProductsTable from '../components/ProductsTable'

function HomePage() {
  const {
    clientName,
    clientDoc,
    clientNcf,
    products,
    invoice,
    errors,
    subtotal,
    itbis,
    total,
    handleProductChange,
    handleProductBlur,
    handleAddProduct,
    handleRemoveProduct,
    handleClientNameChange,
    handleClientDocChange,
    handleClientNcfChange,
    handleNewInvoice,
    handleSubmit,
  } = useInvoiceForm()

  return (
    <section className="flex flex-1 justify-center py-6 sm:py-10">
      <div className="w-full max-w-6xl">
        {invoice ? (
          <InvoiceView invoice={invoice} onNewInvoice={handleNewInvoice} />
        ) : (
          <>
            <header className="mb-6 sm:mb-8">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Generador de Facturas</h1>
            </header>

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/40 backdrop-blur sm:p-8"
            >
              <ClientFields
                clientName={clientName}
                clientDoc={clientDoc}
                clientNcf={clientNcf}
                errors={errors}
                onClientNameChange={handleClientNameChange}
                onClientDocChange={handleClientDocChange}
                onClientNcfChange={handleClientNcfChange}
              />

              <ProductsTable
                products={products}
                errors={errors}
                onProductChange={handleProductChange}
                onProductBlur={handleProductBlur}
                onAddProduct={handleAddProduct}
                onRemoveProduct={handleRemoveProduct}
              />

              <section className="mt-8 flex justify-end">
                <div className="w-full max-w-xs rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
                  <h3 className="text-base font-medium text-white">Resumen</h3>
                  <div className="mt-4">
                    <InvoiceSummary subtotal={subtotal} itbis={itbis} total={total} />
                  </div>
                </div>
              </section>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                >
                  Enviar Factura
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  )
}

export default HomePage

