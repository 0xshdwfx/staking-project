import { usePendingRewards } from '../hooks/usePendingRewards';
import { formatEther } from 'viem';

export function PendingRewards() {
	const { pendingRewards, isLoading, error } = usePendingRewards();

	if (isLoading) return <div>Loading rewards...</div>;
	if (error) return <div>Error loading rewards</div>;
	if (!pendingRewards) return <div>0.00 RWT</div>;

	const formattedRewards = formatEther(pendingRewards);

	return (
		<div>
			<h3>Pending Rewards</h3>
			<p>{parseFloat(formattedRewards).toFixed(4)} RWT</p>
		</div>
	);
}
