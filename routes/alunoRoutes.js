import express from 'express';
import AlunoController from '../controllers/alunoController.js';

const router = express.Router();

// Rotas sem autenticação

// CRUD Alunos
router.post('/', AlunoController.criarAluno);
router.get('/', AlunoController.listarAlunos);
router.get('/:id', AlunoController.obterAluno);
router.put('/:id', AlunoController.atualizarAluno);
router.delete('/:id', AlunoController.removerAluno);

// Rotas específicas para graduação
router.post('/:id/aula', AlunoController.registrarAula);
router.put('/:id/graduacao', AlunoController.atualizarGraduacao);
router.get('/:id/historico', AlunoController.obterHistorico);

export default router;
