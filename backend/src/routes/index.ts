import express from 'express';
import { nodesRoutes } from './nodes';
import { modelsRoutes } from './models';
import { inferenceRoutes } from './inference';

const router = express.Router();

// Base API route
router.get('/', (req, res) => {
  res.json({
    message: 'AugustCompute API',
    version: '1.0.0',
    endpoints: ['/nodes', '/models', '/inference']
  });
});

// Mount sub-routes
router.use('/nodes', nodesRoutes);
router.use('/models', modelsRoutes);
router.use('/inference', inferenceRoutes);

export { router as apiRoutes }; 