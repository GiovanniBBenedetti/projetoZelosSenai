import express from 'express';
const router = express.Router();

import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import { dashboard } from '../controllers/adminController.js';

router.get('/dashboard', authMiddleware, adminMiddleware, dashboard);

export default router;