import * as prettierTailwindPlugin from 'prettier-plugin-tailwindcss'

const prettierConfig = {
  singleQuote: true, // Usa aspas simples em vez de duplas
  semi: false, // Remove os pontos e vírgulas
  trailingComma: 'all', // Mantém as vírgulas finais sempre que possível
  plugins: [prettierTailwindPlugin], // Organiza as classes do Tailwind CSS
}

export default prettierConfig
