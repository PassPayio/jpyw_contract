import { ethers } from 'hardhat'
import { Jpyw } from '../typechain'

async function main() {

	console.log('start')

	const jpywFactory = await ethers.getContractFactory('Jpyw')

	const proxy = jpywFactory.attach('0xE7C213183bAc92Bc0248061332C7C487c93daDEf') as Jpyw
	const mint = await proxy.mint('0x9f219E8389587a4934Fb271e46fa5dCF55de4a41',1000000000000)

	console.log('finish tx:', mint.hash)
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
