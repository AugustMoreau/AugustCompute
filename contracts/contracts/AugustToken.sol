// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AugustToken
 * @dev ERC20 Token for the AugustCompute platform
 */
contract AugustToken is ERC20, ERC20Burnable, Ownable {
    // Maximum token supply
    uint256 private constant _MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    
    // Constructor initializes the token with name and symbol
    constructor() ERC20("AugustCompute Token", "ACT") {
        // Mint initial supply to contract deployer
        _mint(msg.sender, 100_000_000 * 10**18); // 100 million tokens (10% of max supply)
    }
    
    /**
     * @dev Mints new tokens
     * @param to Address to receive the tokens
     * @param amount Amount of tokens to mint
     * Requirements:
     * - Only callable by owner
     * - Total supply after minting must not exceed maximum supply
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= _MAX_SUPPLY, "AugustToken: Max supply exceeded");
        _mint(to, amount);
    }
} 