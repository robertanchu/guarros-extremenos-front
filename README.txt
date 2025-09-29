# Guarros Extremeños – Color brand (v14)

He extraído el **rojo de tus letras** del logo (color dominante) y lo he mapeado a la paleta de Tailwind:
- **Base (600): #C3342E**
- 700: #AC2E28, 800: #922722, 900: #6B1D19
- 500: #CC524D, 400: #D26762, 300: #DB8582, 200: #E4A4A1, 100: #F0CCCB, 50: #F9EBEA

## Qué incluye
- `tailwind.config.js` → sobreescribe la escala **red-50…900** con tu **rojo marca**.
- `src/components/Header.jsx` → badge del carrito usa `bg-red-600` (toma el rojo marca).
- `src/components/CartDrawer.jsx` → botón eliminar usa `bg-red-600 hover:bg-red-700`.

## Cómo usar
1. Haz copia de seguridad de tu `tailwind.config.js` (si ya lo tienes).
2. Extrae este ZIP en la raíz y acepta reemplazar estos archivos.
3. Instala y arranca:
   ```bash
   npm i
   npm run dev
   ```

> Si tu proyecto usa **CJS** para Tailwind, renombra `tailwind.config.js` a `tailwind.config.cjs` y cambia la exportación a `module.exports = { ... }`.

## Recomendación
- Revisa visualmente el contraste (AA/AAA). Si quieres, te hago un ajuste fino de contraste (p. ej. `700` más oscuro) en otro ZIP.
