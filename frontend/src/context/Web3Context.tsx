import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers, BrowserProvider, Eip1193Provider } from 'ethers';

// Define the shape of the window.ethereum object for TypeScript
// Based on MetaMask's provider API docs: https://docs.metamask.io/wallet/reference/provider-api/
interface Ethereum extends Eip1193Provider {
  isMetaMask?: boolean;
  request: (request: { method: string; params?: any[] | undefined; }) => Promise<any>;
  on(event: 'accountsChanged', listener: (accounts: string[]) => void): this;
  on(event: 'chainChanged', listener: (chainId: string) => void): this;
  removeListener(event: string, listener: (...args: any[]) => void): this;
  selectedAddress?: string;
}

// Add Ethereum to the Window type
declare global {
  interface Window {
    ethereum?: Ethereum;
  }
}

// Context type definition
interface Web3ContextType {
  provider: BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
  chainId: bigint | null;
  connectWallet: () => Promise<void>;
  isConnected: boolean;
}

// Create context with null default value
const Web3Context = createContext<Web3ContextType | null>(null);

// Custom hook for accessing the Web3 context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

/**
 * Web3Provider component
 * 
 * Manages Ethereum wallet connection state and provides
 * access to the connected wallet's provider, signer, 
 * account address, and chain ID.
 * 
 * TODO:
 * - Add disconnect functionality
 * - Add network switching support
 * - Add better error messages for users
 * - Update to support other wallets besides MetaMask
 */
export const Web3Provider = ({ children }: Web3ProviderProps) => {
  // State for connection details
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<bigint | null>(null);
  
  // Connect wallet function - called when user clicks "Connect Wallet"
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this application');
      return;
    }
    
    try {
      // Initialize provider
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      const accounts = await ethersProvider.send('eth_requestAccounts', []);
      
      // Get signer and network info
      const ethersSigner = await ethersProvider.getSigner();
      const network = await ethersProvider.getNetwork();

      // Update state with connection info
      setProvider(ethersProvider);
      setSigner(ethersSigner);
      
      if (accounts.length > 0) {
        console.log(`Connected to account: ${accounts[0]}`);
        setAccount(accounts[0]);
      }
      
      setChainId(network.chainId);
    } catch (error: any) {
      // Handle user rejected request error
      if (error.code === 4001) {
        console.log('User rejected the connection request');
      } else {
        console.error('Error connecting to wallet:', error);
      }
    }
  };

  // Initialize and set up event listeners
  useEffect(() => {
    // Event handlers
    const handleAccountsChanged = (accounts: string[]) => {
      console.log('Accounts changed:', accounts);
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        // User disconnected all accounts
        setAccount(null);
        setProvider(null);
        setSigner(null);
        setChainId(null);
      }
    };

    // Need to reload on chain change due to how ethers handles network changes
    // FIXME: Find a way to handle this without full page reload
    const handleChainChanged = () => {
      window.location.reload();
    };

    // Check if MetaMask is installed and set up listeners
    if (window.ethereum) {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethersProvider);

      // Check if already connected
      ethersProvider.send('eth_accounts', [])
        .then(async (accounts) => {
          if (accounts.length > 0) {
            console.log('Found connected account:', accounts[0]);
            setAccount(accounts[0]);
            
            try {
              const ethersSigner = await ethersProvider.getSigner();
              const network = await ethersProvider.getNetwork();
              setSigner(ethersSigner);
              setChainId(network.chainId);
            } catch (err) {
              console.warn('Error getting signer or network:', err);
            }
          }
        })
        .catch(err => {
          // Non-critical error, just log it
          console.error('Error checking for connected accounts:', err);
        });

      // Set up event listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    } else {
      console.log('MetaMask not installed');
    }

    // Clean up event listeners on unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Derived state
  const isConnected = !!account && !!provider;

  // Provide context to children
  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        account,
        chainId,
        connectWallet,
        isConnected,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};