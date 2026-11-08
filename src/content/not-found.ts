// Fixed trilingual copy, same exception as src/content/language-chooser.ts:
// a 404 can be hit before the locale is known (unmatched path, no [locale]
// segment), so this can't come from messages/{pt,en,es}.json.
export const notFoundCopy = {
  heading: "404 — Página não encontrada · Page not found · Página no encontrada",
  body: "A página que você procura não existe. · The page you're looking for doesn't exist. · La página que buscas no existe.",
};
