import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import MetaMaskSigner from './MetaMaskSigner';

import './App.css';

const ItemsPerPage = 10;

function App() {
	const [data, setData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [maticPrice, setMaticPrice] = useState(null);

	useEffect(() => {
		fetch('https://api.polygonscan.com/api?module=stats&action=maticprice&apikey=YourApiKeyToken')
			.then(response => response.json())
			.then(data => {
				if (data.status === "1") {
					setMaticPrice(data.result.maticusd);
				} else {
					console.error('Error fetching Matic price:', data.message);
				}
			})
			.catch(error => console.error('Error fetching Matic price:', error));
	}, []);
	useEffect(() => {
		fetch('/api.json')
			.then(response => response.json())
			.then(data => {
				setData(data);
				setIsLoading(false);
			})
			.catch(error => console.error("Failed to load data:", error));
	}, []);

	useEffect(() => {
		const loadMoreItems = () => {
			if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
				if (currentPage * ItemsPerPage < data.length) {
					setCurrentPage(currentPage => currentPage + 1);
				}
			}
		};

		window.addEventListener('scroll', loadMoreItems);

		return () => window.removeEventListener('scroll', loadMoreItems);
	}, [currentPage, data.length]);

	const currentData = data.slice(0, currentPage * ItemsPerPage);

	if (isLoading) {
		return <div className="loading">Loading...</div>;
	}

	return (
		<div className="App">

			<Navbar />

			<div className="earningsInfo">
				<div>TOP EARNING <a href="https://app.share.formless.xyz/assets/polygon/0xc77ea93cc084c2e9140e1f3dcdc8bfba3a9d3614" className="neonLink">SONG</a> = 2275 MATIC </div>

				{maticPrice && <div>1 MATIC = ${parseFloat(maticPrice).toFixed(2)}</div>}
				<div>SHARE REVENUE = 41,007 MATIC</div>


			</div>
			<ChartList items={currentData} />

			<Footer />
		</div>
	);
}

function ChartList({ items }) {
	return (
		<div className="chartList">
			{items.map(([address, details], index) => (

				<div key={index} className="chartItem">
					<div className="chartPosition">{index + 1}					</div>
					<div className="chartDetails">
						<div className="chartTitle">{details.title}    < MetaMaskSigner voteFor={details.title} />  </div>

						<div className="transactionrepeats">{details.repeats} TX + {details.revenue.toFixed(1)} MATIC REVENUE</div>
						<div class="spacer"></div>

						<a href={details.share} target="_blank" rel="noopener noreferrer" className="listenNowLink">
							<div className="contentWrapper">
								<span>Listen now on </span>
								<img src="https://app.share.formless.xyz/formless-mark-black.svg" alt="Formless Logo" style={{ width: '50px', height: '50px' }} />
							</div>	</a>

					</div>


				</div>
			))
			}
		</div >
	);
}


export default App;