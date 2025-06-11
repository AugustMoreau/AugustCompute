import { Request, Response } from 'express';
import { mockNodes } from '../models/mockData';

/**
 * Get all available nodes
 * @route GET /api/nodes
 */
export const getNodes = (req: Request, res: Response) => {
  try {
    // Optional filter parameters
    const { location, model } = req.query;
    
    let filteredNodes = [...mockNodes];
    
    // Filter by location if provided
    if (location) {
      filteredNodes = filteredNodes.filter(node => 
        node.location.toLowerCase().includes((location as string).toLowerCase())
      );
    }
    
    // Filter by supported model if provided
    if (model) {
      filteredNodes = filteredNodes.filter(node => 
        node.supportedModels.includes(model as string)
      );
    }
    
    res.json({
      success: true,
      count: filteredNodes.length,
      data: filteredNodes
    });
  } catch (error) {
    console.error('Error fetching nodes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch nodes'
    });
  }
};

/**
 * Get a specific node by ID
 * @route GET /api/nodes/:id
 */
export const getNodeById = (req: Request, res: Response) => {
  try {
    const nodeId = req.params.id;
    const node = mockNodes.find(n => n.id === nodeId);
    
    if (!node) {
      return res.status(404).json({
        success: false,
        error: 'Node not found'
      });
    }
    
    res.json({
      success: true,
      data: node
    });
  } catch (error) {
    console.error('Error fetching node:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch node'
    });
  }
}; 