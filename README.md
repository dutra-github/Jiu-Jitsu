# Sistema de Gerenciamento para Academias de Jiu-Jitsu

Sistema completo para academias e escolas de Jiu-Jitsu, com foco no controle de graduações (graus e faixas) baseado em frequência de aulas, além de funcionalidades administrativas e financeiras.

## Funcionalidades Principais

- Cadastro e gerenciamento de alunos
- Controle de graduações baseado em frequência
- Gestão financeira (mensalidades, planos)
- Dashboard com indicadores importantes
- Agente de IA para análise de métricas de alunos
- Versão PWA para acesso em dispositivos móveis

## Stack Tecnológica

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Banco de Dados**: SQLite
- **Autenticação**: JWT

## Requisitos

- Node.js (v14 ou superior)
- NPM (v6 ou superior)

## Instalação e Configuração

### 1. Local do Projeto

O projeto está configurado para ser executado no diretório:
```
D:\Projetos\Projeto V.1\
```

Se você estiver usando um diretório diferente, certifique-se de ajustar os caminhos nos arquivos de configuração.

### 2. Instalar dependências do backend

```bash
npm install
```

### 3. Instalar dependências do frontend

```bash
cd frontend
npm install
cd ..
```

### 4. Configurar o banco de dados

```bash
# Criar e aplicar as migrações do Prisma
npm run prisma:migrate

# Preencher o banco de dados com dados de exemplo
npm run prisma:seed
```

### 5. Iniciar a aplicação

```bash
# Iniciar apenas o backend
npm run dev

# Iniciar apenas o frontend
npm run frontend

# Iniciar backend e frontend simultaneamente
npm run dev:all
```

## Acessando a Aplicação

- **Backend API**: [http://localhost:3000/api](http://localhost:3000/api)
- **Frontend**: [http://localhost:5173](http://localhost:5173)

## Credenciais de Acesso (Ambiente de Desenvolvimento)

- **Email**: admin@jiujitsu.com
- **Senha**: senha123

## Funcionalidades do Agente de IA

O sistema inclui um agente de IA que analisa métricas dos alunos e fornece insights valiosos:

- Análise de frequência
- Progresso de graduação
- Métricas de desempenho
- Recomendações personalizadas

## Versão PWA

A aplicação pode ser instalada como um aplicativo em dispositivos móveis através da funcionalidade PWA:

1. Acesse a aplicação pelo navegador do dispositivo móvel
2. Toque em "Adicionar à tela inicial" ou "Instalar aplicativo"
3. O ícone da aplicação será adicionado à tela inicial do dispositivo

## Estrutura do Projeto

```
├── controllers/         # Controladores da API
├── frontend/           # Aplicação React
├── middlewares/        # Middlewares Express
├── models/             # Modelos de dados
├── prisma/             # Configuração e migrações do Prisma
├── routes/             # Rotas da API
├── utils/              # Utilitários
├── .env                # Variáveis de ambiente
├── package.json        # Dependências e scripts
└── server.js           # Ponto de entrada do backend
```

## Licença

Este projeto está licenciado sob a licença MIT.
