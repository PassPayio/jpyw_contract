/**
 * @type import('hardhat/config').HardhatUserConfig
 */
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-etherscan'
import { HardhatUserConfig } from 'hardhat/config'
import * as dotenv from 'dotenv'

dotenv.config()

const private_key = typeof process.env.PRIVATE_KEY === 'undefined' ? '' : process.env.PRIVATE_KEY
const etherscanApiKey = typeof process.env.ETHERSCAN_API_KEY === 'undefined' ? '' : process.env.ETHERSCAN_API_KEY
const polygonscanApiKey = typeof process.env.POLYGONSCAN_API_KEY === 'undefined' ? '' : process.env.POLYGONSCAN_API_KEY
const bscscanApiKey = typeof process.env.BSCSCAN_API_KEY === 'undefined' ? '' : process.env.BSCSCAN_API_KEY

const config: HardhatUserConfig = {
	solidity: {
		version: '0.8.9',
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	networks: {
		ethereum: {
			url: `https://virulent-cosmopolitan-flower.quiknode.pro/4dfd5ab94e48af9df6db949d61c55472f4f90212/`,
			chainId: 1,
			accounts: [private_key],
		},
		goerli: {
			url: `https://ethereum-goerli-rpc.allthatnode.com`,
			chainId: 5,
			accounts: [private_key],
		},
		polygon: {
			url: `https://rpc-mainnet.maticvigil.com/`,
			chainId: 137,
			gasPrice: 100000000000,
			accounts: [private_key]
		},
		bsc: {
			url: 'https://bsc-dataseed.binance.org/',
			chainId: 56,
			accounts: [private_key]
		},
	},
	etherscan: {
		apiKey: {
			mainnet: etherscanApiKey,
			goerli: etherscanApiKey,
			polygon: polygonscanApiKey,
			bsc: bscscanApiKey
		},
	},
}

export default config
