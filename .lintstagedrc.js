export default {
  '*.{js,ts,svelte,css,md,json}': [
    'prettier --plugin-search-dir . --write .',
    'prettier --check --plugin-search-dir=.'
  ]
  // '*.{js,ts,svelte}': 'eslint . --fix'
}
