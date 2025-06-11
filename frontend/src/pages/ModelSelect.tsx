import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';

// Mock data for available models
const mockModels = [
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

const ModelSelect = () => {
  const { isConnected, connectWallet } = useWeb3();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const filteredModels = mockModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         model.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || model.inputType === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleModelSelect = (modelId: string) => {
    if (!isConnected) {
      alert('Please connect your wallet to use this model');
      return;
    }
    
    // In a real app, this would navigate to a model-specific page or setup
    navigate('/nodes', { state: { selectedModelId: modelId } });
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Select a Model</h1>
        <p className="text-gray-600">Choose an AI model for your inference task</p>
      </header>

      {!isConnected && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You are not connected to a wallet. Some features may be limited.
                <button onClick={connectWallet} className="ml-2 font-medium text-yellow-700 underline">
                  Connect Now
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search models..."
            className="input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-shrink-0">
          <select 
            className="input"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="text">Text Models</option>
            <option value="image">Image Models</option>
          </select>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <div key={model.id} className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleModelSelect(model.id)}>
            <div className="flex items-start">
              <div className="flex-shrink-0 text-4xl mr-4">{model.icon}</div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold">{model.name}</h3>
                <p className="text-gray-600 mt-1">{model.description}</p>
                
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Cost:</span> {model.tokenCost} ACT/call
                  </div>
                  <div>
                    <span className="text-gray-500">Latency:</span> {model.avgLatency}
                  </div>
                  <div>
                    <span className="text-gray-500">Accuracy:</span> {model.accuracy}
                  </div>
                  <div>
                    <span className="text-gray-500">Input:</span> {model.inputType === 'text' ? 'Text' : 'Image'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No models found matching your search criteria.</p>
          <button 
            className="mt-4 text-primary-600 hover:text-primary-800" 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ModelSelect; 