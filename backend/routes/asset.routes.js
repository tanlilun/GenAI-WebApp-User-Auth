import express from 'express';
import { AssetController } from '../controllers/asset.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', verifyToken, AssetController.list);
router.get('/:id', verifyToken, AssetController.getById);
router.post('/', verifyToken, AssetController.create);
router.put('/:id', verifyToken, AssetController.update);
router.delete('/:id', verifyToken, AssetController.delete);

export default router;
