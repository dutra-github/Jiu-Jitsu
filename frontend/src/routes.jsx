import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './components/Dashboard';
import Alunos from './pages/Alunos';
import NovoAluno from './pages/NovoAluno';
import EditarAluno from './pages/EditarAluno';
import DetalhesAluno from './pages/DetalhesAluno';
import Graduacoes from './pages/Graduacoes';
import Financeiro from './pages/Financeiro';
import GradeAulas from './pages/GradeAulas';
import Agenda from './pages/Agenda';
import Exames from './pages/Exames';
import Mensalidades from './pages/Mensalidades';
import Indicadores from './pages/Indicadores';
import Professores from './pages/Professores';
import NovoProfessor from './pages/NovoProfessor';
import TiposAulas from './pages/TiposAulas';
import ArtesMarciais from './pages/ArtesMarciais';
import GestaoUsuarios from './pages/GestaoUsuarios';
import NiveisAcesso from './pages/NiveisAcesso';
import Login from './pages/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rota raiz redireciona para dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Rotas protegidas - requerem autenticação */}
        <Route element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alunos/lista" element={<Alunos />} />
          <Route path="/alunos/novo" element={<NovoAluno />} />
          <Route path="/alunos/editar/:id" element={<EditarAluno />} />
          <Route path="/alunos/:id" element={<DetalhesAluno />} />
          <Route path="/alunos/graduacoes" element={<Graduacoes />} />
          <Route path="/alunos" element={<Navigate to="/alunos/lista" replace />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/grade-aulas" element={<GradeAulas />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/exames" element={<Exames />} />
          <Route path="/mensalidades" element={<Mensalidades />} />
          <Route path="/indicadores" element={<Indicadores />} />
          <Route path="/professores/lista" element={<Professores />} />
          <Route path="/professores/novo" element={<NovoProfessor />} />
          <Route path="/professores" element={<Navigate to="/professores/lista" replace />} />
          <Route path="/configuracoes/tipos-aulas" element={<TiposAulas />} />
          <Route path="/configuracoes/artes-marciais" element={<ArtesMarciais />} />
          <Route path="/configuracoes/usuarios" element={<GestaoUsuarios />} />
          <Route path="/configuracoes/niveis-acesso" element={<NiveisAcesso />} />
          <Route path="/configuracoes" element={<Navigate to="/configuracoes/tipos-aulas" replace />} />
        </Route>

        {/* Rota 404 - Redireciona para o dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
