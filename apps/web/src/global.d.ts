// Ambient declaration for plain (non-module) CSS side-effect imports.
// Next.js only declares `*.module.css` in its types; with TypeScript 6.0+
// `noUncheckedSideEffectImports` is enforced by default, so we need this
// for `import "./globals.css"` to type-check.
declare module "*.css";
