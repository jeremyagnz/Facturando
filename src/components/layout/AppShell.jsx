// AppShell es el layout base de toda la app
// Recibe "children" que es todo lo que se ponga adentro del componente
function AppShell({ children }) {
  return (
    // Fondo oscuro que ocupa toda la altura de la pantalla
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Contenedor principal: centra el contenido y le pone padding */}
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-10 lg:px-8">
        {/* Aquí se renderiza todo lo que venga dentro del componente */}
        {children}
      </main>
    </div>
  )
}

export default AppShell
