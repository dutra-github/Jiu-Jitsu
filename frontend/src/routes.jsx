import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './components/Dashboard';
import Financeiro from './pages/Financeiro';
import GradeAulas from './pages/GradeAulas';
import Agenda from './pages/Agenda';
import Exames from './pages/Exames';
import Mensalidades from './pages/Mensalidades';
import Indicadores from './pages/Indicadores';
// Removidas importações de componentes relacionados a usuários

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota raiz que redireciona diretamente para o dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Todas as rotas são públicas e envolvidas pelo DashboardLayout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/grade-aulas" element={<GradeAulas />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/exames" element={<Exames />} />
          <Route path="/mensalidades" element={<Mensalidades />} />
          <Route path="/indicadores" element={<Indicadores />} />
          {/* Rotas de usuário removidas */}
        </Route>

        {/* Rota 404 - Redireciona para o dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
