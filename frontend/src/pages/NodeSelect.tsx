import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';

// Mock data for available nodes
const mockNodes = [
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

// Mock function to simulate inference
const mockRunInference = (nodeId: string, modelId: string, prompt: string) => {
  return new Promise<{result: string, latency: string}>((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      let result = '';
      
      // Generate fake results based on the model type
      if (modelId === 'sentiment-analysis') {
        const sentiments = ['Positive (0.92)', 'Neutral (0.78)', 'Negative (0.85)'];
        result = sentiments[Math.floor(Math.random() * sentiments.length)];
      } else if (modelId === 'text-classification') {
        const categories = ['Technology (0.88)', 'Health (0.76)', 'Entertainment (0.91)', 'Sports (0.84)'];
        result = categories[Math.floor(Math.random() * categories.length)];
      } else if (modelId === 'image-classification') {
        const objects = ['Dog (0.95)', 'Cat (0.93)', 'Car (0.87)', 'Building (0.82)'];
        result = objects[Math.floor(Math.random() * objects.length)];
      } else if (modelId === 'language-translation') {
        result = 'Translated text: "' + prompt.split('').reverse().join('') + '"';
      } else if (modelId === 'summarization') {
        result = 'Summary: This is a summarized version of the input text.';
      } else if (modelId === 'question-answering') {
        const answers = ['Yes, that is correct.', 'The answer is 42.', 'It depends on several factors.'];
        result = answers[Math.floor(Math.random() * answers.length)];
      } else {
        result = 'Unknown model type';
      }
      
      // Random latency between 100-500ms
      const latency = Math.floor(Math.random() * 400 + 100) + 'ms';
      
      resolve({ result, latency });
    }, 1500); // Simulate 1.5s processing time
  });
};

const NodeSelect = () => {
  const { isConnected, connectWallet } = useWeb3();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inferenceResult, setInferenceResult] = useState<{result: string, latency: string} | null>(null);

  useEffect(() => {
    // Get selected model from location state if available
    if (location.state && location.state.selectedModelId) {
      setSelectedModelId(location.state.selectedModelId);
    }
  }, [location]);

  // Filter nodes based on selected model and location
  const filteredNodes = mockNodes.filter(node => {
    const supportsModel = !selectedModelId || node.supportedModels.includes(selectedModelId);
    const matchesLocation = filterLocation === 'all' || node.location.includes(filterLocation);
    return supportsModel && matchesLocation;
  });

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const handleRunInference = async () => {
    if (!isConnected) {
      alert('Please connect your wallet to run inference');
      return;
    }
    
    if (!selectedNodeId) {
      alert('Please select a node first');
      return;
    }
    
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }
    
    setIsLoading(true);
    setInferenceResult(null);
    
    try {
      // In a real app, this would call a smart contract function
      const result = await mockRunInference(selectedNodeId, selectedModelId, prompt);
      setInferenceResult(result);
    } catch (error) {
      console.error('Error running inference:', error);
      alert('Error running inference. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRandomNode = () => {
    if (filteredNodes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredNodes.length);
      setSelectedNodeId(filteredNodes[randomIndex].id);
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Select a Compute Node</h1>
        <p className="text-gray-600">
          Choose a node to run your inference task
          {selectedModelId && ` for ${mockNodes.find(node => node.supportedModels.includes(selectedModelId))?.supportedModels.find(model => model === selectedModelId)}`}
        </p>
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
                You are not connected to a wallet. Please connect to run inference.
                <button onClick={connectWallet} className="ml-2 font-medium text-yellow-700 underline">
                  Connect Now
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Inference Input</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
              Prompt / Input Data
            </label>
            <textarea
              id="prompt"
              className="input min-h-24"
              placeholder="Enter your prompt or input data here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Location
              </label>
              <select
                id="location-filter"
                className="input"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                <option value="all">All Locations</option>
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="South America">South America</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
            
            <div className="flex-shrink-0 self-end">
              <button 
                className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
                onClick={handleRandomNode}
              >
                Pick Random Node
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nodes Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Available Nodes</h2>
          <span className="text-sm text-gray-500">{filteredNodes.length} nodes available</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNodes.map((node) => (
            <div 
              key={node.id} 
              className={`card hover:shadow-md transition-shadow cursor-pointer ${selectedNodeId === node.id ? 'border-2 border-primary-500' : ''}`}
              onClick={() => handleNodeSelect(node.id)}
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{node.name}</h3>
                  <p className="text-sm font-mono text-gray-500 truncate">{node.address}</p>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {node.location}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Stake:</span> {node.stake} ACT
                </div>
                <div>
                  <span className="text-gray-500">Reputation:</span> ⭐ {node.reputation}
                </div>
                <div>
                  <span className="text-gray-500">Latency:</span> {node.latency}
                </div>
                <div>
                  <span className="text-gray-500">Uptime:</span> {node.uptime}
                </div>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-1">
                {node.supportedModels.map((modelId) => (
                  <span 
                    key={modelId} 
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${modelId === selectedModelId ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    {modelId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {filteredNodes.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No nodes available for the selected criteria.</p>
            <button 
              className="mt-4 text-primary-600 hover:text-primary-800" 
              onClick={() => {
                setFilterLocation('all');
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button 
          className="btn btn-primary text-lg px-8 py-3"
          disabled={isLoading || !selectedNodeId || !prompt.trim()}
          onClick={handleRunInference}
        >
          {isLoading ? 'Running Inference...' : 'Run Inference'}
        </button>
      </div>

      {/* Results Section */}
      {inferenceResult && (
        <div className="card bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Inference Results</h2>
          <div className="bg-white p-4 rounded border">
            <div className="mb-4">
              <h3 className="text-md font-medium text-gray-700">Result:</h3>
              <p className="mt-1 text-lg">{inferenceResult.result}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Latency:</span> {inferenceResult.latency}
              </div>
              <div>
                <span className="text-gray-500">Node:</span> {mockNodes.find(n => n.id === selectedNodeId)?.name}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeSelect; 