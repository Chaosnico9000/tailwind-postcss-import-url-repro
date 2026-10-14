export default {
  plugins: {
    '@tailwindcss/postcss': process.env.TW_OPTIMIZE === 'false' ? { optimize: false } : {},
  },
}
