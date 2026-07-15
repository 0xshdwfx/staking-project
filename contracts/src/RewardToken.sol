// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {
    //////////////////
    /// Constants ////
    //////////////////

    uint256 private constant INITIAL_MINT_VALUE = 1e6 * 1e18; // 1 million tokens with 18 decimals

    constructor() ERC20("Reward Token", "RWT") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_MINT_VALUE);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
