import { useEffect, useState } from 'react';
import { parseEther, formatEther } from 'viem';
import { useAccount } from 'wagmi';
import { useStake } from '../hooks/useStake';
import { useStakingTokenBalance } from '../hooks/useStakingTokenBalance';
import { useStakingTokenAllowance } from '../hooks/useStakingTokenAllowance';
import { useApproveStakingToken } from '../hooks/useApproveStakingToken';
import { useStakedAmount } from '../hooks/useStakedAmount';
import { usePendingRewards } from '../hooks/usePendingRewards';
import { useStakingTokenSymbol } from '../hooks/useStakingTokenSymbol';
import { useTransactionToast } from '../hooks/useTransactionToast';

export function Stake() {
	const { address } = useAccount();

	const [amount, setAmount] = useState('');
	const {
		stake,
		isPending: isStakePending,
		isConfirming: isStakeConfirming,
		error: stakeError,
		isSuccess: isStakeSuccess,
	} = useStake();
	const { stakingTokenBalance, refetch: refetchBalance } =
		useStakingTokenBalance();
	const { allowance } = useStakingTokenAllowance();
	const {
		approve,
		isPending: isApprovePending,
		isConfirming: isApproveConfirming,
		isSuccess: isApproveSuccess,
		error: approveError,
	} = useApproveStakingToken();
	const { refetch: refetchStaked } = useStakedAmount();
	const { refetch: refetchPending } = usePendingRewards();
	const { symbol: stakingTokenSymbol } = useStakingTokenSymbol();

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

	// Refetch data after successful stake
	useEffect(() => {
		if (isStakeSuccess) {
			refetchBalance();
			refetchStaked();
			refetchPending();
			setAmount('');
		}
	}, [isStakeSuccess, refetchBalance, refetchStaked, refetchPending]);

	// Approval toasts
	useTransactionToast({
		isPending: isApprovePending,
		isConfirming: isApproveConfirming,
		isSuccess: isApproveSuccess,
		error: approveError,
		pendingMessage: 'Confirm approval in Wallet...',
		confirmingMessage: 'Confirming approval on blockchain...',
		successMessage: 'Approval successful! Now you can stake.',
	});

	// Stake toasts
	useTransactionToast({
		isPending: isStakePending,
		isConfirming: isStakeConfirming,
		isSuccess: isStakeSuccess,
		error: stakeError,
		pendingMessage: 'Transaction pending... confirm in Wallet',
		confirmingMessage: 'Waiting for blockchain confirmation...',
		successMessage: 'Stake successful!',
	});

	return (
		<div>
			<h3 className='text-lg font-semibold text-white mb-4'>
				Stake {stakingTokenSymbol}
			</h3>

			<p className='text-sm text-slate-400 mb-4'>
				Balance:{' '}
				<span className='text-white font-semibold'>
					{formattedBalance} {stakingTokenSymbol}
				</span>
			</p>

			<input
				type='number'
				placeholder='Amount to stake'
				value={amount}
				onChange={(e) => setAmount(e.target.value)}
				disabled={isStakePending || isApprovePending || !isApproved}
				className='w-full mb-4 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
			/>

			{!isApproved ? (
				<button
					onClick={approve}
					disabled={isApprovePending || !address}
					className='w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition'
				>
					{isApprovePending ? 'Approving...' : `Approve ${stakingTokenSymbol}`}
				</button>
			) : (
				<button
					onClick={handleStake}
					disabled={isStakePending || !amount}
					className='w-full px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition'
				>
					{isStakePending ? 'Staking...' : 'Stake'}
				</button>
			)}
		</div>
	);
}
