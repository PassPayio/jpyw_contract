import { ethers } from 'hardhat'
import { Jpyw } from '../typechain'

async function main() {

	console.log('start')

	const jpywFactory = await ethers.getContractFactory('Jpyw')

	const proxy = jpywFactory.attach('0xe7891281ad2e94950de410b792bcced440ebfc71') as Jpyw
    console.log(proxy.address);

    const ownerOld = "0xc9df18cC66Cccfc5766b7C09967188c86D23923a"
    const currentOwner = "0xf65DEcABa7dE153953ca559a19156247f37EfC6c"
    const isContain = await proxy.isBlockList('0x71253083528e6fbd02373155783fa4ffa90326ba')
    //const hasBLockRole = await proxy.hasRole("0xd2e1400d804ab95ac5f5a495b4100533b1166f9747d2bbd9b82e590ab6bfeb4a", "0xc9df18cC66Cccfc5766b7C09967188c86D23923a")

	console.log('isContain:', isContain)
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})