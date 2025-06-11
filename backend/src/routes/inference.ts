import express from 'express';
import { runInference, getInferenceHistory } from '../controllers/inference';

const router = express.Router();

// POST /api/inference
router.post('/', runInference);

// GET /api/inference/history
router.get('/history', getInferenceHistory);

export { router as inferenceRoutes }; 