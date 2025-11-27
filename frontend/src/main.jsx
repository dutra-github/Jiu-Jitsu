import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import './styles/fix-usuario.css' // DESABILITADO TEMPORARIAMENTE
import App from './App'
import TestComponent from './TestComponent'

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

// Teste: renderizar componente simples primeiro
const USE_TEST = false; // Desativado - React funciona!

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);
console.log('Root element exists:', !!rootElement);

if (!rootElement) {
  console.error('ERRO: Elemento #root não encontrado!');
} else {
  console.log('Criando root e renderizando...');
  createRoot(rootElement).render(
    <StrictMode>
      {USE_TEST ? <TestComponent /> : <App />}
    </StrictMode>
  );
  console.log('Render chamado com sucesso!');
}
