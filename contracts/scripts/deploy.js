// Deploy script for AugustCompute contracts
const hre = require("hardhat");

async function main() {
  console.log("Deploying AugustCompute contracts...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Get the contract factories
  const AugustToken = await hre.ethers.getContractFactory("AugustToken");
  
  // Deploy the token contract
  console.log("Deploying AugustToken...");
  const token = await AugustToken.deploy();
  console.log("AugustToken deployed to:", token.address);

  // Deploy the main contract with the token address
  const AugustCompute = await hre.ethers.getContractFactory("AugustCompute");
  console.log("Deploying AugustCompute...");
  const compute = await AugustCompute.deploy(token.address);
  console.log("AugustCompute deployed to:", compute.address);

  // Output contract addresses for easy reference
  console.log("\nContract Addresses:");
  console.log("-------------------");
  console.log("AugustToken:", token.address);
  console.log("AugustCompute:", compute.address);
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 