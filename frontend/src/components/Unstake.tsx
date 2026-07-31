import { useEffect, useState } from 'react';
import { useUnstake } from '../hooks/useUnstake';
import { useStakedAmount } from '../hooks/useStakedAmount';
import { usePendingRewards } from '../hooks/usePendingRewards';
import { formatEther, parseEther } from 'viem';
import { useStakingTokenBalance } from '../hooks/useStakingTokenBalance';
import { useStakingTokenSymbol } from '../hooks/useStakingTokenSymbol';
import { useTransactionToast } from '../hooks/useTransactionToast';

export function Unstake() {
	const [amount, setAmount] = useState('');
	const {
		unstake,
		isPending: isUnstakePending,
		isConfirming: isUnstakeConfirming,
		error: unstakeError,
		isSuccess: isUnstakeSuccess,
	} = useUnstake();
	const { refetch: refetchBalance } = useStakingTokenBalance();
	const { refetch: refetchStaked } = useStakedAmount();
	const { refetch: refetchPending } = usePendingRewards();
	const { symbol: stakingTokenSymbol } = useStakingTokenSymbol();

	const { stakedAmount } = useStakedAmount();
	const formattedStakedAmount = formatEther(stakedAmount || 0n);

	const handleUnstake = () => {
		if (!amount) return;
		const amountInWei = parseEther(amount);
		unstake(amountInWei);
		setAmount('');
	};

	// Toast notifications
	useTransactionToast({
		isPending: isUnstakePending,
		isConfirming: isUnstakeConfirming,
		isSuccess: isUnstakeSuccess,
		error: unstakeError,
		pendingMessage: 'Transaction pending... confirm in Wallet',
		confirmingMessage: 'Waiting for blockchain confirmation...',
		successMessage: 'Unstake successful!',
	});

	// Refetch data after successful unstake
	useEffect(() => {
		if (isUnstakeSuccess) {
			refetchBalance();
			refetchStaked();
			refetchPending();
			setAmount('');
		}
	}, [isUnstakeSuccess, refetchBalance, refetchStaked, refetchPending]);

	return (
		<div>
			<h3 className='text-lg font-semibold text-white mb-4'>
				Unstake {stakingTokenSymbol}
			</h3>

			<p className='text-sm text-slate-400 mb-4'>
				Available:{' '}
				<span className='text-white font-semibold'>
					{parseFloat(formattedStakedAmount).toFixed(4)} {stakingTokenSymbol}
				</span>
			</p>

			<input
				type='number'
				placeholder='Amount to unstake'
				value={amount}
				onChange={(e) => setAmount(e.target.value)}
				disabled={isUnstakePending || isUnstakeConfirming}
				className='w-full mb-4 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
			/>

			<button
				onClick={handleUnstake}
				disabled={isUnstakePending || isUnstakeConfirming || !amount}
				className='w-full px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition'
			>
				{isUnstakePending ? 'Unstaking...' : 'Unstake'}
			</button>
		</div>
	);
}
