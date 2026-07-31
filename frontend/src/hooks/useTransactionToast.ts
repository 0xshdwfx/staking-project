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
			toast.loading(pendingMessage);
		}
	}, [isPending, pendingMessage]);

	useEffect(() => {
		if (isConfirming) {
			toast.dismiss();
			toast.loading(confirmingMessage);
		}
	}, [isConfirming, confirmingMessage]);

	useEffect(() => {
		if (isSuccess) {
			toast.dismiss();
			toast.success(successMessage);
		}
	}, [isSuccess, successMessage]);

	useEffect(() => {
		if (error) {
			toast.dismiss();
			toast.error(`Failed: ${(error as Error).message}`, {
				duration: 10000,
			});
		}
	}, [error]);
}
