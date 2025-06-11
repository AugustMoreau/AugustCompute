import { Request, Response } from 'express';
import { mockModels } from '../models/mockData';

/**
 * Get all available AI models
 * @route GET /api/models
 */
export const getModels = (req: Request, res: Response) => {
  try {
    // Optional filter parameters
    const { inputType, search } = req.query;
    
    let filteredModels = [...mockModels];
    
    // Filter by input type if provided
    if (inputType) {
      filteredModels = filteredModels.filter(model => 
        model.inputType === inputType
      );
    }
    
    // Filter by search term if provided
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredModels = filteredModels.filter(model => 
        model.name.toLowerCase().includes(searchTerm) ||
        model.description.toLowerCase().includes(searchTerm)
      );
    }
    
    res.json({
      success: true,
      count: filteredModels.length,
      data: filteredModels
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch models'
    });
  }
};

/**
 * Get a specific model by ID
 * @route GET /api/models/:id
 */
export const getModelById = (req: Request, res: Response) => {
  try {
    const modelId = req.params.id;
    const model = mockModels.find(m => m.id === modelId);
    
    if (!model) {
      return res.status(404).json({
        success: false,
        error: 'Model not found'
      });
    }
    
    res.json({
      success: true,
      data: model
    });
  } catch (error) {
    console.error('Error fetching model:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch model'
    });
  }
}; 