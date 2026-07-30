import { useEffect, useState } from 'react';
import { useUnstake } from '../hooks/useUnstake';
import { useStakedAmount } from '../hooks/useStakedAmount';
import { usePendingRewards } from '../hooks/usePendingRewards';
import { formatEther, parseEther } from 'viem';
import { useStakingTokenBalance } from '../hooks/useStakingTokenBalance';
import { useStakingTokenSymbol } from '../hooks/useStakingTokenSymbol';
import { toast } from 'sonner';

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

	// Unstake toasts
	useEffect(() => {
		if (isUnstakePending) {
			toast.loading('Transaction pending... confirm in MetaMask');
		}
	}, [isUnstakePending]);

	useEffect(() => {
		if (isUnstakeConfirming) {
			toast.dismiss();
			toast.loading('Waiting for blockchain confirmation...');
		}
	}, [isUnstakeConfirming]);

	useEffect(() => {
		if (isUnstakeSuccess) {
			toast.dismiss();
			toast.success('Unstake successful!');
			refetchBalance();
			refetchStaked();
			refetchPending();
			setAmount('');
		}
	}, [isUnstakeSuccess, refetchBalance, refetchStaked, refetchPending]);

	useEffect(() => {
		if (unstakeError) {
			toast.dismiss();
			toast.error(`Unstake failed: ${unstakeError.message}`, {
				duration: 10000,
			});
		}
	}, [unstakeError]);

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
