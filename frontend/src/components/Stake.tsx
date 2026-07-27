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
		isConfirming: isApproveConfirming,
		isSuccess: isApproveSuccess,
		error: approveError,
	} = useApproveStakingToken();
	const { refetch: refetchStaked } = useStakedAmount();
	const { refetch: refetchPending } = usePendingRewards();

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

	// Approval toasts
	useEffect(() => {
		if (isApprovePending) {
			toast.loading('Confirm approval in MetaMask...');
		}
	}, [isApprovePending]);

	useEffect(() => {
		if (isApproveConfirming) {
			toast.dismiss();
			toast.loading('Confirming approval on blockchain...');
		}
	}, [isApproveConfirming]);

	useEffect(() => {
		if (isApproveSuccess) {
			toast.dismiss();
			toast.success('Approval successful! Now you can stake.');
		}
	}, [isApproveSuccess]);

	useEffect(() => {
		if (approveError) {
			toast.dismiss();
			toast.error(`Approval failed: ${approveError.message}`, {
				duration: 10000,
			});
		}
	}, [approveError]);

	// Stake toasts
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

	useEffect(() => {
		if (stakeError) {
			toast.dismiss();
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
