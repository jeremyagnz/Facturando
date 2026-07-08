# Facturando

Generador de facturas dominicanas como Single Page Application (SPA) construida con React, Vite y Tailwind CSS. Permite registrar datos del cliente, agregar productos/servicios, calcular totales con ITBIS y generar una factura lista para imprimir.

## Demo

Desplegado en Netlify. Cada push a `main` actualiza la aplicación automáticamente gracias a la configuración en `netlify.toml`.

---

## Stack

| Tecnología | Versión | Rol |
|---|---|---|
| React | 19 | UI declarativa con hooks |
| Vite | 8 | Bundler y servidor de desarrollo |
| Tailwind CSS | 4 | Estilos utilitarios (plugin oficial de Vite) |
| ESLint | 10 | Linting con configuración flat |

---

## Instalación y uso

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo
npm run dev

# 3. Abrir http://localhost:5173
```

Otros scripts disponibles:

| Comando | Descripción |
|---|---|
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Previsualiza el build localmente |
| `npm run lint` | Ejecuta ESLint (0 warnings permitidos) |

---

## Estructura del proyecto

```text
Facturando/
├── index.html                        # Punto de entrada HTML
├── vite.config.js                    # Configuración de Vite + Tailwind
├── eslint.config.js                  # Configuración flat de ESLint
├── netlify.toml                      # Configuración de despliegue
├── package.json
└── src/
    ├── main.jsx                      # Bootstrap de React
    ├── App.jsx                       # Raíz de la app (AppShell + HomePage)
    ├── components/
    │   ├── layout/
    │   │   └── AppShell.jsx          # Contenedor visual de la página
    │   └── InvoiceView.jsx           # Vista de factura generada (con print)
    ├── pages/
    │   └── HomePage.jsx              # Formulario y lógica principal
    ├── hooks/                        # (reservado para hooks personalizados)
    ├── utils/
    │   └── invoiceCalculations.js    # Funciones puras de cálculo (ITBIS, totales)
    └── styles/
        └── globals.css               # Estilos globales y directivas de Tailwind
```

---

## Funcionalidades

- **Datos del cliente**: nombre, RNC (9 dígitos) o cédula dominicana (11 dígitos con dígito verificador) y NCF (formato B01/B02, 11 caracteres alfanuméricos).
- **Tabla de productos**: agregar, editar y eliminar filas con descripción, cantidad y precio.
- **Cálculo automático en tiempo real**: subtotal por producto, subtotal global, ITBIS (18 %) y total.
- **Validaciones de formulario**: todos los campos se validan antes de generar la factura; los errores se muestran inline.
- **Vista de factura**: pantalla de resumen con formato profesional, botón de impresión y opción de nueva factura.

---

## Historia del proyecto — procesos y commits

El proyecto se desarrolló de forma iterativa en cinco pull requests, cada uno correspondiente a un proceso bien delimitado.

---

### Commit inicial — `a5f58b1`

```
Initial commit
```

Jeremy crea el repositorio en GitHub. Se añade únicamente un `README.md` con el nombre del proyecto. Es el punto de partida vacío.

---

### PR #1 — Inicialización del proyecto (`b7d24ee`)

**Objetivo:** pasar de un repositorio vacío a una SPA funcional lista para desarrollar.

| Commit | Descripción |
|---|---|
| `1e7b773` | `Initial plan` — se define el plan de trabajo en el agente |
| `db86020` | `Inicializa main: expande README y agrega .gitignore` — se documenta el stack y se ignoran `node_modules`, `dist`, etc. |
| `bc28d7d` | `Scaffold SPA base with Vite` — se genera toda la estructura: `index.html`, `vite.config.js`, `eslint.config.js`, `package.json`, `src/App.jsx`, `src/main.jsx`, `src/pages/HomePage.jsx`, `src/components/layout/AppShell.jsx`, `src/styles/globals.css`, `public/favicon.svg` y `public/icons.svg` |
| `7f3faf7` | `Add npm lockfile for SPA setup` — se agrega `package-lock.json` para reproducibilidad |

Al mergear este PR la app ya arrancaba con `npm run dev` mostrando una página en blanco estructurada.

---

### PR #2 — UI estática de la factura (`df30d66`)

**Objetivo:** construir el layout visual del formulario de factura y preparar el despliegue en Netlify.

| Commit | Descripción |
|---|---|
| `5737709` | `create invoice UI layout` — tabla de productos, sección de datos del cliente y resumen de totales con Tailwind |
| `e8cfcec` | `fix accessibility for invoice UI layout` — atributos `aria` y `label` correctos |
| `9e622c3` | `refactor static invoice sample values` — los datos de ejemplo se extraen a constantes |
| `31ea899` | `polish invoice table accessibility and keys` — prop `key` en filas y mejoras de accesibilidad |
| `a42ae7a` | `use numeric sample values for invoice UI` — los precios de muestra pasan a ser números reales |
| `dc37259` | `fix netlify publish configuration` — se corrige `netlify.toml` para publicar la carpeta `dist/` |

Al terminar este PR la app mostraba una interfaz completa con datos estáticos de ejemplo.

---

### PR #3 — Estado del formulario de factura (`81165d4`)

**Objetivo:** conectar la UI a estado React para que los campos sean editables y reactivos.

| Commit | Descripción |
|---|---|
| `9648cfa` | `implement invoice state management` — `useState` para cliente y productos; handlers de cambio |
| `5edf8e9` | `refine invoice state handling` — refinamiento de la lógica de actualización de productos |
| `2323a13` | `finalize invoice state updates` — cierre de casos borde en el manejo de estado |
| `7da75e5` | `polish invoice product state` — limpieza de código en la gestión del estado de productos |
| `e8ece55` | `align invoice summary labels` — etiquetas del resumen alineadas con el diseño |
| `c64073c` | `harden invoice product inputs` — entradas de productos más robustas ante valores vacíos |

Al terminar este PR el formulario era completamente interactivo: se podían agregar/eliminar productos y los campos respondían a la escritura del usuario.

---

### PR #4 — Cálculos automáticos en tiempo real (`a48a5ba`)

**Objetivo:** que el resumen financiero se actualice automáticamente a medida que el usuario edita los productos.

| Commit | Descripción |
|---|---|
| `0997773`–`70e1281` | `add automatic invoice calculations` (×6 iteraciones) — se crea `src/utils/invoiceCalculations.js` con las funciones puras `calculateProductSubtotal`, `calculateSubtotal`, `calculateItbis`, `calculateTotal`, `roundToTwoDecimals` y `normalizeNonNegativeNumber`; se integran en `HomePage.jsx` con `useMemo` |

**Funciones clave en `invoiceCalculations.js`:**

```js
export const ITBIS_RATE = 0.18          // tasa ITBIS República Dominicana

calculateProductSubtotal(product)       // cantidad × precio
calculateSubtotal(products)             // suma de subtotales
calculateItbis(subtotal)                // subtotal × 0.18
calculateTotal(subtotal, itbis)         // subtotal + ITBIS
```

Al terminar este PR el subtotal, ITBIS y total se recalculaban en tiempo real sin necesidad de un botón adicional.

---

### PR #5 — Validaciones y generación de factura (`d00e601`)

**Objetivo:** validar todos los campos del formulario con reglas de negocio dominicanas y generar la vista final de la factura.

| Commit | Descripción |
|---|---|
| `d3c8840` | `feat: add NCF and form validations` — se implementan `validateNcf`, `validateDoc` y `validateForm`; errores inline en todos los campos |
| `c69413d` | `chore: align validation messages and constraints` — mensajes de error consistentes |
| `687afb2` | `fix: enforce integer quantity validation consistency` — la cantidad debe ser un entero positivo |
| `283b334` | `fix: harden numeric validation and cleanup handlers` — validación más robusta de números |
| `8d9681d` | `fix: unify field validation handling and success feedback` — un único handler `handleClientFieldChange` para todos los campos del cliente |
| `55f8c04` | `chore: clarify numeric validation messages` — mensajes descriptivos para precio y cantidad |
| `364ce24` | `feat: invoice generation, DR cedula validation, NCF input limit` — se crea `InvoiceView.jsx`; algoritmo de dígito verificador de cédula dominicana; `maxLength={11}` en el campo NCF; botón "Enviar Factura" genera la factura |
| `532c9aa` | `refactor: extract sanitizeNcfInput helper function` — la lógica de sanitización del NCF se extrae a `sanitizeNcfInput` |

**Reglas de validación implementadas:**

| Campo | Regla |
|---|---|
| Nombre | Obligatorio, no vacío |
| RNC | 9 dígitos exactos |
| Cédula | 11 dígitos con dígito verificador (algoritmo Luhn dominicano) |
| NCF | 11 caracteres alfanuméricos, debe comenzar con `B01` o `B02` |
| Cantidad | Entero positivo mayor que 0 |
| Precio | Número positivo mayor que 0 |

Al mergear este PR el proyecto quedó completo: validaciones, generación de factura con `InvoiceView`, y opción de imprimir o crear una nueva factura.

---

## Despliegue

El proyecto usa Netlify con configuración automática:

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"
```

Cada push a `main` dispara un nuevo build y despliegue.

---

## Convenciones de código

- Componentes en `PascalCase`, funciones utilitarias en `camelCase`.
- Funciones de cálculo puras y sin efectos secundarios en `src/utils/`.
- Validaciones como funciones independientes retornando `string` (vacío = válido).
- Tailwind CSS sin archivos de configuración externos (integrado via plugin de Vite).
- ESLint con `--max-warnings 0`: el CI falla ante cualquier advertencia.
