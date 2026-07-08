function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-10 lg:px-8">
        {children}
      </main>
    </div>
  )
}

export default AppShell
