import { useEffect, useState } from 'react';
import { formatEther, parseEther } from 'viem';
import { useAccount } from 'wagmi';
import { useEmergencyWithdrawal } from '../hooks/useEmergencyWithdrawal';
import { useStakedAmount } from '../hooks/useStakedAmount';
import { useStakingTokenBalance } from '../hooks/useStakingTokenBalance';
import { useStakingTokenSymbol } from '../hooks/useStakingTokenSymbol';
import { useTransactionToast } from '../hooks/useTransactionToast';

export function EmergencyWithdrawal() {
	const { address } = useAccount();

	const [amount, setAmount] = useState('');
	const {
		emergencyWithdrawal,
		isPending: isWithdrawalPending,
		isConfirming: isWithdrawalConfirming,
		error: withdrawalError,
		isSuccess: isWithdrawalSuccess,
	} = useEmergencyWithdrawal();
	const { refetch: refetchBalance } = useStakingTokenBalance();
	const { refetch: refetchStaked } = useStakedAmount();
	const { symbol: stakingTokenSymbol } = useStakingTokenSymbol();

	const { stakedAmount } = useStakedAmount();
	const formattedStakedAmount = formatEther(stakedAmount || 0n);

	const handleEmergencyWithdrawal = () => {
		if (!amount) return;
		const amountInWei = parseEther(amount);
		emergencyWithdrawal(amountInWei);
		setAmount('');
	};

	// Toast notifications
	useTransactionToast({
		isPending: isWithdrawalPending,
		isConfirming: isWithdrawalConfirming,
		isSuccess: isWithdrawalSuccess,
		error: withdrawalError,
		pendingMessage: 'Transaction pending... confirm in Wallet',
		confirmingMessage: 'Waiting for blockchain confirmation...',
		successMessage:
			'Emergency withdrawal successful! All pending rewards forfeited.',
	});

	// Refetch data after successful withdrawal
	useEffect(() => {
		if (isWithdrawalSuccess) {
			refetchBalance();
			refetchStaked();
			setAmount('');
		}
	}, [isWithdrawalSuccess, refetchBalance, refetchStaked]);

	return (
		<div>
			<h3 className='text-lg font-semibold text-white mb-4'>
				Emergency Withdrawal
			</h3>

			<p className='text-sm text-slate-400 mb-2'>
				⚠️ <span className='text-red-400'>Warning:</span> Forfeits all pending
				rewards
			</p>

			<p className='text-sm text-slate-400 mb-4'>
				Available:{' '}
				<span className='text-white font-semibold'>
					{parseFloat(formattedStakedAmount).toFixed(4)} {stakingTokenSymbol}
				</span>
			</p>

			<input
				type='number'
				placeholder='Amount to withdraw'
				value={amount}
				onChange={(e) => setAmount(e.target.value)}
				disabled={isWithdrawalPending || isWithdrawalConfirming || !address}
				className='w-full mb-4 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
			/>

			<button
				onClick={handleEmergencyWithdrawal}
				disabled={isWithdrawalPending || isWithdrawalConfirming || !amount}
				className='w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition'
			>
				{isWithdrawalPending ? 'Withdrawing...' : 'Emergency Withdrawal'}
			</button>
		</div>
	);
}
