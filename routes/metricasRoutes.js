import express from 'express';
import metricasController from '../controllers/metricasController.js';

const router = express.Router();

// Rotas sem autenticação

// Rota para obter métricas gerais para o dashboard
router.get('/dashboard', metricasController.getDashboardMetricas);
router.get('/', metricasController.getDashboardMetricas); // Rota adicional sem o /dashboard

// Rota para obter métricas detalhadas de um aluno específico
router.get('/alunos/:id/metricas', metricasController.getAlunoMetricas);

export default router;
