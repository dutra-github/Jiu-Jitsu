import { Router } from 'express';
import AulaController from '../controllers/aulaController.js';

const router = Router();

router.post('/', AulaController.criar);
router.get('/', AulaController.listar);
router.get('/:id', AulaController.obter);
router.put('/:id', AulaController.atualizar);
router.delete('/:id', AulaController.deletar);
router.post('/:id/inscrever', AulaController.inscreverAluno);
router.post('/:id/desinscrever', AulaController.desinscreverAluno);

export default router;
