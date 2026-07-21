import { usePendingRewards } from '../hooks/usePendingRewards';
import { formatEther } from 'viem';

export function PendingRewards() {
	const { pendingRewards, isLoading, error } = usePendingRewards();

	if (isLoading) return <div>Loading rewards...</div>;
	if (error) return <div>Error loading rewards</div>;
	if (!pendingRewards) return <div>0.00 Rewards</div>;

	const formattedRewards = formatEther(pendingRewards);

	return (
		<div className='pending-rewards'>
			<h3>Pending Rewards</h3>
			<p>{parseFloat(formattedRewards).toFixed(4)} Tokens</p>
		</div>
	);
}
