// Importamos StrictMode para detectar posibles problemas en desarrollo
import { StrictMode } from 'react'
// createRoot es la forma moderna de montar la app en el DOM
import { createRoot } from 'react-dom/client'
// Componente principal de la aplicación
import App from './App.jsx'
// Estilos globales (Tailwind y reset CSS)
import './styles/globals.css'

// Buscamos el div con id="root" en el index.html y montamos la app ahí
createRoot(document.getElementById('root')).render(
  // StrictMode nos avisa si usamos cosas que ya no se deben usar en React
  <StrictMode>
    <App />
  </StrictMode>,
)
