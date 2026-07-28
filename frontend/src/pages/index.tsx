import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { PendingRewards } from '../components/PendingRewards';
import { StakedAmount } from '../components/StakedAmount';
import { Stake } from '../components/Stake';
import { ClaimRewards } from '../components/ClaimRewards';

const Home: NextPage = () => {
	return (
		<div className={styles.container}>
			<Head>
				<title>Staking Platform</title>
				<meta content='Staking Platform' name='description' />
				<link href='/favicon.ico' rel='icon' />
			</Head>

			<main className={styles.main}>
				<h1>Staking Platform</h1>
				<ConnectButton />
				<PendingRewards />
				<StakedAmount />
				<Stake />
				<ClaimRewards />
			</main>
		</div>
	);
};

export default Home;
