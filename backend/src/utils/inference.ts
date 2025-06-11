import { mockModels, mockNodes } from '../models/mockData';

interface InferenceResult {
  output: string;
  confidence: number;
}

/**
 * Simulates running inference on a model with the given input
 * In a real implementation, this would interact with the decentralized nodes
 */
export const simulateInference = async (
  modelId: string,
  nodeId: string,
  prompt: string
): Promise<InferenceResult> => {
  // Verify model and node exist
  const model = mockModels.find(m => m.id === modelId);
  const node = mockNodes.find(n => n.id === nodeId);
  
  if (!model) {
    throw new Error(`Model not found: ${modelId}`);
  }
  
  if (!node) {
    throw new Error(`Node not found: ${nodeId}`);
  }
  
  // Check if node supports this model
  if (!node.supportedModels.includes(modelId)) {
    throw new Error(`Node ${nodeId} does not support model ${modelId}`);
  }

  // Simulate network and processing delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));
  
  // Simulate model-specific inference
  let output = '';
  let confidence = 0;
  
  switch (modelId) {
    case 'sentiment-analysis':
      // Simple sentiment analysis logic
      const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'happy', 'positive', 'love', 'like', 'best'];
      const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'horrible', 'sad', 'negative', 'hate', 'dislike', 'worst'];
      
      const text = prompt.toLowerCase();
      let positiveCount = 0;
      let negativeCount = 0;
      
      positiveWords.forEach(word => {
        if (text.includes(word)) positiveCount++;
      });
      
      negativeWords.forEach(word => {
        if (text.includes(word)) negativeCount++;
      });
      
      if (positiveCount > negativeCount) {
        output = 'Positive';
        confidence = 0.5 + (positiveCount / (positiveCount + negativeCount)) * 0.5;
      } else if (negativeCount > positiveCount) {
        output = 'Negative';
        confidence = 0.5 + (negativeCount / (positiveCount + negativeCount)) * 0.5;
      } else {
        output = 'Neutral';
        confidence = 0.5;
      }
      
      output = `${output} (${confidence.toFixed(2)})`;
      break;
      
    case 'text-classification':
      // Simple text classification
      const categories = ['Technology', 'Health', 'Entertainment', 'Sports', 'Business', 'Politics'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      confidence = Math.random() * 0.3 + 0.7; // Random between 0.7 and 1.0
      output = `${randomCategory} (${confidence.toFixed(2)})`;
      break;
      
    case 'image-classification':
      // Mock image classification
      const objects = ['Dog', 'Cat', 'Car', 'Building', 'Person', 'Tree', 'Mountain', 'Beach'];
      const randomObject = objects[Math.floor(Math.random() * objects.length)];
      confidence = Math.random() * 0.2 + 0.8; // Random between 0.8 and 1.0
      output = `${randomObject} (${confidence.toFixed(2)})`;
      break;
      
    case 'language-translation':
      // Mock translation (just reverse the string for demonstration)
      output = `Translated text: "${prompt.split('').reverse().join('')}"`;
      confidence = 0.85;
      break;
      
    case 'summarization':
      // Mock summarization
      const words = prompt.split(' ');
      if (words.length > 10) {
        output = `Summary: ${words.slice(0, Math.min(10, Math.ceil(words.length / 3))).join(' ')}...`;
      } else {
        output = `Summary: ${prompt}`;
      }
      confidence = 0.8;
      break;
      
    case 'question-answering':
      // Mock Q&A
      const answers = [
        'Yes, that is correct.',
        'No, that is not accurate.',
        'The answer is 42.',
        'It depends on several factors.',
        'Based on available data, it is likely true.',
        'Current research suggests otherwise.'
      ];
      output = answers[Math.floor(Math.random() * answers.length)];
      confidence = Math.random() * 0.3 + 0.7;
      break;
      
    default:
      output = 'Unsupported model type';
      confidence = 0;
  }
  
  return { output, confidence };
}; 