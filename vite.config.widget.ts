import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/widget/transaction-slider.ts',
      name: 'TerrySlider',
      formats: ['iife'],
      fileName: () => 'terry-slider.js',
    },
    outDir: 'dist-widget',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
})
