import { Router } from 'express';
import ArteMarcialController from '../controllers/arteMarcialController.js';

const router = Router();
router.post('/', ArteMarcialController.criar);
router.get('/', ArteMarcialController.listar);
router.put('/:id', ArteMarcialController.atualizar);
router.delete('/:id', ArteMarcialController.deletar);

export default router;
