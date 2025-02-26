import * as prettierTailwindPlugin from 'prettier-plugin-tailwindcss';

const prettierConfig = {
  singleQuote: true, // Usa aspas simples em vez de duplas
  trailingComma: 'all',
  plugins: [prettierTailwindPlugin],
};

export default prettierConfig;
