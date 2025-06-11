// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title AugustCompute
 * @dev Main contract for the AugustCompute platform to manage decentralized AI inference
 */
contract AugustCompute is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    // Token used for payment and staking
    IERC20 public token;
    
    // Counter for unique inference IDs
    Counters.Counter private _inferenceIdCounter;
    
    // Minimum stake required to register as a compute node
    uint256 public minNodeStake = 1000 * 10**18; // 1000 tokens
    
    // Fee percentage charged by the platform (in basis points, 1% = 100)
    uint16 public platformFeeRate = 500; // 5% 
    
    // Compute node structure
    struct ComputeNode {
        address owner;
        string metadata;
        uint256 stake;
        uint256 reputation;
        bool active;
        string[] supportedModels;
    }
    
    // Inference request structure
    struct InferenceRequest {
        address requester;
        address nodeAddress;
        string modelId;
        uint256 timestamp;
        uint256 fee;
        bool completed;
        bytes result;
    }
    
    // Mapping of node address to node data
    mapping(address => ComputeNode) public nodes;
    
    // Mapping of inference ID to inference request data
    mapping(uint256 => InferenceRequest) public inferences;
    
    // List of all active node addresses
    address[] public activeNodes;
    
    // Events
    event NodeRegistered(address indexed nodeAddress, address indexed owner, uint256 stake);
    event NodeUpdated(address indexed nodeAddress, string metadata, string[] supportedModels);
    event NodeStakeIncreased(address indexed nodeAddress, uint256 amount);
    event NodeStakeDecreased(address indexed nodeAddress, uint256 amount);
    event NodeDeactivated(address indexed nodeAddress);
    
    event InferenceRequested(uint256 indexed inferenceId, address indexed requester, address indexed nodeAddress, string modelId, uint256 fee);
    event InferenceCompleted(uint256 indexed inferenceId, address indexed nodeAddress, bytes result);
    
    event MinNodeStakeUpdated(uint256 newMinStake);
    event PlatformFeeRateUpdated(uint16 newFeeRate);
    
    /**
     * @dev Constructor sets the token address
     * @param _token Address of the ERC20 token used for payments and staking
     */
    constructor(address _token) {
        require(_token != address(0), "AugustCompute: Token address cannot be zero");
        token = IERC20(_token);
    }
    
    /**
     * @dev Registers a new compute node
     * @param metadata IPFS hash or URL pointing to node metadata
     * @param supportedModels Array of supported model IDs
     * @param stakeAmount Amount of tokens to stake
     */
    function registerNode(string memory metadata, string[] memory supportedModels, uint256 stakeAmount) external nonReentrant {
        require(nodes[msg.sender].owner == address(0), "AugustCompute: Node already registered");
        require(stakeAmount >= minNodeStake, "AugustCompute: Stake amount too low");
        require(supportedModels.length > 0, "AugustCompute: Must support at least one model");
        require(bytes(metadata).length > 0, "AugustCompute: Metadata cannot be empty");
        
        // Transfer tokens from sender to contract
        require(token.transferFrom(msg.sender, address(this), stakeAmount), "AugustCompute: Token transfer failed");
        
        // Create node
        nodes[msg.sender] = ComputeNode({
            owner: msg.sender,
            metadata: metadata,
            stake: stakeAmount,
            reputation: 0,
            active: true,
            supportedModels: supportedModels
        });
        
        // Add to active nodes
        activeNodes.push(msg.sender);
        
        emit NodeRegistered(msg.sender, msg.sender, stakeAmount);
    }
    
    /**
     * @dev Updates an existing compute node's metadata and supported models
     * @param metadata New IPFS hash or URL pointing to node metadata
     * @param supportedModels New array of supported model IDs
     */
    function updateNode(string memory metadata, string[] memory supportedModels) external {
        require(nodes[msg.sender].owner == msg.sender, "AugustCompute: Not node owner");
        require(nodes[msg.sender].active, "AugustCompute: Node not active");
        require(supportedModels.length > 0, "AugustCompute: Must support at least one model");
        require(bytes(metadata).length > 0, "AugustCompute: Metadata cannot be empty");
        
        nodes[msg.sender].metadata = metadata;
        nodes[msg.sender].supportedModels = supportedModels;
        
        emit NodeUpdated(msg.sender, metadata, supportedModels);
    }
    
    /**
     * @dev Increases the stake for a compute node
     * @param amount Amount of tokens to add to stake
     */
    function increaseStake(uint256 amount) external nonReentrant {
        require(nodes[msg.sender].owner == msg.sender, "AugustCompute: Not node owner");
        require(nodes[msg.sender].active, "AugustCompute: Node not active");
        require(amount > 0, "AugustCompute: Amount must be greater than zero");
        
        // Transfer tokens from sender to contract
        require(token.transferFrom(msg.sender, address(this), amount), "AugustCompute: Token transfer failed");
        
        // Update stake
        nodes[msg.sender].stake += amount;
        
        emit NodeStakeIncreased(msg.sender, amount);
    }
    
    /**
     * @dev Decreases the stake for a compute node
     * @param amount Amount of tokens to remove from stake
     */
    function decreaseStake(uint256 amount) external nonReentrant {
        require(nodes[msg.sender].owner == msg.sender, "AugustCompute: Not node owner");
        require(nodes[msg.sender].active, "AugustCompute: Node not active");
        require(amount > 0, "AugustCompute: Amount must be greater than zero");
        
        uint256 newStake = nodes[msg.sender].stake - amount;
        require(newStake >= minNodeStake, "AugustCompute: Remaining stake too low");
        
        // Update stake
        nodes[msg.sender].stake = newStake;
        
        // Transfer tokens from contract to sender
        require(token.transfer(msg.sender, amount), "AugustCompute: Token transfer failed");
        
        emit NodeStakeDecreased(msg.sender, amount);
    }
    
    /**
     * @dev Deactivates a compute node and returns stake
     */
    function deactivateNode() external nonReentrant {
        require(nodes[msg.sender].owner == msg.sender, "AugustCompute: Not node owner");
        require(nodes[msg.sender].active, "AugustCompute: Node already deactivated");
        
        // Deactivate node
        nodes[msg.sender].active = false;
        
        // Return stake
        uint256 stake = nodes[msg.sender].stake;
        nodes[msg.sender].stake = 0;
        require(token.transfer(msg.sender, stake), "AugustCompute: Token transfer failed");
        
        // Remove from active nodes array
        for (uint256 i = 0; i < activeNodes.length; i++) {
            if (activeNodes[i] == msg.sender) {
                activeNodes[i] = activeNodes[activeNodes.length - 1];
                activeNodes.pop();
                break;
            }
        }
        
        emit NodeDeactivated(msg.sender);
    }
    
    /**
     * @dev Request inference from a specific node
     * @param nodeAddress Address of the compute node
     * @param modelId ID of the model to use
     * @param fee Amount of tokens to pay for inference
     * @return inferenceId Unique ID for the inference request
     */
    function requestInference(address nodeAddress, string memory modelId, uint256 fee) external nonReentrant returns (uint256) {
        require(nodes[nodeAddress].active, "AugustCompute: Node not active");
        require(fee > 0, "AugustCompute: Fee must be greater than zero");
        
        // Check if node supports the model
        bool modelSupported = false;
        for (uint256 i = 0; i < nodes[nodeAddress].supportedModels.length; i++) {
            if (keccak256(bytes(nodes[nodeAddress].supportedModels[i])) == keccak256(bytes(modelId))) {
                modelSupported = true;
                break;
            }
        }
        require(modelSupported, "AugustCompute: Model not supported by node");
        
        // Transfer tokens from sender to contract
        require(token.transferFrom(msg.sender, address(this), fee), "AugustCompute: Token transfer failed");
        
        // Generate inference ID
        _inferenceIdCounter.increment();
        uint256 inferenceId = _inferenceIdCounter.current();
        
        // Create inference request
        inferences[inferenceId] = InferenceRequest({
            requester: msg.sender,
            nodeAddress: nodeAddress,
            modelId: modelId,
            timestamp: block.timestamp,
            fee: fee,
            completed: false,
            result: new bytes(0)
        });
        
        emit InferenceRequested(inferenceId, msg.sender, nodeAddress, modelId, fee);
        
        return inferenceId;
    }
    
    /**
     * @dev Submit inference result and claim payment
     * @param inferenceId ID of the inference request
     * @param result Result data from the inference
     */
    function submitInferenceResult(uint256 inferenceId, bytes memory result) external nonReentrant {
        InferenceRequest storage inference = inferences[inferenceId];
        
        require(inference.requester != address(0), "AugustCompute: Inference does not exist");
        require(inference.nodeAddress == msg.sender, "AugustCompute: Not assigned node");
        require(!inference.completed, "AugustCompute: Inference already completed");
        require(result.length > 0, "AugustCompute: Result cannot be empty");
        
        // Mark inference as completed
        inference.completed = true;
        inference.result = result;
        
        // Calculate platform fee
        uint256 platformFee = (inference.fee * platformFeeRate) / 10000;
        uint256 nodePayment = inference.fee - platformFee;
        
        // Transfer payment to node
        require(token.transfer(msg.sender, nodePayment), "AugustCompute: Token transfer failed");
        
        // Update node reputation (simple increment for now)
        nodes[msg.sender].reputation += 1;
        
        emit InferenceCompleted(inferenceId, msg.sender, result);
    }
    
    /**
     * @dev Get details about a compute node
     * @param nodeAddress Address of the compute node
     * @return owner Owner address of the node
     * @return metadata Metadata URL or IPFS hash
     * @return stake Amount of tokens staked
     * @return reputation Reputation score
     * @return active Whether the node is active
     * @return supportedModels Array of supported model IDs
     */
    function getNodeDetails(address nodeAddress) external view returns (
        address owner,
        string memory metadata,
        uint256 stake,
        uint256 reputation,
        bool active,
        string[] memory supportedModels
    ) {
        ComputeNode storage node = nodes[nodeAddress];
        return (
            node.owner,
            node.metadata,
            node.stake,
            node.reputation,
            node.active,
            node.supportedModels
        );
    }
    
    /**
     * @dev Get details about an inference request
     * @param inferenceId ID of the inference request
     * @return requester Address that requested the inference
     * @return nodeAddress Address of the compute node
     * @return modelId ID of the model used
     * @return timestamp Time when the inference was requested
     * @return fee Amount paid for the inference
     * @return completed Whether the inference is completed
     * @return result Result data (if completed)
     */
    function getInferenceDetails(uint256 inferenceId) external view returns (
        address requester,
        address nodeAddress,
        string memory modelId,
        uint256 timestamp,
        uint256 fee,
        bool completed,
        bytes memory result
    ) {
        InferenceRequest storage inference = inferences[inferenceId];
        return (
            inference.requester,
            inference.nodeAddress,
            inference.modelId,
            inference.timestamp,
            inference.fee,
            inference.completed,
            inference.result
        );
    }
    
    /**
     * @dev Get the number of active nodes
     * @return Number of active nodes
     */
    function getActiveNodeCount() external view returns (uint256) {
        return activeNodes.length;
    }
    
    /**
     * @dev Get active nodes with pagination
     * @param offset Starting index
     * @param limit Maximum number of nodes to return
     * @return Array of node addresses
     */
    function getActiveNodes(uint256 offset, uint256 limit) external view returns (address[] memory) {
        if (offset >= activeNodes.length) {
            return new address[](0);
        }
        
        uint256 end = offset + limit;
        if (end > activeNodes.length) {
            end = activeNodes.length;
        }
        
        uint256 resultLength = end - offset;
        address[] memory result = new address[](resultLength);
        
        for (uint256 i = 0; i < resultLength; i++) {
            result[i] = activeNodes[offset + i];
        }
        
        return result;
    }
    
    /**
     * @dev Update minimum node stake requirement
     * @param newMinStake New minimum stake amount
     */
    function setMinNodeStake(uint256 newMinStake) external onlyOwner {
        minNodeStake = newMinStake;
        emit MinNodeStakeUpdated(newMinStake);
    }
    
    /**
     * @dev Update platform fee rate
     * @param newFeeRate New fee rate in basis points (1% = 100)
     */
    function setPlatformFeeRate(uint16 newFeeRate) external onlyOwner {
        require(newFeeRate <= 3000, "AugustCompute: Fee rate cannot exceed 30%");
        platformFeeRate = newFeeRate;
        emit PlatformFeeRateUpdated(newFeeRate);
    }
    
    /**
     * @dev Withdraw accumulated platform fees
     * @param amount Amount to withdraw
     * @param recipient Address to receive the tokens
     */
    function withdrawPlatformFees(uint256 amount, address recipient) external onlyOwner {
        require(recipient != address(0), "AugustCompute: Recipient cannot be zero address");
        require(token.transfer(recipient, amount), "AugustCompute: Token transfer failed");
    }
} 