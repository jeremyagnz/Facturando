// AppShell es el contenedor general de la aplicación
// Envuelve todo con el fondo oscuro y centra el contenido en pantalla
import AppShell from './components/layout/AppShell.jsx'
// HomePage es la única página que tiene la app por ahora
import HomePage from './pages/HomePage.jsx'

// Componente raíz: solo pone el layout y adentro la página principal
function App() {
  return (
    <AppShell>
      <HomePage />
    </AppShell>
  )
}

export default App
