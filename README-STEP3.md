# Step 3 – Clean Titles (Brand Only)

This codemod removes anything in your codebase that overwrites the browser tab title,
so it always shows **"Guarros Extremeños"** and nothing else.

## What it does
- Removes `react-helmet` / `react-helmet-async` imports and `<Helmet>...</Helmet>` usage.
- Strips any `document.title = ...` lines.
- Ensures `index.html` has `<title>Guarros Extremeños</title>`.

## How to run (Windows PowerShell or macOS/Linux terminal)
```bash
# from your project root
node scripts/clean-titles.cjs
```

Then review changes:
```bash
git status
git diff
```

Optional cleanup:
```bash
npm remove react-helmet react-helmet-async
```

Finally, rebuild/deploy and verify the tab shows only **Guarros Extremeños**.
