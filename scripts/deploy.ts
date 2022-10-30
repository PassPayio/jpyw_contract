import { ethers } from 'hardhat'
import { Jpyw } from '../typechain'

async function main() {
	console.log('start')
	// Admin
	const adminFactory = await ethers.getContractFactory('Admin')
	const admin = await adminFactory.deploy()
	await admin.deployed()
	console.log('admin:', admin.address)

	// Jpyw
	const jpywFactory = await ethers.getContractFactory('Jpyw')
	const jpyw = await jpywFactory.deploy()
	await jpyw.deployed()
	console.log('jpyw:', jpyw.address)

	const data = ethers.utils.arrayify('0x')

	// UpgradeableProxy
	const upgradeableProxyFactory = await ethers.getContractFactory(
		'UpgradeableProxy'
	)
	const upgradeableProxy = await upgradeableProxyFactory.deploy(
		jpyw.address,
		admin.address,
		data
	)
	await upgradeableProxy.deployed()
	console.log('upgradeableProxy:', upgradeableProxy.address)

	const proxy = jpywFactory.attach(upgradeableProxy.address) as Jpyw
	await proxy.initialize()
	console.log('finish')
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
