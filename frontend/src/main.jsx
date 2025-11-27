import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/fix-usuario.css' // Importação do arquivo de correção
import App from './App'

// Log global para testes
console.log('==================== APLICAÇÃO INICIADA ====================');
console.log('Tempo de inicialização:', new Date().toISOString());
console.log('==========================================================');

// Log de inicialização completa
setTimeout(() => {
  console.log('Aplicação completamente inicializada');
}, 2000);

// Registra o service worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(registration => {
        console.log('Service Worker registrado com sucesso:', registration.scope)
      })
      .catch(error => {
        console.log('Falha ao registrar o Service Worker:', error)
      })
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
