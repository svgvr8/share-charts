import React from 'react';
import { ethers } from 'ethers';
import './App.css';

function MetaMaskSigner({ voteFor }) {
	const handleSign = async () => {
		if (!window.ethereum) {
			console.log('Crypto Wallet is not installed! Install Coinbase or Metamask');
			return;
		}

		try {
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			const signerAddress = accounts[0];
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();

			const signature = await signer.signMessage(`I vote for ${voteFor}`);
			console.log(`Vote by: ${signerAddress} for: ${voteFor}`);

			// Define the server endpoint
			const serverEndpoint = 'https://4540a0b4-6bbe-4467-8653-7c8a40bfc318-00-15e0qxt8pczux.worf.replit.dev/vote';

			fetch(serverEndpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ signerAddress, voteFor }),
			})
				.then(response => response.text())
				.then(data => console.log(data))
				.catch((error) => {
					console.error('Error:', error);
				});

		} catch (error) {
			console.error("Error connecting to MetaMask", error);
		}
	};

	return (
		<button onClick={handleSign} className='vote-button'>Vote</button>
	);
}

export default MetaMaskSigner;
