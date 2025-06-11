// Type definitions
export interface Node {
  id: string;
  address: string;
  name: string;
  location: string;
  stake: number;
  reputation: number;
  latency: string;
  uptime: string;
  supportedModels: string[];
}

export interface Model {
  id: string;
  name: string;
  description: string;
  inputType: 'text' | 'image';
  tokenCost: number;
  avgLatency: string;
  accuracy: string;
  icon: string;
}

export interface InferenceRecord {
  id: string;
  modelId: string;
  modelName: string;
  prompt: string;
  result: string;
  nodeId: string;
  nodeAddress: string;
  timestamp: string;
  latency: string;
  transactionHash: string;
  cost: number;
}

// Mock Nodes Data
export const mockNodes: Node[] = [
  {
    id: 'node1',
    address: '0x3a7c8f45b12c478955b98d8f75782d6c9a7d4b7c',
    name: 'FastCompute-01',
    location: 'North America',
    stake: 5000,
    reputation: 4.8,
    latency: '120ms',
    uptime: '99.8%',
    supportedModels: ['sentiment-analysis', 'text-classification', 'language-translation'],
  },
  {
    id: 'node2',
    address: '0x7f9d2e8a1c4b5f6e7d8c9b0a1b2c3d4e5f6a7b8c',
    name: 'EuroNode-42',
    location: 'Europe',
    stake: 3500,
    reputation: 4.6,
    latency: '150ms',
    uptime: '99.5%',
    supportedModels: ['sentiment-analysis', 'image-classification', 'summarization'],
  },
  {
    id: 'node3',
    address: '0x5e4d3c2b1a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d',
    name: 'AsiaEdge-07',
    location: 'Asia',
    stake: 8000,
    reputation: 4.9,
    latency: '180ms',
    uptime: '99.9%',
    supportedModels: ['sentiment-analysis', 'text-classification', 'image-classification', 'question-answering'],
  },
  {
    id: 'node4',
    address: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    name: 'SouthNode-15',
    location: 'South America',
    stake: 2800,
    reputation: 4.3,
    latency: '210ms',
    uptime: '98.7%',
    supportedModels: ['sentiment-analysis', 'language-translation', 'summarization'],
  },
  {
    id: 'node5',
    address: '0x0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e',
    name: 'GlobalAI-23',
    location: 'Australia',
    stake: 4200,
    reputation: 4.5,
    latency: '230ms',
    uptime: '99.1%',
    supportedModels: ['sentiment-analysis', 'text-classification', 'image-classification', 'summarization', 'question-answering'],
  },
];

// Mock Models Data
export const mockModels: Model[] = [
  {
    id: 'sentiment-analysis',
    name: 'Sentiment Analysis',
    description: 'Analyze text to determine sentiment (positive, negative, neutral)',
    inputType: 'text',
    tokenCost: 0.05,
    avgLatency: '200ms',
    accuracy: '92%',
    icon: '😊',
  },
  {
    id: 'text-classification',
    name: 'Text Classification',
    description: 'Classify text into predefined categories',
    inputType: 'text',
    tokenCost: 0.08,
    avgLatency: '250ms',
    accuracy: '89%',
    icon: '📝',
  },
  {
    id: 'image-classification',
    name: 'Image Classification',
    description: 'Identify objects and scenes in images',
    inputType: 'image',
    tokenCost: 0.15,
    avgLatency: '450ms',
    accuracy: '94%',
    icon: '🖼️',
  },
  {
    id: 'language-translation',
    name: 'Language Translation',
    description: 'Translate text between languages',
    inputType: 'text',
    tokenCost: 0.10,
    avgLatency: '300ms',
    accuracy: '87%',
    icon: '🌐',
  },
  {
    id: 'summarization',
    name: 'Text Summarization',
    description: 'Generate concise summaries of longer texts',
    inputType: 'text',
    tokenCost: 0.12,
    avgLatency: '350ms',
    accuracy: '85%',
    icon: '📋',
  },
  {
    id: 'question-answering',
    name: 'Question Answering',
    description: 'Answer questions based on provided context',
    inputType: 'text',
    tokenCost: 0.10,
    avgLatency: '320ms',
    accuracy: '88%',
    icon: '❓',
  },
];

// Mock Inference History
export const mockInferenceHistory: InferenceRecord[] = [
  {
    id: '1',
    modelId: 'sentiment-analysis',
    modelName: 'Sentiment Analysis',
    prompt: 'This product is amazing and works perfectly!',
    result: 'Positive (0.92)',
    nodeId: 'node1',
    nodeAddress: '0x3a7c8f45b12c478955b98d8f75782d6c9a7d4b7c',
    timestamp: '2023-11-15T14:32:45Z',
    latency: '245ms',
    transactionHash: '0x8a7c5d3b2e1f0a9c8b7d6e5f4c3b2a1d0e9f8a7b',
    cost: 0.05,
  },
  {
    id: '2',
    modelId: 'text-classification',
    modelName: 'Text Classification',
    prompt: 'How to bake a chocolate cake with minimal ingredients',
    result: 'Cooking (0.87), Recipe (0.76)',
    nodeId: 'node3',
    nodeAddress: '0x5e4d3c2b1a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d',
    timestamp: '2023-11-15T13:18:22Z',
    latency: '312ms',
    transactionHash: '0x5e4d3c2b1a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d',
    cost: 0.08,
  },
  {
    id: '3',
    modelId: 'image-classification',
    modelName: 'Image Classification',
    prompt: '[Image data]',
    result: 'Dog (0.95), Golden Retriever (0.89)',
    nodeId: 'node2',
    nodeAddress: '0x7f9d2e8a1c4b5f6e7d8c9b0a1b2c3d4e5f6a7b8c',
    timestamp: '2023-11-14T19:45:10Z',
    latency: '528ms',
    transactionHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    cost: 0.15,
  },
]; 