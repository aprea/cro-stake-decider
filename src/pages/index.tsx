import equal from 'fast-deep-equal/es6';
import type { NextPage } from 'next';
import Head from 'next/head';
import { ChangeEventHandler, memo, useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import type { FormControlProps } from 'react-bootstrap/esm/FormControl';
import type { ToggleButtonRadioProps } from 'react-bootstrap/esm/ToggleButtonGroup';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import Navbar from 'react-bootstrap/Navbar';
import Table from 'react-bootstrap/Table';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

const currencyCodes = [
	'USD',
	'EUR',
	'GBP',
	'CAD',
	'AUD',
	'BGN',
	'BRL',
	'CHF',
	'CZK',
	'DKK',
	'HRK',
	'HUF',
	'ISK',
	'JPY',
	'NOK',
	'NZD',
	'PLN',
	'RON',
	'SEK',
	'SGD',
];

const currencyConversions = {
	USD: 1,
	EUR: 0.98,
	GBP: 0.82,
	CAD: 1.28,
	AUD: 1.43,
	BGN: 1.91,
	BRL: 5.17,
	CHF: 0.95,
	CZK: 24.07,
	DKK: 7.28,
	HRK: 7.37,
	HUF: 395.34,
	ISK: 135.62,
	JPY: 133.24,
	NOK: 9.66,
	NZD: 1.61,
	PLN: 4.63,
	RON: 4.82,
	SEK: 10.06,
	SGD: 1.38,
};

enum PerkType {
	Spotify,
	Netflix,
	AmazonPrime,
}

type Perk = {
	id: PerkType;
	name: string;
	value: number;
};

const perks: Record<PerkType, Perk> = Object.freeze( {
	[ PerkType.Spotify ]: {
		id: PerkType.Spotify,
		name: 'Spotify',
		value: 13.99,
	},
	[ PerkType.Netflix ]: {
		id: PerkType.Netflix,
		name: 'Netflix',
		value: 13.99,
	},
	[ PerkType.AmazonPrime ]: {
		id: PerkType.AmazonPrime,
		name: 'Amazon Prime',
		value: 14.99,
	},
} );

enum CardTier {
	Ruby,
	JadeIndigo,
	IcyRose,
	Obsidian,
}

type Card = {
	cashbackRate: number;
	id: CardTier;
	monthlyCap: number | false;
	name: string;
	noStakeCashbackRate: number;
	perks: PerkType[];
	stakingRewards: number;
};

const cards: Record<CardTier, Card> = Object.freeze( {
	[ CardTier.Ruby ]: {
		cashbackRate: 0.01,
		id: CardTier.Ruby,
		monthlyCap: 25,
		name: 'Ruby Steel',
		noStakeCashbackRate: 0,
		perks: [ PerkType.Spotify ],
		stakingRewards: 0,
	},
	[ CardTier.JadeIndigo ]: {
		cashbackRate: 0.02,
		id: CardTier.JadeIndigo,
		monthlyCap: 50,
		name: 'Royal Indigo or Jade Green',
		noStakeCashbackRate: 0,
		perks: [ PerkType.Spotify, PerkType.Netflix ],
		stakingRewards: 0.04,
	},
	[ CardTier.IcyRose ]: {
		id: CardTier.IcyRose,
		cashbackRate: 0.03,
		monthlyCap: false,
		name: 'Rose Gold or Icy White',
		noStakeCashbackRate: 0.01,
		perks: [ PerkType.Spotify, PerkType.Netflix, PerkType.AmazonPrime ],
		stakingRewards: 0.08,
	},
	[ CardTier.Obsidian ]: {
		id: CardTier.Obsidian,
		cashbackRate: 0.05,
		monthlyCap: false,
		name: 'Obsidian',
		noStakeCashbackRate: 0.02,
		perks: [ PerkType.Spotify, PerkType.Netflix, PerkType.AmazonPrime ],
		stakingRewards: 0.08,
	},
} );

type CdcOrgStakingAPR = number|'';
type CroUSD = number|'';
type UserCard = CardTier;
type UserCardStake = number|'';
type UserCurrency = keyof typeof currencyConversions;
type UserMonthlySpend = number|'';
type UserPerks = Set<PerkType>;
type UserCurrencyConversion = number|'';

type ResultsProps = {
	cdcOrgStakingAPR: CdcOrgStakingAPR;
	croUsd: CroUSD;
	perkUSDValues: Map<PerkType, number|string>;
	userCard: UserCard;
	userCardStake: UserCardStake;
	userCurrency: UserCurrency;
	userCurrencyConversionRate: UserCurrencyConversion;
	userLocale: string;
	userMonthlySpend: UserMonthlySpend;
	userPerks: UserPerks;
};

const Results: React.FC<ResultsProps> = memo( ( {
	cdcOrgStakingAPR,
	croUsd,
	perkUSDValues,
	userCard,
	userCardStake,
	userCurrency,
	userCurrencyConversionRate,
	userLocale,
	userMonthlySpend,
	userPerks,
} ) => {
	cdcOrgStakingAPR = cdcOrgStakingAPR || 0;
	croUsd = croUsd || 0;
	userCurrencyConversionRate = userCurrencyConversionRate || 0;

	const userMonthlySpendUSD = ( userMonthlySpend || 0 ) * ( 1 / userCurrencyConversionRate );

	const currencyFormatter = new Intl.NumberFormat( userLocale, { style: 'currency', currency: userCurrency, currencyDisplay: 'narrowSymbol' } );
	const currencyFormatterWithSymbol = new Intl.NumberFormat( userLocale, { style: 'currency', currency: userCurrency, currencyDisplay: 'symbol' } );
	const numberFormatter = new Intl.NumberFormat( userLocale, { maximumFractionDigits: 0 } );
	let cashbackFiatPerMonth = ( userMonthlySpendUSD || 0 ) * cards[ userCard ].cashbackRate;
	cashbackFiatPerMonth = cards[ userCard ].monthlyCap ? Math.min( cashbackFiatPerMonth, + cards[ userCard ].monthlyCap ) : cashbackFiatPerMonth;

	const cashbackFiatPerYear = cashbackFiatPerMonth * 12;
	const cashbackCroPerMonth = cashbackFiatPerMonth / croUsd;
	const cashbackCroPerYear = cashbackFiatPerYear / croUsd;
	const userPerksRebateFiatPerMonth = Array.from( userPerks ).reduce( ( acc, perk ) => acc + Number( perkUSDValues.get( perk ) ), 0 );
	const userPerksRebateFiatPerYear = userPerksRebateFiatPerMonth * 12;
	const userPerksRebateCroPerMonth = userPerksRebateFiatPerMonth / croUsd;
	const userPerksRebateCroPerYear = userPerksRebateFiatPerYear / croUsd;
	const croStakeRewardsCroPerYear = ( userCardStake || 0 ) * cards[ userCard ].stakingRewards;
	const croStakeRewardsCroPerMonth = croStakeRewardsCroPerYear / 12;
	const croStakeRewardsFiatPerYear = croStakeRewardsCroPerYear * croUsd;
	const croStakeRewardsFiatPerMonth = croStakeRewardsFiatPerYear / 12;
	const totalCardStakeFiatPerMonth = cashbackFiatPerMonth + userPerksRebateFiatPerMonth + croStakeRewardsFiatPerMonth;
	const totalCardStakeFiatPerYear = cashbackFiatPerYear + userPerksRebateFiatPerYear + croStakeRewardsFiatPerYear;
	const totalCardStakeCroPerMonth = cashbackCroPerMonth + userPerksRebateCroPerMonth + croStakeRewardsCroPerMonth;
	const totalCardStakeCroPerYear = cashbackCroPerYear + userPerksRebateCroPerYear + croStakeRewardsCroPerYear;

	const noStakeCashbackFiatPerMonth = userMonthlySpendUSD * cards[ userCard ].noStakeCashbackRate;
	const noStakeCashbackFiatPerYear = noStakeCashbackFiatPerMonth * 12;
	const noStakeCashbackCroPerMonth = noStakeCashbackFiatPerMonth / croUsd;
	const noStakeCashbackCroPerYear = noStakeCashbackFiatPerYear / croUsd;
	const defiStakingRewardsCroPerYear = ( userCardStake || 0 ) * cdcOrgStakingAPR;
	const defiStakingRewardsCroPerMonth = defiStakingRewardsCroPerYear / 12;
	const defiStakingRewardsFiatPerYear = defiStakingRewardsCroPerYear * croUsd;
	const defiStakingRewardsFiatPerMonth = defiStakingRewardsFiatPerYear / 12;
	const totalDefiStakeFiatPerMonth = noStakeCashbackFiatPerMonth + defiStakingRewardsFiatPerMonth;
	const totalDefiStakeFiatPerYear = noStakeCashbackFiatPerYear + defiStakingRewardsFiatPerYear;
	const totalDefiStakeCroPerMonth = noStakeCashbackCroPerMonth + defiStakingRewardsCroPerMonth;
	const totalDefiStakeCroPerYear = noStakeCashbackCroPerYear + defiStakingRewardsCroPerYear;

	const isCardStakeYieldGreaterThanDefiStakeYield = totalCardStakeCroPerYear > totalDefiStakeCroPerYear;

	const stakingDifferenceFiatPerYear = Math.abs( totalCardStakeFiatPerYear - totalDefiStakeFiatPerYear );

	const formatFiat = ( amount: number ) => {
		return currencyFormatter.format( amount * ( userCurrencyConversionRate || 0 ) );
	};

	const BestOptionBadge = () => (
		<Badge bg="primary" pill>Best Option</Badge>
	);

	const SecondBestOptionBadge = () => (
		<Badge bg="secondary" pill>Second Best Option</Badge>
	);

	const CardStakeTable: React.FC<{index: number}> = ( { index } ) => (
		<>
			{ index === 0 ? (
				<BestOptionBadge />
			) : (
				<SecondBestOptionBadge />
			) }
			<h2>Crypto.com Card Staking</h2>
			<Table className="results-table">
				<thead>
					<tr>
						<th>Card Benefits</th>
						<th>
							Per Month
							<small>{ userCurrency }</small>
						</th>
						<th>
							Per Year
							<small>{ userCurrency }</small>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th>
							Card Cashback<br />
							<small>{ cards[ userCard ].cashbackRate * 100 }% { cards[ userCard ].monthlyCap ? `- $${ cards[ userCard ].monthlyCap } USD p/month cap` : 'unlimited' }</small>
						</th>
						{ cashbackFiatPerMonth ? (
							<>
								<td>
									{ formatFiat( cashbackFiatPerMonth ) }<br />
									<small>{ numberFormatter.format( cashbackCroPerMonth ) } CRO</small>
								</td>
								<td>
									{ formatFiat( cashbackFiatPerYear ) }<br />
									<small>{ numberFormatter.format( cashbackCroPerYear ) } CRO</small>
								</td>
							</>
						) : (
							<td colSpan={ 2 }>
								&ndash;
							</td>
						) }
					</tr>
					<tr>
						<th>
							Perk Rebates<br />
							<small>
								{ Array.from( userPerks ).map( perk => ( perks[ perk ].name ) ).join( ', ' ) }
							</small>

						</th>
						{ userPerksRebateFiatPerMonth ? (
							<>
								<td>
									{ formatFiat( userPerksRebateFiatPerMonth ) }<br />
									<small>{ numberFormatter.format( userPerksRebateCroPerMonth ) } CRO</small>
								</td>
								<td>
									{ formatFiat( userPerksRebateFiatPerYear ) }<br />
									<small>{ numberFormatter.format( userPerksRebateCroPerYear ) } CRO</small>
								</td>
							</>
						) : (
							<td colSpan={ 2 }>
								&ndash;
							</td>
						) }
					</tr>
					<tr>
						<th>
							Card Stake Rewards<br />
							<small>{ cards[ userCard ].stakingRewards * 100 }% APR</small>
						</th>
						{ croStakeRewardsFiatPerMonth ? (
							<>
								<td>
									{ formatFiat( croStakeRewardsFiatPerMonth ) }<br />
									<small>{ numberFormatter.format( croStakeRewardsCroPerMonth ) } CRO</small>
								</td>
								<td>
									{ formatFiat( croStakeRewardsFiatPerYear ) }<br />
									<small>{ numberFormatter.format( croStakeRewardsCroPerYear ) } CRO</small>
								</td>
							</>
						) : (
							<td colSpan={ 2 }>
								&ndash;
							</td>
						) }
					</tr>
					<tr className="totals">
						<td>Totals</td>
						<td>
							{ formatFiat( totalCardStakeFiatPerMonth ) }<br />
							<small>{ numberFormatter.format( totalCardStakeCroPerMonth ) } CRO</small>
						</td>
						<td>
							{ formatFiat( totalCardStakeFiatPerYear ) }<br />
							<small>{ numberFormatter.format( totalCardStakeCroPerYear ) } CRO</small>
						</td>
					</tr>
				</tbody>
			</Table>
		</>
	);

	const DefiStakeTable: React.FC<{index: number}> = ( { index } ) => (
		<>
			{ index === 0 ? (
				<BestOptionBadge />
			) : (
				<SecondBestOptionBadge />
			) }
			<h2>Crypto.org Chain Staking</h2>
			<Table className="results-table">
				<thead>
					<tr>
						<th />
						<th>
							Per Month
							<small>{ userCurrency }</small>
						</th>
						<th>
							Per Year
							<small>{ userCurrency }</small>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th>
							No Stake Card Cashback<br />
							<small>{ cards[ userCard ].noStakeCashbackRate * 100 }%</small>
						</th>
						{ noStakeCashbackFiatPerMonth ? (
							<>
								<td>
									{ formatFiat( noStakeCashbackFiatPerMonth ) }<br />
									<small>{ numberFormatter.format( noStakeCashbackCroPerMonth ) } CRO</small>
								</td>
								<td>
									{ formatFiat( noStakeCashbackFiatPerYear ) }<br />
									<small>{ numberFormatter.format( noStakeCashbackCroPerYear ) } CRO</small>
								</td>
							</>
						) : (
							<td colSpan={ 2 }>
								&ndash;
							</td>
						) }
					</tr>
					<tr>
						<th>
							Crypto.org Chain Staking<br />
							<small>{ ( cdcOrgStakingAPR || 0 ) * 100 }% APR</small>
						</th>
						{ defiStakingRewardsCroPerYear ? (
							<>
								<td>
									{ formatFiat( defiStakingRewardsFiatPerMonth ) }<br />
									<small>{ numberFormatter.format( defiStakingRewardsCroPerMonth ) } CRO</small>
								</td>
								<td>
									{ formatFiat( defiStakingRewardsFiatPerYear ) }<br />
									<small>{ numberFormatter.format( defiStakingRewardsCroPerYear ) } CRO</small>
								</td>
							</>
						) : (
							<td colSpan={ 2 }>
								&ndash;
							</td>
						) }
					</tr>
					<tr className="totals">
						<td>Totals</td>
						<td>
							{ formatFiat( totalDefiStakeFiatPerMonth ) }<br />
							<small>{ numberFormatter.format( totalDefiStakeCroPerMonth ) } CRO</small>
						</td>
						<td>
							{ formatFiat( totalDefiStakeFiatPerYear ) }<br />
							<small>{ numberFormatter.format( totalDefiStakeCroPerYear ) } CRO</small>
						</td>
					</tr>
				</tbody>
			</Table>
		</>
	);

	const tableComponents = [
		{
			yearlyCroYield: totalCardStakeCroPerYear,
			Component: CardStakeTable,
		},
		{
			yearlyCroYield: totalDefiStakeCroPerYear,
			Component: DefiStakeTable,
		},
	].sort( ( a, b ) => b.yearlyCroYield - a.yearlyCroYield );

	return (
		<div className="results">
			<>
				<h2>Results</h2>

				{ ( !! userCardStake && !! userMonthlySpend ) && (
					<>
						{ isCardStakeYieldGreaterThanDefiStakeYield ? (
							<p>Based on the information provided above, you will earn <span className="fiat-difference">{ currencyFormatterWithSymbol.format( stakingDifferenceFiatPerYear * userCurrencyConversionRate ) }</span> more per year by continuing your <b>Crypto.com card stake</b> compared to staking your CRO via Crypto.org chain staking.</p>
						) : (
							<p>Based on the information provided above, you will earn <span className="fiat-difference">{ currencyFormatterWithSymbol.format( stakingDifferenceFiatPerYear * userCurrencyConversionRate ) }</span> more per year by staking your CRO via <b>Crypto.org chain staking</b> compared to continuing your Crypto.com card stake.</p>
						) }

						<p>See a breakdown of this calculation below.</p>
						<div className="table-wrapper">
							{ tableComponents.map( ( { Component }, index ) => <Component index={ index } key={ index } /> ) }
						</div>
					</>
				) }

				{ ( ! userCardStake || ! userMonthlySpend ) && (
					<p className="mb-5">Please fill in the form fields above to see the results.</p>
				) }
			</>
		</div>
	);
} );

const Home: NextPage = () => {
	const [ cdcOrgStakingAPR, setCdcOrgStakingAPR ] = useState<CdcOrgStakingAPR>( 0.115 );
	const [ croUsd, setCroUsd ] = useState<CroUSD>( 0.14 );
	const [ isHelpModalOpen, setIsHelpModalOpen ] = useState( false );
	const [ isSettingsModalOpen, setIsSettingsModalOpen ] = useState( false );
	const [ perkUSDValues, setPerkUSDValues ] = useState<Map<PerkType, number|string>>( new Map( Object.values( perks ).map( perk => [ perk.id, perk.value ] ) ) );
	const [ userCard, setUserCard ] = useState<UserCard>( CardTier.Ruby );
	const [ userCardStake, setUserCardStake ] = useState<UserCardStake>( '' );
	const [ userCurrency, setUserCurrency ] = useState<UserCurrency>( 'USD' );
	const [ userCurrencyConversionRate, setUserCurrencyConversionRate ] = useState<UserCurrencyConversion>( 1 );
	const [ userMonthlySpend, setUserMonthlySpend ] = useState<UserMonthlySpend>( '' );
	const [ userPerks, setUserPerks ] = useState<UserPerks>( new Set() );
	const [ userLocale, setUserLocale ] = useState( 'en-US' );

	useEffect( () => {
		const locale = navigator.language || 'en-US';
		setUserLocale( locale );
	}, [ userLocale ] );

	useEffect( () => {
		document.addEventListener( 'wheel', () => {
			const activeElement = document.activeElement as HTMLInputElement;

			if ( activeElement?.type === 'number' ) {
				activeElement.blur();
			}
		} );
	}, [] );

	const handleUserCardStakeChange: FormControlProps['onChange'] = e => {
		const newUserCardStake = e.currentTarget.value;
		setUserCardStake( newUserCardStake === '' ? newUserCardStake : Number( newUserCardStake ) );
	};

	const handleUserMonthlySpendChange: FormControlProps['onChange'] = e => {
		const newMonthlySpend = e.currentTarget.value;
		setUserMonthlySpend( newMonthlySpend === '' ? newMonthlySpend : Number( newMonthlySpend ) );
	};

	const handleUserCardChange: ToggleButtonRadioProps<CardTier>['onChange'] = newUserCard => {
		setUserCard( newUserCard );

		const newUserPerks = new Set( userPerks );

		newUserPerks.forEach( userPerk => {
			if ( ! cards[ newUserCard ].perks.includes( userPerk ) ) {
				newUserPerks.delete( userPerk );
			}
		} );

		if ( ! equal( newUserPerks, userPerks ) ) {
			setUserPerks( newUserPerks );
		}
	};

	const handleCroUsdChange: FormControlProps['onChange'] = e => {
		const newCroUsd = e.currentTarget.value;
		setCroUsd( newCroUsd === '' ? newCroUsd : Number( newCroUsd ) );
	};

	const handleCdcOrgStakingAPRChange: FormControlProps['onChange'] = e => {
		const newCdcOrgStakingAPR = e.currentTarget.value;
		setCdcOrgStakingAPR( newCdcOrgStakingAPR === '' ? newCdcOrgStakingAPR : Number( newCdcOrgStakingAPR ) / 100 );
	};

	const handleUserCurrencyChange: ChangeEventHandler<HTMLSelectElement> = e => {
		const newUserCurrency = e.currentTarget.value as UserCurrency;
		setUserCurrency( newUserCurrency );
		setUserCurrencyConversionRate( currencyConversions[ newUserCurrency ] );
	};

	const handleUserCurrencyConversionRateChange: FormControlProps['onChange'] = e => {
		const newUserCurrencyConversionRateChange = e.currentTarget.value;
		setUserCurrencyConversionRate( newUserCurrencyConversionRateChange === '' ? newUserCurrencyConversionRateChange : Number( newUserCurrencyConversionRateChange ) );
	};

	const createPerkValueChangeHandler = ( perkType: PerkType ) => {
		const handler: FormControlProps['onChange'] = e => {
			const newPerkValue = e.currentTarget.value === '' ? e.currentTarget.value : Number( e.currentTarget.value );
			const newPerkValues = new Map( perkUSDValues ).set( perkType, ( newPerkValue ) );
			setPerkUSDValues( newPerkValues );
		};

		return handler;
	};

	return (
		<>
			<Head>
				<title>CRO Stake Decider</title>
				<meta content="CRO Stake Decider helps you decide where to stake your CRO, either in the crypto.com app or crypto.org DeFi staking." name="description" />
				<link href="/favicon.svg" rel="icon" type="image/svg+xml" />
				<link href="/favicon.png" rel="icon" type="image/png" />
			</Head>
			<Modal className="help-modal" onHide={ () => setIsHelpModalOpen( false ) } show={ isHelpModalOpen }>
				<Modal.Header closeButton>
					<Modal.Title>FAQs</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<h5>What is this?</h5>
					<p>This website compares the rewards and benefits of an active Crypto.com card stake compared to Crypto.org chain DeFi staking.</p>

					<h5>Who is this website for?</h5>
					<p>This website is for Crypto.com users with an <strong>unlocked card stake</strong> who want to compare the value of their card benefits against the potential returns of staking their CRO via the Crypto.org chain.</p>

					<h5>How do I use this website?</h5>
					<p>Follow these four simple steps:</p>
					<ol>
						<li>Select your current Crypto.com card (e.g. Ruby, Jade Green, Icy White, etc.)</li>
						<li>Enter the total amount of CRO staked for your card (can be found in the Crypto.com app).</li>
						<li>Select the services you use. Only select services that are linked to your Crypto.com card.</li>
						<li>Enter the amount you spend per month on your Crypto.com card. Make sure to select your local currency.</li>
					</ol>

					<p>Once you have entered all of your information, you will see the results in the results section.</p>

					<h5>What is the Crypto.org chain?</h5>
					<p>Crypto.org Chain is a public, open-source and permissionless blockchain - a fully decentralized network with high speed and low fees, designed to be a public good that helps drive mass adoption of blockchain technology through use cases like Payments, DeFi and NFTs.</p>

					<h5>What is Crypto.org chain staking?</h5>
					<p>Crypto.org chain users can delegate their native CRO tokens to a trusted Validator. Validators run nodes to validate transactions on the Crypto.org Chain network and in return earn block rewards in CRO, which are then distributed to the Delegators after taking a Validator commission.</p>
					<p><a href="https://help.crypto.com/en/articles/5015391-all-about-crypto-org-chain-cro-staking-on-defi-earn">Read more here</a>.</p>

					<h5>Is this website safe to use?</h5>
					<p>Put simply, yes. This website doesn&apos;t store any data. We do not send your data to a backend server. The code is fully open source (you can check the <a href="https://github.com/aprea/cro-stake-decider">GitHub repo</a>). This website doesn&apos;t use cookies or track analytics data.</p>

					<p>You can even use this website in airplane/offline mode, all the calculations take place locally in your browser.</p>

					<h5>Some of the values look incorrect</h5>
					<p>This is because the calculations are based on hardcoded values, e.g. CRO USD price, Crypto.org Staking APR, currency pair rates, etc.</p>

					<p>You can adjust these values yourself by clicking the settings button (cog icon) located in the navigation bar.</p>
				</Modal.Body>
			</Modal>
			<Modal className="settings-modal" onHide={ () => setIsSettingsModalOpen( false ) } show={ isSettingsModalOpen }>
				<Modal.Header closeButton>
					<Modal.Title>Settings</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form.Group className="form-group row" controlId="cro-usd">
						<div className="col-9">
							<Form.Label>CRO USD</Form.Label>
							<Form.Text className="text-muted">
								USD value of 1 CRO.
							</Form.Text>
						</div>
						<div className="col-3">
							<Form.Control onChange={ handleCroUsdChange } pattern="\d+" required type="number" value={ croUsd } />
						</div>
					</Form.Group>
					<Form.Group className="form-group row" controlId="cdc-org-staking-apr">
						<div className="col-9">
							<Form.Label>Crypto.org Staking APR</Form.Label>
							<Form.Text className="text-muted">
								Crypto.org chain staking APR.
							</Form.Text>
						</div>
						<div className="col-3">
							<Form.Control onChange={ handleCdcOrgStakingAPRChange } pattern="\d+" required type="number" value={ typeof cdcOrgStakingAPR !== 'number' ? cdcOrgStakingAPR : Number( ( ( cdcOrgStakingAPR || 0 ) * 100 ).toFixed( 4 ) ) } />
						</div>
					</Form.Group>
					{ userCurrency !== 'USD' && (
						<Form.Group className="form-group row" controlId="user-currency-conversion-rate">
							<div className="col-9">
								<Form.Label>USD/{ userCurrency } Rate</Form.Label>
								<Form.Text className="text-muted">
									US$1 in your local currency.
								</Form.Text>
							</div>
							<div className="col-3">
								<Form.Control onChange={ handleUserCurrencyConversionRateChange } pattern="\d+" required type="number" value={ userCurrencyConversionRate } />
							</div>
						</Form.Group>
					) }
					{ Array.from( perkUSDValues ).map( ( [ perkType, perkValueUsd ] ) => {
						return (
							<Form.Group className="form-group row" controlId={ `perk-${ perkType }-value` } key={ perkType }>
								<div className="col-9">
									<Form.Label>{ perks[ perkType ].name } USD Value</Form.Label>
									<Form.Text className="text-muted">
										Monthly USD value of { perks[ perkType ].name }.
									</Form.Text>
								</div>
								<div className="col-3">
									<Form.Control onChange={ createPerkValueChangeHandler( perkType ) } pattern="\d+" required type="number" value={ perkValueUsd } />
								</div>
							</Form.Group>
						);
					} ) }
				</Modal.Body>
			</Modal>
			<div className="App">
				<Navbar bg="dark" expand="lg" fixed="top" variant="dark">
					<Container fluid>
						<Navbar.Brand>
							<svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
								<path d="M12.036.3L1.8 6.199v11.797l10.236 5.9 10.236-5.9V6.2L12.036.3zm7.2 15.962l-7.2 4.134-7.2-4.134V7.934l7.2-4.135 7.2 4.164v8.299z" fill="#fff" />
								<path d="M16.807 14.845l-4.77 2.775-4.772-2.775V9.35l4.771-2.776 4.771 2.776v5.494z" fill="#fff" />
							</svg>
							<h1>CRO Stake Decider</h1>
						</Navbar.Brand>
						<div className="d-flex navbar-buttons">
							<Button aria-label="Help" onClick={ () => setIsHelpModalOpen( true ) } variant="link">
								<svg className="bi bi-info-circle-fill" fill="#fff" viewBox="0 0 16 16" width="24" xmlns="http://www.w3.org/2000/svg">
									<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
								</svg>
							</Button>
							<Button aria-label="Settings" onClick={ () => setIsSettingsModalOpen( true ) } variant="link">
								<svg fill="#fff" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
									<path d="M22.2 14.4l-1.2-.7a2.06 2.06 0 010-3.5l1.2-.7c1-.6 1.3-1.8.7-2.7l-1-1.7c-.6-1-1.8-1.3-2.7-.7l-1.2.7c-1.3.8-3-.2-3-1.7V2c0-1.1-.9-2-2-2h-2C9.9 0 9 .9 9 2v1.3C9 4.8 7.3 5.8 6 5l-1.2-.6a1.94 1.94 0 00-2.7.7l-1 1.7c-.5 1-.2 2.2.7 2.8l1.2.7c1.3.7 1.3 2.7 0 3.4l-1.2.7c-1 .6-1.3 1.8-.7 2.7l1 1.7c.6 1 1.8 1.3 2.7.7l1.2-.6c1.3-.8 3 .2 3 1.7V22c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-1.3c0-1.5 1.7-2.5 3-1.7l1.2.7a1.94 1.94 0 002.7-.7l1-1.7c.5-1.1.2-2.3-.7-2.9zM12 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" />
								</svg>
							</Button>
						</div>
					</Container>
				</Navbar>
				<Container className="container-fluid">
					<Form.Group className="form-group" controlId="user-card">
						<Form.Label>Your card</Form.Label>
						<ToggleButtonGroup className="cards" name="user-card" onChange={ handleUserCardChange } type="radio" value={ userCard }>
							{ Object.values( cards ).map( card => {
								const cardNameParts = card.name.split( ' or ' );

								return (
									<ToggleButton className={ `card-${ card.id }` } id={ `card-${ card.id }` } key={ card.id } value={ card.id } variant="card">
										{ cardNameParts.length === 1 ? card.name : [ `${ cardNameParts[ 0 ] } or`, <br key={ card.id } />, cardNameParts[ 1 ] ] }
									</ToggleButton>
								);
							} ) }
						</ToggleButtonGroup>
					</Form.Group>
					<Form.Group className="form-group" controlId="user-card-stake">
						<Form.Label>Your card stake (in CRO)</Form.Label>
						<Form.Control onChange={ handleUserCardStakeChange } pattern="\d+" required size="lg" type="number" value={ userCardStake } />
						<Form.Text className="text-muted">
							The total amount of CRO staked for your card.<br />
							i.e. Accounts &rarr; Crypto Wallet &rarr; Cronos &rarr; CRO Stake
						</Form.Text>
					</Form.Group>
					<Form.Group className="form-group" controlId="user-perks">
						<Form.Label className="mb-1">Your perks</Form.Label>
						<Form.Text className="text-muted mb-4 mt-0">
							Select the services you use.
						</Form.Text>
						<ToggleButtonGroup className="perks" name="user-perks" onChange={ ( val: PerkType[] ) => setUserPerks( new Set( val ) ) } type="checkbox" value={ Array.from( userPerks ) }>
							{ Object.values( perks ).map( perk => (
								<ToggleButton className={ `perk-${ perk.id }` } disabled={ ! cards[ userCard ].perks.includes( perk.id ) } id={ `perk-${ perk.id }` } key={ perk.id } value={ perk.id } variant="card">
									{ perk.name }<br />
									<small className="mt-1">{ `$${ perkUSDValues.get( perk.id ) || 0 } USD p/month` }</small>
								</ToggleButton>
							) ) }
						</ToggleButtonGroup>
					</Form.Group>
					<Form.Group className="form-group" controlId="user-monthly-spend">
						<Form.Label>Your monthly spend</Form.Label>
						<InputGroup>
							<Form.Control onChange={ handleUserMonthlySpendChange } pattern="\d+" required size="lg" type="number" value={ userMonthlySpend } />
							<Form.Select aria-label="Select your local currency" className="user-currency" onChange={ handleUserCurrencyChange } value={ userCurrency }>
								{ currencyCodes.map( currency => (
									<option key={ currency } value={ currency }>{ currency }</option>
								) ) }
							</Form.Select>
						</InputGroup>
						<Form.Text className="text-muted">
							Select your local currency, e.g. USD.
							{ userCurrency !== 'USD' && (
								<>
									<br />
									US$1 = { new Intl.NumberFormat( userLocale, { style: 'currency', currency: userCurrency, currencyDisplay: 'symbol' } ).format( Number( userCurrencyConversionRate ) ) }
								</>
							) }
						</Form.Text>
					</Form.Group>
					<Results { ...{ userCard, userMonthlySpend, croUsd, userPerks, userCardStake, userCurrency, cdcOrgStakingAPR, userCurrencyConversionRate, perkUSDValues, userLocale } } />
				</Container>
				<footer className="bg-dark text-center text-white">
					<div>
						<Container className="logo-links" fluid>
							<Navbar.Brand>
								<svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
									<path d="M12.036.3L1.8 6.199v11.797l10.236 5.9 10.236-5.9V6.2L12.036.3zm7.2 15.962l-7.2 4.134-7.2-4.134V7.934l7.2-4.135 7.2 4.164v8.299z" fill="#fff" />
									<path d="M16.807 14.845l-4.77 2.775-4.772-2.775V9.35l4.771-2.776 4.771 2.776v5.494z" fill="#fff" />
								</svg>
								CRO Stake Decider
							</Navbar.Brand>
							<div className="links">
								<a href="https://twitter.com/chrisaprea">
									<span className="visually-hidden">@chrisaprea on Twitter</span>
									<svg className="bi bi-twitter" fill="currentColor" viewBox="0 0 16 16" width="24" xmlns="http://www.w3.org/2000/svg">
										<path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
									</svg>
								</a>
								<a href="https://github.com/aprea/cro-stake-decider">
									<span className="visually-hidden">Visit the project on GitHub</span>
									<svg className="bi bi-github" fill="currentColor" viewBox="0 0 16 16" width="24" xmlns="http://www.w3.org/2000/svg">
										<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
									</svg>
								</a>
							</div>
						</Container>
						<Container fluid>
							<hr />
						</Container>
						<Container className="disclaimer" fluid>
							<p><strong>Disclaimer:</strong> Please use this website at your own risk. It is up to you to verify accuracy of the information presented on this website. While every effort has been made to ensure the accuracy and completeness of the information, no guarantee is given nor responsibility taken for errors or omissions in the information presented. In no event will we be liable for you or anyone else for any decision made or action taken in reliance on data from this website.</p>
							<p>This website is provided for informational purposes only. It does not constitute financial, tax or legal advice. For financial or legal advice, please consult your own professional. It cannot guarantee lack of error. As such, we will not be liable for any loss or damage of any nature.</p>
							<p>Crypto.com and its trademarks are copyright &copy; { new Date().getFullYear() } Crypto.com. This website is not produced by, endorsed by, supported by, or affiliated with Crypto.com.</p>
						</Container>
					</div>
					<div>
						<small>Copyright &copy; { new Date().getFullYear() } CRO Stake Decider. All rights reserved.</small>
					</div>
				</footer>
			</div>
		</>
	);
};

export default Home;
