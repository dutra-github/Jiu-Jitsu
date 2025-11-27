import { Router } from 'express';
import TipoAulaController from '../controllers/tipoAulaController.js';

const router = Router();
router.post('/', TipoAulaController.criar);
router.get('/', TipoAulaController.listar);
router.put('/:id', TipoAulaController.atualizar);
router.delete('/:id', TipoAulaController.deletar);

export default router;
