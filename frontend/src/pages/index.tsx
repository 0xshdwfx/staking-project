import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import { PendingRewards } from '../components/PendingRewards';
import { StakedAmount } from '../components/StakedAmount';
import { Stake } from '../components/Stake';
import { ClaimRewards } from '../components/ClaimRewards';
import { Unstake } from '../components/Unstake';
import { BiSolidCoin } from 'react-icons/bi';

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Staking Platform</title>
				<meta content='Staking Platform' name='description' />
				<link href='/favicon.ico' rel='icon' />
			</Head>

			<div className='min-h-screen bg-linear-to-br from-slate-900 to-slate-800'>
				{/* Header */}
				<header className='border-b border-slate-700 bg-slate-800/50 backdrop-blur'>
					<div className='mx-auto max-w-6xl px-6 py-6 flex items-center justify-between'>
						<div className='flex items-center gap-3'>
							<BiSolidCoin className='text-4xl text-yellow-500' />
							<h1 className='text-4xl font-bold text-white'>
								Staking Platform
							</h1>
						</div>
						<ConnectButton />
					</div>
				</header>

				{/* Main Content */}
				<main className='mx-auto max-w-6xl px-6 py-12'>
					{/* Stats Section */}
					<div className='mb-12 grid gap-6 md:grid-cols-2'>
						<div className='rounded-lg border border-slate-700 bg-slate-800 p-6 text-white'>
							<PendingRewards />
						</div>
						<div className='rounded-lg border border-slate-700 bg-slate-800 p-6 text-white'>
							<StakedAmount />
						</div>
					</div>

					{/* Actions Section */}
					<div className='grid gap-6 md:grid-cols-3'>
						<div className='rounded-lg border border-slate-700 bg-slate-800 p-6 text-white'>
							<Stake />
						</div>
						<div className='rounded-lg border border-slate-700 bg-slate-800 p-6 text-white'>
							<Unstake />
						</div>
						<div className='rounded-lg border border-slate-700 bg-slate-800 p-6 text-white'>
							<ClaimRewards />
						</div>
					</div>
				</main>
			</div>
		</>
	);
};

export default Home;
