const http = require('http');
const { exec } = require('child_process');

console.log('Testando conexão com o backend e frontend...');

// Função para testar a conexão com uma URL
function testConnection(url, description) {
  return new Promise((resolve, reject) => {
    console.log(`\nTestando conexão com ${description}: ${url}`);
    
    // Extrair host e porta da URL
    const urlParts = url.replace('http://', '').split('/');
    const hostPort = urlParts[0].split(':');
    const host = hostPort[0];
    const port = hostPort[1] || 80;
    const path = '/' + urlParts.slice(1).join('/');
    
    const options = {
      hostname: host,
      port: port,
      path: path,
      method: 'GET',
      timeout: 5000
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✅ Conexão com ${description} estabelecida com sucesso!`);
          console.log(`   Status: ${res.statusCode}`);
          try {
            const jsonData = JSON.parse(data);
            console.log(`   Resposta: ${JSON.stringify(jsonData, null, 2).substring(0, 200)}${data.length > 200 ? '...' : ''}`);
          } catch (e) {
            console.log(`   Resposta: ${data.substring(0, 200)}${data.length > 200 ? '...' : ''}`);
          }
          resolve(true);
        } else {
          console.log(`❌ Erro ao conectar com ${description}`);
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Resposta: ${data}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (e) => {
      console.log(`❌ Erro ao conectar com ${description}: ${e.message}`);
      if (e.code === 'ECONNREFUSED') {
        console.log(`   O serviço ${description} parece não estar rodando na porta ${port}.`);
      }
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log(`❌ Timeout ao conectar com ${description}`);
      req.abort();
      resolve(false);
    });
    
    req.end();
  });
}

// Função para abrir uma URL no navegador padrão
function openInBrowser(url) {
  const command = process.platform === 'win32' 
    ? `start "" "${url}"` 
    : process.platform === 'darwin' 
      ? `open "${url}"` 
      : `xdg-open "${url}"`;
  
  exec(command, (error) => {
    if (error) {
      console.log(`❌ Erro ao abrir ${url} no navegador: ${error.message}`);
    } else {
      console.log(`✅ URL ${url} aberta no navegador`);
    }
  });
}

// Testar conexões
async function runTests() {
  console.log('\n=== TESTE DE CONEXÃO ===\n');
  
  // Testar backend
  const backendUrl = 'http://localhost:3000/api';
  const backendOk = await testConnection(backendUrl, 'Backend API');
  
  // Testar frontend (apenas verificar se a porta está aberta)
  const frontendUrl = 'http://localhost:5173';
  const frontendOk = await testConnection(frontendUrl, 'Frontend');
  
  console.log('\n=== RESULTADO DOS TESTES ===\n');
  console.log(`Backend API: ${backendOk ? '✅ CONECTADO' : '❌ FALHOU'}`);
  console.log(`Frontend: ${frontendOk ? '✅ CONECTADO' : '❌ FALHOU'}`);
  
  // Sugestões baseadas nos resultados
  console.log('\n=== SUGESTÕES ===\n');
  
  if (!backendOk) {
    console.log('- Para iniciar o backend, execute: npm run dev');
    console.log('- Verifique se o arquivo .env está configurado corretamente');
    console.log('- Verifique se a porta 3000 não está sendo usada por outro processo');
  }
  
  if (!frontendOk) {
    console.log('- Para iniciar o frontend, execute: npm run frontend');
    console.log('- Verifique se a porta 5173 não está sendo usada por outro processo');
  }
  
  if (backendOk && frontendOk) {
    console.log('✅ Todos os serviços estão funcionando corretamente!');
    console.log('\nDeseja abrir as URLs no navegador? (S/N)');
    
    process.stdin.once('data', (data) => {
      const input = data.toString().trim().toLowerCase();
      if (input === 's' || input === 'sim' || input === 'y' || input === 'yes') {
        openInBrowser(backendUrl);
        openInBrowser(frontendUrl);
      }
      process.exit(0);
    });
  } else {
    console.log('\nExecute o script start.bat para iniciar todos os serviços automaticamente.');
    process.exit(1);
  }
}

runTests();
