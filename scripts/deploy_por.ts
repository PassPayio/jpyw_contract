import { ethers } from 'hardhat'
// Import { ProofOfReserve } from '../typechain'

async function main() {
	console.log('start')

	const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

	const porFactory = await ethers.getContractFactory('JpywReserveConsumerV3')
	const feeData = await ethers.provider.getFeeData();
	console.log("Fee data is ", feeData)

	const por = await porFactory.deploy("0xF6f5b570aB6E39E55558AfD8E1E30c5f20E6527E")
	await por.deployed()
	console.log('Proof Of Reserve: ', por.address)
	console.log('finish')
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
