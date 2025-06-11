import express from 'express';
import { getModels, getModelById } from '../controllers/models';

const router = express.Router();

// GET /api/models
router.get('/', getModels);

// GET /api/models/:id
router.get('/:id', getModelById);

export { router as modelsRoutes }; 