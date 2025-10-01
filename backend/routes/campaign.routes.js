import express from 'express';
import { CampaignController } from '../controllers/campaign.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', verifyToken, CampaignController.list);
router.get('/:id', verifyToken, CampaignController.getById);
router.post('/', verifyToken, CampaignController.create);
router.put('/:id', verifyToken, CampaignController.update);
router.delete('/:id', verifyToken, CampaignController.delete);

export default router;
