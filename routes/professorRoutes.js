import { Router } from 'express';
import ProfessorController from '../controllers/professorController.js';

const router = Router();

router.post('/', ProfessorController.criar);
router.get('/', ProfessorController.listar);
router.get('/:id', ProfessorController.obter);
router.put('/:id', ProfessorController.atualizar);
router.delete('/:id', ProfessorController.deletar);

export default router;
