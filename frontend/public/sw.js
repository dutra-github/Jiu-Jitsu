// Nome do cache (alterado para forçar atualização)
const CACHE_NAME = 'jiu-jitsu-app-v2';

// Arquivos para cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pwa-192x192.png',
  '/masked-icon.svg',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css',
  '/src/App.css',
  '/src/components/AIAgent/AIAgent.jsx',
  '/src/components/AIAgent/AIAgent.css',
  '/src/pages/Indicadores.jsx'
];

// Instalação do service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
  // Não cachear requisições API
  if (event.request.url.includes('/api/')) {
    return fetch(event.request)
      .catch(() => new Response('Erro de conexão', { status: 503 }));
  }

  // Para outras requisições, usar cache
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retorna a resposta do cache
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then(response => {
            // Verifica se a resposta é válida e pode ser cacheada
            if(response && response.status === 200 && response.type === 'basic') {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseToCache));
            }
            return response;
          })
          .catch(() => {
            // Fallback para páginas quando offline
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            return new Response('Conteúdo indisponível offline', { status: 503 });
          });
      })
  );
});

// Ativação do service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
