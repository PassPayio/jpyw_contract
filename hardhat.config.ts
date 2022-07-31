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

const mnemnoc =
	typeof process.env.MNEMONIC === 'undefined' ? '' : process.env.MNEMONIC

const infuraKey =
	typeof process.env.INFURA_KEY === 'undefined' ? '' : process.env.INFURA_KEY

const etherscanApiKey =
	typeof process.env.ETHERSCAN_API_KEY === 'undefined'
		? ''
		: process.env.ETHERSCAN_API_KEY

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
			url: `https://mainnet.infura.io/v3/${infuraKey}`,
			accounts: {
				mnemonic: mnemnoc,
			},
		},
		ropsten: {
			url: `https://ropsten.infura.io/v3/${infuraKey}`,
			accounts: {
				mnemonic: mnemnoc,
			},
		},
	},
	etherscan: {
		apiKey: {
			mainnet: etherscanApiKey,
			ropsten: etherscanApiKey,
		},
	},
}

export default config
