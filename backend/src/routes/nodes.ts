import express from 'express';
import { getNodes, getNodeById } from '../controllers/nodes';

const router = express.Router();

// GET /api/nodes
router.get('/', getNodes);

// GET /api/nodes/:id
router.get('/:id', getNodeById);

export { router as nodesRoutes }; 