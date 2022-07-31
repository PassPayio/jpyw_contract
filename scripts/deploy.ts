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

// Memo
// ropsten
// npx hardhat run --network ropsten scripts/deploy.ts
// npx hardhat verify --network ropsten --contract contracts/Admin.sol:Admin 0x059022BeB605C4820908B35a11799D28Cf61dF97
// npx hardhat verify --network ropsten --contract contracts/Jpyw.sol:Jpyw 0xCB31b7A6606c44D9835eAbba1315d26b1dE57676
// npx hardhat verify --network ropsten --contract contracts/UpgradeableProxy.sol:UpgradeableProxy --constructor-args arguments.js 0x1747E80B8BdF5F904eB0b7DEcEA44F7f45E39Ab9
// admin: 0x059022BeB605C4820908B35a11799D28Cf61dF97
// jpyw: 0xCB31b7A6606c44D9835eAbba1315d26b1dE57676
// upgradeableProxy: 0x1747E80B8BdF5F904eB0b7DEcEA44F7f45E39Ab9
// arguments.js
// module.exports = [
//     "0xCB31b7A6606c44D9835eAbba1315d26b1dE57676",
//     "0x059022BeB605C4820908B35a11799D28Cf61dF97",
//     "0x",
//   ];

// mainnet
// npx hardhat run --network ethereum scripts/deploy.ts
// npx hardhat verify --network ethereum --contract contracts/Admin.sol:Admin 0x70beba351a8FC3e8F7610B77bA82c8e570211D4f
// npx hardhat verify --network ethereum --contract contracts/Jpyw.sol:Jpyw 0x4514a32D4a6F7E9c693ed582Df932B3825663985
// npx hardhat verify --network ethereum --contract contracts/UpgradeableProxy.sol:UpgradeableProxy --constructor-args arguments.js 0x1995bCf16296aBAC90b0a9653e79DfB7082c4f90
// admin: 0x70beba351a8FC3e8F7610B77bA82c8e570211D4f
// jpyw: 0x4514a32D4a6F7E9c693ed582Df932B3825663985
// upgradeableProxy: 0x1995bCf16296aBAC90b0a9653e79DfB7082c4f90
// arguments.js
// module.exports = [
//     "0x4514a32D4a6F7E9c693ed582Df932B3825663985",
//     "0x70beba351a8FC3e8F7610B77bA82c8e570211D4f",
//     "0x",
//   ];
