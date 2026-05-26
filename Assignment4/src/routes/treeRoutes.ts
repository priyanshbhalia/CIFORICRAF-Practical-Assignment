import { Router } from 'express';
import { addTree, getTrees, updateTreeHealth, getStats } from '../controllers/treeController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createTreeSchema, updateTreeHealthSchema } from '../utils/validations';

const router = Router();

// Public routes
router.get('/', getTrees);
router.get('/stats', getStats);

// Protected routes (require JWT auth)
router.post('/', authenticate, validate(createTreeSchema), addTree);
router.put('/:id', authenticate, validate(updateTreeHealthSchema), updateTreeHealth);

export default router;
