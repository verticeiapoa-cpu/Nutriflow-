import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// Agrupa dependências em chunks por peso/finalidade.
// Objetivo: reduzir o chunk principal de ~1.6MB para vários
// chunks carregados sob demanda.
function manualChunks(id) {
  if (!id.includes('node_modules')) return

  if (id.includes('react-dom') || id.includes('react-router') || /node_modules[\\/]react[\\/]/.test(id)) {
    return 'react-vendor'
  }
  if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('purify')) {
    return 'pdf-vendor'
  }
  if (id.includes('recharts') || id.includes('d3-')) {
    return 'charts-vendor'
  }
  if (id.includes('framer-motion') || id.includes('@hello-pangea/dnd')) {
    return 'motion-vendor'
  }
  if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
    return 'forms-vendor'
  }
  if (id.includes('@radix-ui')) {
    return 'radix-vendor'
  }
  if (id.includes('lucide-react') || id.includes('class-variance-authority') ||
      id.includes('clsx') || id.includes('tailwind-merge')) {
    return 'ui-vendor'
  }
  if (id.includes('date-fns') || id.includes('moment')) {
    return 'date-vendor'
  }
  if (id.includes('react-quill') || id.includes('quill')) {
    return 'editor-vendor'
  }
  if (id.includes('@supabase')) {
    return 'supabase-vendor'
  }
  if (id.includes('three')) {
    return 'three-vendor'
  }
  return 'vendor'
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: { manualChunks },
    },
  },
})
