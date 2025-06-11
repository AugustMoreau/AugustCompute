import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';

// TODO: Replace these mocks with real API calls
// JIRA: AUGUST-142 - Implement dashboard API integration
// Example API endpoint: /api/user/{address}/inferences

// Mock data for inference history
const MOCK_HISTORY = [
  {
    id: '1',
    model: 'Sentiment Analysis',
    prompt: 'This product is amazing and works perfectly!',
    result: 'Positive (0.92)',
    node: '0x3a...b12c',
    timestamp: '2023-11-15T14:32:45',
    latency: '245ms',
  },
  {
    id: '2',
    model: 'Text Classification',
    prompt: 'How to bake a chocolate cake with minimal ingredients',
    result: 'Cooking (0.87), Recipe (0.76)',
    node: '0x7f...d42a',
    timestamp: '2023-11-15T13:18:22',
    latency: '312ms',
  },
  {
    id: '3',
    model: 'Image Classification',
    prompt: '[Image data]',
    result: 'Dog (0.95), Golden Retriever (0.89)',
    node: '0x5e...c78b',
    timestamp: '2023-11-14T19:45:10',
    latency: '528ms',
  },
];

// Mock wallet data - will be replaced with blockchain queries
const MOCK_WALLET = {
  balance: '125.45',
  tokensUsed: '24.55',
  activeStake: '100.00',
};

/**
 * Dashboard page component
 * 
 * Displays user wallet info, recent inferences, and quick actions
 * for the AugustCompute platform.
 * 
 * @returns Dashboard component
 */
const Dashboard = () => {
  const { account, isConnected, connectWallet } = useWeb3();
  const [userInferences, setUserInferences] = useState(MOCK_HISTORY);
  const [userWallet, setUserWallet] = useState(MOCK_WALLET);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Simulating data fetch - will be replaced with actual API calls
  useEffect(() => {
    // Only fetch if connected
    if (!isConnected) {
      setIsLoading(false);
      return;
    }
    
    // Simulate API request
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setErrorMsg('');
      
      try {
        // Simulating network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In a real app, we'd make API calls here
        // const response = await fetch(`/api/user/${account}/dashboard`);
        // const data = await response.json();
        
        // For now, just use our mock data
        setUserInferences(MOCK_HISTORY);
        setUserWallet(MOCK_WALLET);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setErrorMsg('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Refresh data every 30 seconds - remove for production or make configurable
    // const refreshInterval = setInterval(fetchDashboardData, 30000);
    // return () => clearInterval(refreshInterval);
  }, [isConnected, account]);

  // Show wallet connection prompt if not connected
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-600 mb-8">Please connect your wallet to access the dashboard.</p>
        <button 
          onClick={connectWallet} 
          className="btn btn-primary"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Manage your compute tasks and wallet</p>
      </header>

      {/* Error message - only shown if there's an error */}
      {errorMsg && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {errorMsg}
          <button 
            className="absolute top-0 right-0 p-2" 
            onClick={() => setErrorMsg('')}
          >
            &times;
          </button>
        </div>
      )}

      {/* Wallet Summary Cards */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Wallet Balance</h3>
          <p className="text-3xl font-bold text-primary-600">{userWallet.balance} ACT</p>
          <p className="text-sm text-gray-500 mt-1">Available tokens</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Tokens Used</h3>
          <p className="text-3xl font-bold text-secondary-600">{userWallet.tokensUsed} ACT</p>
          <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Stake</h3>
          <p className="text-3xl font-bold text-green-600">{userWallet.activeStake} ACT</p>
          <p className="text-sm text-gray-500 mt-1">Earning 5% APY</p>
        </div>
      </section>

      {/* Quick Action Buttons */}
      <section className="flex flex-wrap gap-4">
        <Link to="/models" className="btn btn-primary">
          New Inference
        </Link>
        <Link to="/nodes" className="btn bg-gray-200 hover:bg-gray-300 text-gray-800">
          Browse Nodes
        </Link>
        {/* FIXME: Staking functionality coming in v0.2 */}
        <button 
          className="btn bg-gray-200 hover:bg-gray-300 text-gray-800 opacity-70"
          title="Coming soon"
          disabled
        >
          Stake Tokens
        </button>
      </section>

      {/* Recent Activity Table */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Inference Activity</h2>
          <button className="text-primary-600 hover:text-primary-800">View All</button>
        </div>
        
        {userInferences.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No inference history found. Start by running your first model!</p>
            <Link to="/models" className="mt-4 inline-block btn btn-primary">
              Run a Model
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Model</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Prompt</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Result</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Node</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Time</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {userInferences.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{item.model}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="max-w-xs truncate">{item.prompt}</div>
                    </td>
                    <td className="py-3 px-4 text-sm">{item.result}</td>
                    <td className="py-3 px-4 text-sm font-mono text-xs">{item.node}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm">{item.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard; 