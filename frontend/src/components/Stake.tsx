import { useState, useEffect } from 'react';
import { parseEther, formatEther } from 'viem';
import { useStake } from '../hooks/useStake';
import { useStakingTokenBalance } from '../hooks/useStakingTokenBalance';
import { useStakingTokenAllowance } from '../hooks/useStakingTokenAllowance';
import { useApproveStakingToken } from '../hooks/useApproveStakingToken';
import { useStakedAmount } from '../hooks/useStakedAmount';
import { usePendingRewards } from '../hooks/usePendingRewards';
import { toast } from 'sonner';

export function Stake() {
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
		error: approveError,
	} = useApproveStakingToken();
	const { refetch: refetchStaked } = useStakedAmount();
	const { refetch: refetchPending } = usePendingRewards();

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

	// Show loading toast when pending
	useEffect(() => {
		if (isStakePending) {
			toast.loading('Transaction pending... confirm in MetaMask');
		}
	}, [isStakePending]);

	useEffect(() => {
		if (isStakeConfirming) {
			toast.dismiss();
			toast.loading('Waiting for blockchain confirmation...');
		}
	}, [isStakeConfirming]);

	// Show success only AFTER data actually updates (transaction mined)
	useEffect(() => {
		if (isStakeSuccess) {
			toast.dismiss();
			toast.success('Stake successful!');
			refetchBalance();
			refetchStaked();
			refetchPending();
			setAmount('');
		}
	}, [isStakeSuccess, refetchBalance, refetchStaked, refetchPending]);

	// Error handling
	useEffect(() => {
		if (stakeError) {
			toast.dismiss(); // Dismiss the loading toast
			toast.error(`Stake failed: ${stakeError.message}`, {
				duration: 10000,
			});
		}
	}, [stakeError]);

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
		</div>
	);
}
