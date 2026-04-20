import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// Estrategia segura:
// Por padrao, TODO node_module vai pro chunk "react-vendor" junto com o React.
// So separamos libs pesadas que COMPROVADAMENTE nao dependem de React.createContext.
// Isso evita o erro "Cannot read properties of undefined (reading 'createContext')"
// quando algum pacote React-dependente cai num chunk carregado antes do React.
function manualChunks(id) {
  if (!id.includes('node_modules')) return

  if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('dompurify')) {
    return 'pdf-vendor'
  }
  if (id.includes('date-fns') || id.includes('moment')) {
    return 'date-vendor'
  }
  if (id.includes('@supabase')) {
    return 'supabase-vendor'
  }
  if (id.includes('node_modules/three/') || id.includes('node_modules\\three\\')) {
    return 'three-vendor'
  }
  if ((id.includes('node_modules/quill/') || id.includes('node_modules\\quill\\')) &&
      !id.includes('react-quill')) {
    return 'editor-vendor'
  }

  // TUDO MAIS (React + qualquer lib que possa usar React.createContext)
  // fica junto para garantir ordem de carregamento correta.
  return 'react-vendor'
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: { manualChunks },
    },
  },
})
