import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// Agrupa dependências em chunks por peso/finalidade.
// IMPORTANTE: libs que usam React.createContext (Radix, react-hook-form,
// react-quill, framer-motion, @hello-pangea/dnd, lucide-react, recharts)
// ficam juntas com o React no chunk "react-vendor" para evitar
// erros de ordem de carregamento ("Cannot read properties of undefined (reading 'createContext')").
function manualChunks(id) {
  if (!id.includes('node_modules')) return

  // ---------- React + tudo que usa React.createContext ----------
  if (
    /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler|prop-types)[\\/]/.test(id) ||
    id.includes('@radix-ui') ||
    id.includes('react-hook-form') ||
    id.includes('@hookform') ||
    id.includes('react-quill') ||
    id.includes('framer-motion') ||
    id.includes('@hello-pangea/dnd') ||
    id.includes('lucide-react') ||
    id.includes('recharts')
  ) {
    return 'react-vendor'
  }

  // ---------- Libs pesadas sem dependência de contexto React em runtime ----------
  if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('purify')) {
    return 'pdf-vendor'
  }
  if (id.includes('d3-')) {
    return 'charts-vendor'
  }
  if (id.includes('zod')) {
    return 'forms-vendor'
  }
  if (id.includes('class-variance-authority') ||
      id.includes('clsx') || id.includes('tailwind-merge')) {
    return 'ui-vendor'
  }
  if (id.includes('date-fns') || id.includes('moment')) {
    return 'date-vendor'
  }
  if (id.includes('quill') && !id.includes('react-quill')) {
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
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: { manualChunks },
    },
  },
})
