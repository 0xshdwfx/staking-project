import { useStakedAmount } from '../hooks/useStakedAmount';
import { formatEther } from 'viem';

export function StakedAmount() {
	const { stakedAmount, isLoading, error } = useStakedAmount();

	if (isLoading) return <div>Loading staked amount...</div>;
	if (error) return <div>Error loading staked amount</div>;
	if (!stakedAmount) return <div>0.00 STK</div>;

	const formattedStakedAmount = formatEther(stakedAmount);

	return (
		<div>
			<h3>Staked Amount</h3>
			<p>{parseFloat(formattedStakedAmount).toFixed(4)} STK</p>
		</div>
	);
}
