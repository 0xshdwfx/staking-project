import { useStakedAmount } from '../hooks/useStakedAmount';
import { formatEther } from 'viem';

export function StakedAmount() {
	const { stakedAmount, isLoading, error } = useStakedAmount();

	if (isLoading)
		return <div className='text-slate-400'>Loading staked amount...</div>;
	if (error)
		return <div className='text-red-400'>Error loading staked amount</div>;

	const formattedStakedAmount = stakedAmount
		? formatEther(stakedAmount)
		: '0.00';
	const displayAmount = parseFloat(formattedStakedAmount).toFixed(4);

	return (
		<div>
			<h3 className='text-sm font-semibold uppercase tracking-wide text-slate-400 mb-4'>
				Staked Amount
			</h3>
			<p className='text-4xl font-bold text-white mb-2'>{displayAmount}</p>
			<p className='text-sm text-slate-400'>STK</p>
		</div>
	);
}
