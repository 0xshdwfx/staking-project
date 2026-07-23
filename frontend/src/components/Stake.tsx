import { useState, useEffect } from 'react';
import { parseEther, formatEther } from 'viem';
import { useStake } from '../hooks/useStake';
import { useStakingTokenBalance } from '../hooks/useStakingTokenBalance';
import { useStakingTokenAllowance } from '../hooks/useStakingTokenAllowance';
import { useApproveStakingToken } from '../hooks/useApproveStakingToken';
import { useStakedAmount } from '../hooks/useStakedAmount';
import { usePendingRewards } from '../hooks/usePendingRewards';

export function Stake() {
	const [amount, setAmount] = useState('');
	const {
		stake,
		isPending: isStakePending,
		error: stakeError,
		isSuccess: isStakeSuccess,
	} = useStake();
	const { stakingTokenBalance, refetch: refetchBalance } =
		useStakingTokenBalance();
	const { allowance } = useStakingTokenAllowance();
	const {
		approve,
		isPending: isApprovePending,
		error: approveError,
	} = useApproveStakingToken();
	const { stakedAmount, refetch: refetchStaked } = useStakedAmount();
	const { pendingRewards, refetch: refetchPending } = usePendingRewards();

	// Check if approved (allowance > 0)
	const isApproved = allowance && allowance > 0n;

	const handleStake = () => {
		if (!amount) return;
		const amountInWei = parseEther(amount);
		stake(amountInWei);
		setAmount('');
	};

	const formattedBalance = stakingTokenBalance
		? parseFloat(formatEther(stakingTokenBalance)).toFixed(4)
		: '0.00';

	useEffect(() => {
		if (isStakeSuccess) {
			refetchBalance();
			refetchStaked();
			refetchPending();
		}
	}, [isStakeSuccess, refetchBalance, refetchStaked, refetchPending]);

	return (
		<div>
			<h3>Stake STK</h3>

			<p>Balance: {formattedBalance} STK</p>

			<input
				type='number'
				placeholder='Amount to stake'
				value={amount}
				onChange={(e) => setAmount(e.target.value)}
				disabled={isStakePending || isApprovePending || !isApproved}
			/>

			{!isApproved ? (
				<button onClick={approve} disabled={isApprovePending}>
					{isApprovePending ? 'Approving...' : 'Approve STK'}
				</button>
			) : (
				<button onClick={handleStake} disabled={isStakePending || !amount}>
					{isStakePending ? 'Staking...' : 'Stake'}
				</button>
			)}

			{stakeError && (
				<p style={{ color: 'red' }}>Stake Error: {stakeError.message}</p>
			)}
			{approveError && (
				<p style={{ color: 'red' }}>Approval Error: {approveError.message}</p>
			)}
		</div>
	);
}

// import { useEffect, useMemo, useState } from 'react';
// import { parseEther, formatEther } from 'viem';
// import { useWaitForTransactionReceipt } from 'wagmi';

// import { useStake } from '../hooks/useStake';
// import { useStakingTokenBalance } from '../hooks/useStakingTokenBalance';
// import { useStakingTokenAllowance } from '../hooks/useStakingTokenAllowance';
// import { useApproveStakingToken } from '../hooks/useApproveStakingToken';

// export function Stake() {
// 	const [amount, setAmount] = useState('');

// 	const { stake, isPending: isStakePending, error: stakeError } = useStake();
// 	const { stakingTokenBalance } = useStakingTokenBalance();
// 	const { allowance, refetch: refetchAllowance } = useStakingTokenAllowance();
// 	const {
// 		approve,
// 		isPending: isApprovePending,
// 		error: approveError,
// 	} = useApproveStakingToken();

// 	const amountInWei = useMemo(() => {
// 		if (!amount) return 0n;
// 		try {
// 			return parseEther(amount);
// 		} catch {
// 			return 0n;
// 		}
// 	}, [amount]);

// 	const isApproved =
// 		allowance !== undefined && allowance >= amountInWei && amountInWei > 0n;

// 	const formattedBalance = stakingTokenBalance
// 		? parseFloat(formatEther(stakingTokenBalance)).toFixed(4)
// 		: '0.00';

// 	useEffect(() => {
// 		if (isApprovePending) return;
// 		void refetchAllowance();
// 	}, [isApprovePending, refetchAllowance]);

// 	const handleStake = async () => {
// 		if (!amount || amountInWei === 0n) return;
// 		stake(amountInWei);
// 		setAmount('');
// 	};

// 	return (
// 		<div>
// 			<h3>Stake STK</h3>

// 			<p>Balance: {formattedBalance} STK</p>

// 			<input
// 				type='number'
// 				placeholder='Amount to stake'
// 				value={amount}
// 				onChange={(e) => setAmount(e.target.value)}
// 				disabled={isStakePending || isApprovePending}
// 			/>

// 			{!isApproved ? (
// 				<button
// 					onClick={approve}
// 					disabled={isApprovePending || amountInWei === 0n}
// 				>
// 					{isApprovePending ? 'Approving...' : 'Approve STK'}
// 				</button>
// 			) : (
// 				<button
// 					onClick={handleStake}
// 					disabled={isStakePending || amountInWei === 0n}
// 				>
// 					{isStakePending ? 'Staking...' : 'Stake'}
// 				</button>
// 			)}

// 			{stakeError && (
// 				<p style={{ color: 'red' }}>Stake Error: {stakeError.message}</p>
// 			)}
// 			{approveError && (
// 				<p style={{ color: 'red' }}>Approval Error: {approveError.message}</p>
// 			)}
// 		</div>
// 	);
// }
