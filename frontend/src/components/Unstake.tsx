import { useEffect, useState } from 'react';
import { useUnstake } from '../hooks/useUnstake';
import { useStakedAmount } from '../hooks/useStakedAmount';
import { usePendingRewards } from '../hooks/usePendingRewards';
import { formatEther, parseEther } from 'viem';
import { toast } from 'sonner';
import { useStakingTokenBalance } from '../hooks/useStakingTokenBalance';

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
			<h3>Unstake STK</h3>
			<p>
				STK available to unstake: {parseFloat(formattedStakedAmount).toFixed(4)}{' '}
				STK
			</p>
			<input
				type='number'
				placeholder='Amount to unstake'
				value={amount}
				onChange={(e) => setAmount(e.target.value)}
				disabled={isUnstakePending}
			/>

			<button onClick={handleUnstake} disabled={isUnstakePending || !amount}>
				{isUnstakePending ? 'Unstaking...' : 'Unstake'}
			</button>
		</div>
	);
}
