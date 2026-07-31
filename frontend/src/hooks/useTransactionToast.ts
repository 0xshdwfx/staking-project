import { useEffect } from 'react';
import { toast } from 'sonner';

interface TransactionToastConfig {
	isPending: boolean;
	isConfirming: boolean;
	isSuccess: boolean;
	error: unknown;
	pendingMessage: string;
	confirmingMessage: string;
	successMessage: string;
}

function parseErrorMessage(error: unknown): string {
	if (!error) return 'An error occurred';

	const errorStr = String(error);

	if (errorStr.includes('InvalidStakeAmount')) return 'Invalid stake amount';
	if (errorStr.includes('AmountToUnstakeExceedsStakedAmount'))
		return 'Insufficient staked amount';
	if (errorStr.includes('RewardAmountIsZero'))
		return 'No pending rewards to claim';
	if (errorStr.includes('InsufficientAllowance'))
		return 'Insufficient token allowance';
	if (errorStr.includes('InsufficientBalance'))
		return 'Insufficient token balance';
	if (errorStr.includes('gas limit too high'))
		return 'Transaction gas limit exceeded';
	if (errorStr.includes('User rejected')) return 'Transaction rejected';

	return errorStr.substring(0, 100);
}

export function useTransactionToast(config: TransactionToastConfig) {
	const {
		isPending,
		isConfirming,
		isSuccess,
		error,
		pendingMessage,
		confirmingMessage,
		successMessage,
	} = config;

	useEffect(() => {
		if (isPending) {
			toast.loading(pendingMessage, {
				style: {
					background: '#3b82f6',
					color: '#fff',
				},
			});
		}
	}, [isPending, pendingMessage]);

	useEffect(() => {
		if (isConfirming) {
			toast.dismiss();
			toast.loading(confirmingMessage, {
				style: {
					background: '#06b6d4',
					color: '#fff',
				},
			});
		}
	}, [isConfirming, confirmingMessage]);

	useEffect(() => {
		if (isSuccess) {
			toast.dismiss();
			toast.success(successMessage, {
				style: {
					background: '#10b981',
					color: '#fff',
				},
			});
		}
	}, [isSuccess, successMessage]);

	useEffect(() => {
		if (error) {
			toast.dismiss();
			const friendlyMessage = parseErrorMessage(error);
			toast.error(friendlyMessage, {
				duration: 10000,
				style: {
					background: '#ef4444',
					color: '#fff',
				},
			});
		}
	}, [error]);
}
