# Staking Platform

A professional, full-stack staking platform built with smart contracts and modern web technologies.

**Live Site:** []

---

## Overview

A secure and efficient ERC20 staking platform that allows users to stake STK tokens, earn RWT reward tokens, and manage their positions with complete transparency. The platform features emergency withdrawal capabilities and real-time reward tracking.

---

## Features

- **Stake & Unstake:** Deposit and withdraw STK tokens anytime
- **Earn Rewards:** Automatically accrue RWT rewards based on staked amount and time
- **Claim Rewards:** Withdraw earned rewards independent of staked principal
- **Emergency Withdrawal:** Immediate exit mechanism (forfeits pending rewards)
- **Real-time Tracking:** Live reward calculations and balance updates
- **Professional UI:** Responsive Tailwind CSS interface with transaction notifications
- **Contract Verification:** All smart contracts verified on Etherscan for transparency

---

## How to Use

### 1. Connect Your Wallet

- Click "Connect Wallet" in the top-right corner
- Approve the connection in MetaMask/your Web3 wallet

### 2. View Your Stats

- **Staked Amount:** See how much STK you have locked in staking
- **Pending Rewards:** View earned RWT tokens (updates in real-time)

### 3. Stake Tokens

- Enter the amount of STK to stake
- Click "Approve STK" (one-time, allows contract to spend your tokens)
- Click "Stake" to lock tokens and start earning rewards
- Confirm transaction in your wallet

### 4. Claim Rewards

- Check your "Pending Rewards" amount
- Click "Claim Reward" to withdraw earned RWT tokens
- Your staked STK remains locked and continues earning

### 5. Unstake Tokens

- Enter the amount of STK to withdraw
- Click "Unstake" to recover your principal
- Your pending rewards are preserved and can be claimed separately

### 6. Emergency Withdrawal

- Use only when you need immediate exit
- **⚠️ Warning:** Forfeits all pending rewards
- Transfers your staked STK immediately

---

## Smart Contracts

All contracts are deployed on **Sepolia Testnet** and verified on Etherscan.

| Contract               | Address                                      | Verified Source                                                                                   |
| ---------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Staking**            | `0xf468Ff6aadb4e5eBffA59176873977A510A0fcAA` | [View Code](https://sepolia.etherscan.io/address/0xf468Ff6aadb4e5eBffA59176873977A510A0fcAA#code) |
| **StakingToken (STK)** | `0x2bef52e3f90a10c24570835c105cb2e6e11ae8bc` | [View Code](https://sepolia.etherscan.io/address/0x2bef52e3f90a10c24570835c105cb2e6e11ae8bc#code) |
| **RewardToken (RWT)**  | `0x919325462035ef8f455f4271deb6a9786872f990` | [View Code](https://sepolia.etherscan.io/address/0x919325462035ef8f455f4271deb6a9786872f990#code) |

---

## Rewards Mechanism

### How Rewards Work

Rewards accumulate continuously based on:

- **Your staked amount** (STK)
- **Time staked** (seconds since last action)
- **Daily reward rate** (10% annual)

### Formula

Reward = (Staked Amount × Time Elapsed × Daily Rate) / (365 days)

### Example

Stake 1 STK for 1 day at 10% annual rate:

Reward = (1 × 86,400 seconds × 0.1) / (31,536,000 seconds) ≈ 0.000274 RWT

### Key Points

- Rewards are **calculated in real-time** but only "finalized" when you stake, unstake, or claim
- You can claim rewards **anytime** without unstaking
- Pending rewards are **preserved** when you unstake (only forfeited in emergency withdrawal)

---

## Risk Disclaimer

⚠️ **Before using this platform, please understand:**

- **Smart Contract Risk:** While all contracts are verified and thoroughly tested, smart contracts can contain bugs or vulnerabilities
- **Testnet Only:** This platform is currently on Sepolia testnet for testing purposes
- **No Guarantees:** Staking provides no guaranteed returns
- **Loss of Funds:** Improper use of emergency withdrawal may result in forfeited rewards
- **Technical Risk:** Network congestion, gas spikes, or wallet issues may affect transactions
- **Regulatory Risk:** Crypto regulations may change; always comply with local laws

**Use at your own risk. Only stake amounts you can afford to lose.**

---

## Technology Stack

### Smart Contracts

- **Solidity** 0.8.26
- **Foundry** (compilation & testing)
- **OpenZeppelin** contracts (ERC20, Ownable, Pausable, ReentrancyGuard)

### Frontend

- **Next.js** 16+ (React framework)
- **TypeScript** (type safety)
- **Tailwind CSS v4** (styling)
- **Wagmi v2** (Web3 hooks)
- **Viem** (Ethereum utilities)
- **RainbowKit** (wallet connection)
- **Sonner** (notifications)

---

## Development

### Prerequisites

- Node.js 18+
- Foundry
- Git

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Smart Contracts

```bash
cd contracts
forge build
forge test
```

## Portfolio

This project is part of my Web3 development portfolio showcasing:

- Full-stack dApp development
- Smart contract design & security
- Professional frontend UI/UX
- Production-grade code quality

[View Full Portfolio]

## Support

For issues:

1. Check the verified contract code on Etherscan
2. Review the transaction details in your wallet
3. Ensure you're on Sepolia testnet
