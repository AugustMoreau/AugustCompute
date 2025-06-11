const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AugustCompute System", function () {
  let augustToken;
  let augustCompute;
  let owner;
  let nodeOperator;
  let user;
  let addrs;

  // Constants for testing
  const minNodeStake = ethers.utils.parseEther("1000");
  const inferencePayment = ethers.utils.parseEther("10");
  
  beforeEach(async function () {
    // Get signers
    [owner, nodeOperator, user, ...addrs] = await ethers.getSigners();
    
    // Deploy AugustToken
    const AugustToken = await ethers.getContractFactory("AugustToken");
    augustToken = await AugustToken.deploy();
    await augustToken.deployed();
    
    // Deploy AugustCompute with token address
    const AugustCompute = await ethers.getContractFactory("AugustCompute");
    augustCompute = await AugustCompute.deploy(augustToken.address);
    await augustCompute.deployed();
    
    // Transfer tokens to node operator and user
    await augustToken.transfer(nodeOperator.address, ethers.utils.parseEther("10000"));
    await augustToken.transfer(user.address, ethers.utils.parseEther("1000"));
    
    // Approve augustCompute contract to spend tokens
    await augustToken.connect(nodeOperator).approve(augustCompute.address, ethers.utils.parseEther("10000"));
    await augustToken.connect(user).approve(augustCompute.address, ethers.utils.parseEther("1000"));
  });

  describe("Token Functionality", function () {
    it("Should have the correct name and symbol", async function () {
      expect(await augustToken.name()).to.equal("AugustCompute Token");
      expect(await augustToken.symbol()).to.equal("ACT");
    });

    it("Should transfer tokens correctly", async function () {
      const amount = ethers.utils.parseEther("100");
      await augustToken.transfer(addrs[0].address, amount);
      expect(await augustToken.balanceOf(addrs[0].address)).to.equal(amount);
    });
  });

  describe("Node Registration", function () {
    it("Should register a node with sufficient stake", async function () {
      const metadata = "https://metadata.example.com/node1";
      const supportedModels = ["sentiment-analysis", "text-classification"];
      
      await augustCompute.connect(nodeOperator).registerNode(
        metadata,
        supportedModels,
        minNodeStake
      );
      
      const nodeDetails = await augustCompute.getNodeDetails(nodeOperator.address);
      
      expect(nodeDetails.owner).to.equal(nodeOperator.address);
      expect(nodeDetails.metadata).to.equal(metadata);
      expect(nodeDetails.stake).to.equal(minNodeStake);
      expect(nodeDetails.active).to.be.true;
      expect(nodeDetails.supportedModels).to.deep.equal(supportedModels);
    });

    it("Should fail to register with insufficient stake", async function () {
      const metadata = "https://metadata.example.com/node1";
      const supportedModels = ["sentiment-analysis"];
      const lowStake = ethers.utils.parseEther("100"); // Less than minimum
      
      await expect(
        augustCompute.connect(nodeOperator).registerNode(
          metadata,
          supportedModels,
          lowStake
        )
      ).to.be.revertedWith("AugustCompute: Stake amount too low");
    });
  });

  describe("Inference Request", function () {
    beforeEach(async function () {
      // Register a node first
      const metadata = "https://metadata.example.com/node1";
      const supportedModels = ["sentiment-analysis", "text-classification"];
      
      await augustCompute.connect(nodeOperator).registerNode(
        metadata,
        supportedModels,
        minNodeStake
      );
    });

    it("Should create an inference request", async function () {
      const inferenceId = await augustCompute.connect(user).callStatic.requestInference(
        nodeOperator.address,
        "sentiment-analysis",
        inferencePayment
      );
      
      await augustCompute.connect(user).requestInference(
        nodeOperator.address,
        "sentiment-analysis",
        inferencePayment
      );
      
      const inferenceDetails = await augustCompute.getInferenceDetails(inferenceId);
      
      expect(inferenceDetails.requester).to.equal(user.address);
      expect(inferenceDetails.nodeAddress).to.equal(nodeOperator.address);
      expect(inferenceDetails.modelId).to.equal("sentiment-analysis");
      expect(inferenceDetails.fee).to.equal(inferencePayment);
      expect(inferenceDetails.completed).to.be.false;
    });

    it("Should fail for unsupported model", async function () {
      await expect(
        augustCompute.connect(user).requestInference(
          nodeOperator.address,
          "unsupported-model",
          inferencePayment
        )
      ).to.be.revertedWith("AugustCompute: Model not supported by node");
    });
  });

  describe("Inference Result Submission", function () {
    let inferenceId;
    
    beforeEach(async function () {
      // Register a node
      const metadata = "https://metadata.example.com/node1";
      const supportedModels = ["sentiment-analysis"];
      
      await augustCompute.connect(nodeOperator).registerNode(
        metadata,
        supportedModels,
        minNodeStake
      );
      
      // Create an inference request
      inferenceId = await augustCompute.connect(user).callStatic.requestInference(
        nodeOperator.address,
        "sentiment-analysis",
        inferencePayment
      );
      
      await augustCompute.connect(user).requestInference(
        nodeOperator.address,
        "sentiment-analysis",
        inferencePayment
      );
    });

    it("Should submit inference result and pay the node", async function () {
      const result = ethers.utils.toUtf8Bytes("Positive (0.92)");
      const initialBalance = await augustToken.balanceOf(nodeOperator.address);
      
      await augustCompute.connect(nodeOperator).submitInferenceResult(inferenceId, result);
      
      const inferenceDetails = await augustCompute.getInferenceDetails(inferenceId);
      expect(inferenceDetails.completed).to.be.true;
      expect(ethers.utils.toUtf8String(inferenceDetails.result)).to.equal("Positive (0.92)");
      
      // Check if node was paid (minus platform fee)
      const platformFeeRate = await augustCompute.platformFeeRate();
      const platformFee = inferencePayment.mul(platformFeeRate).div(10000);
      const expectedPayment = inferencePayment.sub(platformFee);
      
      const finalBalance = await augustToken.balanceOf(nodeOperator.address);
      expect(finalBalance.sub(initialBalance)).to.equal(expectedPayment);
    });

    it("Should fail if not the assigned node", async function () {
      const result = ethers.utils.toUtf8Bytes("Positive (0.92)");
      
      await expect(
        augustCompute.connect(user).submitInferenceResult(inferenceId, result)
      ).to.be.revertedWith("AugustCompute: Not assigned node");
    });
  });

  describe("Platform Management", function () {
    it("Should update minimum node stake", async function () {
      const newMinStake = ethers.utils.parseEther("2000");
      await augustCompute.setMinNodeStake(newMinStake);
      expect(await augustCompute.minNodeStake()).to.equal(newMinStake);
    });

    it("Should update platform fee rate", async function () {
      const newFeeRate = 1000; // 10%
      await augustCompute.setPlatformFeeRate(newFeeRate);
      expect(await augustCompute.platformFeeRate()).to.equal(newFeeRate);
    });

    it("Should fail if fee rate exceeds maximum", async function () {
      const excessiveFeeRate = 3500; // 35%
      await expect(
        augustCompute.setPlatformFeeRate(excessiveFeeRate)
      ).to.be.revertedWith("AugustCompute: Fee rate cannot exceed 30%");
    });
  });
}); 