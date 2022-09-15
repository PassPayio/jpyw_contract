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
// goerli
// npx hardhat run --network goerli scripts/deploy.ts
// npx hardhat verify --network goerli --contract contracts/Admin.sol:Admin 0x4514a32D4a6F7E9c693ed582Df932B3825663985
// npx hardhat verify --network goerli --contract contracts/Jpyw.sol:Jpyw 0x1995bCf16296aBAC90b0a9653e79DfB7082c4f90
// npx hardhat verify --network goerli --contract contracts/UpgradeableProxy.sol:UpgradeableProxy --constructor-args arguments.js 0xE7C213183bAc92Bc0248061332C7C487c93daDEf
// admin: 0x4514a32D4a6F7E9c693ed582Df932B3825663985
// jpyw: 0x1995bCf16296aBAC90b0a9653e79DfB7082c4f90
// upgradeableProxy: 0xE7C213183bAc92Bc0248061332C7C487c93daDEf
// arguments.js
// module.exports = [
//     "0x1995bCf16296aBAC90b0a9653e79DfB7082c4f90",
//     "0x4514a32D4a6F7E9c693ed582Df932B3825663985",
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
