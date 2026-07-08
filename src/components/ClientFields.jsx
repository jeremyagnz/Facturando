// ClientFields muestra los tres campos del cliente: nombre, documento y NCF
// Recibe los valores actuales, los errores y las funciones para actualizarlos
function ClientFields({ clientName, clientDoc, clientNcf, errors, onClientNameChange, onClientDocChange, onClientNcfChange }) {
  return (
    <section>
      {/* Título de la sección */}
      <h2 className="text-lg font-medium text-white sm:text-xl">Datos del Cliente</h2>

      {/* Grid de tres columnas: una por cada campo del cliente */}
      <div className="mt-4 grid gap-4 md:grid-cols-3">

        {/* Campo: Nombre del Cliente */}
        <div>
          <label htmlFor="client-name" className="mb-2 block text-sm font-medium text-slate-200">
            Nombre del Cliente
          </label>
          <input
            id="client-name"
            type="text"
            value={clientName}
            // Cada vez que el usuario escribe, avisamos al padre con el nuevo valor
            onChange={(event) => onClientNameChange(event.target.value)}
            placeholder="Ej. Juan Pérez"
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
          />
          {/* Mostramos el error solo si existe */}
          {errors.clientName ? <p className="mt-2 text-xs text-red-400">{errors.clientName}</p> : null}
        </div>

        {/* Campo: RNC o Cédula */}
        <div>
          <label htmlFor="client-doc" className="mb-2 block text-sm font-medium text-slate-200">
            RNC/Cédula
          </label>
          <input
            id="client-doc"
            type="text"
            value={clientDoc}
            onChange={(event) => onClientDocChange(event.target.value)}
            placeholder="Ej. 001-1234567-8"
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
          />
          {errors.clientDoc ? <p className="mt-2 text-xs text-red-400">{errors.clientDoc}</p> : null}
        </div>

        {/* Campo: NCF (Número de Comprobante Fiscal) — máximo 11 caracteres */}
        <div>
          <label htmlFor="client-ncf" className="mb-2 block text-sm font-medium text-slate-200">
            NCF
          </label>
          <input
            id="client-ncf"
            type="text"
            value={clientNcf}
            maxLength={11}
            onChange={(event) => onClientNcfChange(event.target.value)}
            placeholder="Ej. B0100000001"
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
          />
          {errors.clientNcf ? <p className="mt-2 text-xs text-red-400">{errors.clientNcf}</p> : null}
        </div>
      </div>
    </section>
  )
}

export default ClientFields
