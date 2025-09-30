# Guarros Extremeños – Brandify (v16)
- Header usa `/logo/logo_horizontal2.png`.
- Tailwind añade paleta `brand` (50–900) y mantiene `red` igualada.
- Codemod convierte clases `*-red-*` a `*-brand-*` (respeta variantes y opacidad).

## Uso
1) Descomprime en la **raíz** del proyecto (reemplaza `tailwind.config.js` y `src/components/Header.jsx`).
2) Ejecuta:
   npm run brandify:check   # dry-run
   npm run brandify:apply   # aplica con backups .brand2.bak
3) `npm run dev` para probar.
