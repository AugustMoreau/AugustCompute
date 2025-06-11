import { Request, Response } from 'express';
import { ethers } from 'ethers';
import { mockInferenceHistory } from '../models/mockData';
import { simulateInference } from '../utils/inference';

/**
 * Run inference on selected model and node
 * @route POST /api/inference
 */
export const runInference = async (req: Request, res: Response) => {
  try {
    const { modelId, nodeId, prompt } = req.body;
    
    // Validation
    if (!modelId || !nodeId || !prompt) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: modelId, nodeId, and prompt are required'
      });
    }
    
    // In a real implementation, this would:
    // 1. Connect to the smart contract
    // 2. Verify user has enough tokens/stake
    // 3. Send the inference request to the specified node
    // 4. Wait for the result
    // 5. Process the payment via the smart contract
    // 6. Return the result
    
    // For this demo, we'll simulate the inference
    const startTime = Date.now();
    const result = await simulateInference(modelId, nodeId, prompt);
    const latency = Date.now() - startTime;
    
    // Log the inference to the blockchain (mocked)
    const txHash = '0x' + Math.random().toString(16).substr(2, 40);
    
    res.json({
      success: true,
      data: {
        result: result.output,
        modelId,
        nodeId,
        latency: `${latency}ms`,
        timestamp: new Date().toISOString(),
        transactionHash: txHash
      }
    });
  } catch (error) {
    console.error('Error running inference:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to run inference'
    });
  }
};

/**
 * Get inference history for the user
 * @route GET /api/inference/history
 */
export const getInferenceHistory = (req: Request, res: Response) => {
  try {
    // In a real implementation, this would:
    // 1. Get the user's address from authentication
    // 2. Query the blockchain for their inference history
    // 3. Return the formatted results
    
    // For this demo, we'll return mock data
    res.json({
      success: true,
      count: mockInferenceHistory.length,
      data: mockInferenceHistory
    });
  } catch (error) {
    console.error('Error fetching inference history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inference history'
    });
  }
}; 