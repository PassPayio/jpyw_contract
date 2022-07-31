import { expect, use } from 'chai'
import { solidity } from 'ethereum-waffle'
import { Signer } from 'ethers'
import { deploy, deployProxy } from './utils'
import { Admin, Jpyw } from '../typechain'
import { ethers } from 'hardhat'

use(solidity)

describe('Jpyw', () => {
	let deployer: Signer
	let user: Signer
	let user2: Signer
	let jpyw: Jpyw
	let jpywUser: Jpyw
	let jpywUser2: Jpyw

	beforeEach(async () => {
		;[deployer, user, user2] = await ethers.getSigners()
		const admin = await deploy<Admin>('Admin')
		const jpywInstance = await deploy<Jpyw>('Jpyw')
		const proxy = await deployProxy(
			jpywInstance.address,
			admin.address,
			ethers.utils.arrayify('0x')
		)
		jpyw = jpywInstance.attach(proxy.address)
		jpywUser = jpyw.connect(user)
		jpywUser2 = jpyw.connect(user2)
		await jpyw.initialize()
	})

	describe('name', () => {
		it('name is JPY World', async () => {
			const tmp = await jpyw.name()
			expect(tmp).to.equal('JPY World')
		})
	})

	describe('symbol', () => {
		it('name is JPYW', async () => {
			const tmp = await jpyw.symbol()
			expect(tmp).to.equal('JPYW')
		})
	})

	describe('decimals', () => {
		it('value is 2', async () => {
			const tmp = await jpyw.decimals()
			expect(tmp.toString()).to.equal('2')
		})
	})

	describe('default role', () => {
		describe('deployer', () => {
			it('has admin role', async () => {
				const adminRole = await jpyw.DEFAULT_ADMIN_ROLE()
				const result = await jpyw.hasRole(
					adminRole,
					await deployer.getAddress()
				)
				expect(result).to.equal(true)
			})
			it('has burner role', async () => {
				const burnRole = await jpyw.BURNER_ROLE()
				const result = await jpyw.hasRole(burnRole, await deployer.getAddress())
				expect(result).to.equal(true)
			})
			it('has minter role', async () => {
				const minterRole = await jpyw.MINTER_ROLE()
				const result = await jpyw.hasRole(
					minterRole,
					await deployer.getAddress()
				)
				expect(result).to.equal(true)
			})
			it('has admin role', async () => {
				const blockListRole = await jpyw.BLOCK_LIST_ROLE()
				const result = await jpyw.hasRole(
					blockListRole,
					await deployer.getAddress()
				)
				expect(result).to.equal(true)
			})
		})
		describe('user', () => {
			it('no has admin role', async () => {
				const adminRole = await jpyw.DEFAULT_ADMIN_ROLE()
				const result = await jpyw.hasRole(adminRole, await user.getAddress())
				expect(result).to.equal(false)
			})
			it('no has burner role', async () => {
				const burnRole = await jpyw.BURNER_ROLE()
				const result = await jpyw.hasRole(burnRole, await user.getAddress())
				expect(result).to.equal(false)
			})
			it('no has minter role', async () => {
				const minterRole = await jpyw.MINTER_ROLE()
				const result = await jpyw.hasRole(minterRole, await user.getAddress())
				expect(result).to.equal(false)
			})
			it('no has admin role', async () => {
				const blockListRole = await jpyw.BLOCK_LIST_ROLE()
				const result = await jpyw.hasRole(
					blockListRole,
					await user.getAddress()
				)
				expect(result).to.equal(false)
			})
		})
	})

	describe('mint', () => {
		describe('success', () => {
			it('mint', async () => {
				const userAddress = await user.getAddress()
				const before = await jpyw.balanceOf(userAddress)
				expect(before.toString()).to.equal('0')
				await jpyw.mint(userAddress, 10000)
				const after = await jpyw.balanceOf(userAddress)
				expect(after.toString()).to.equal('10000')
			})
		})
		describe('fail', () => {
			it('no have role', async () => {
				const userAddress = await user.getAddress()
				await expect(jpywUser.mint(userAddress, 10000)).to.be.revertedWith(
					'illegal access(mint)'
				)
			})
		})
	})

	describe('burn', () => {
		describe('success', () => {
			it('burn', async () => {
				const userAddress = await user.getAddress()
				await jpyw.mint(userAddress, 10000)
				const before = await jpyw.balanceOf(userAddress)
				expect(before.toString()).to.equal('10000')
				await jpyw.burn(userAddress, 10000)
				const after = await jpyw.balanceOf(userAddress)
				expect(after.toString()).to.equal('0')
			})
		})
		describe('fail', () => {
			it('no have role', async () => {
				const userAddress = await user.getAddress()
				await expect(jpywUser.burn(userAddress, 10000)).to.be.revertedWith(
					'illegal access(burn)'
				)
			})
		})
	})

	describe('addToBlockList', () => {
		describe('success', () => {
			it('add block list', async () => {
				const userAddress = await user.getAddress()
				const before = await jpyw.isBlockList(userAddress)
				expect(before).to.equal(false)
				await jpyw.addToBlockList(userAddress)
				const after = await jpyw.isBlockList(userAddress)
				expect(after).to.equal(true)
			})
			it('donot mint', async () => {
				const userAddress = await user.getAddress()
				await jpyw.mint(userAddress, 10000)
				await jpyw.addToBlockList(userAddress)
				await expect(jpyw.mint(userAddress, 10000)).to.be.revertedWith(
					'illegal access(block list)'
				)
			})
			it('donot burn', async () => {
				const userAddress = await user.getAddress()
				await jpyw.mint(userAddress, 10000)
				await jpyw.addToBlockList(userAddress)
				await expect(jpyw.burn(userAddress, 10000)).to.be.revertedWith(
					'illegal access(block list)'
				)
			})
			it('donot transfer', async () => {
				const deployerAddress = await deployer.getAddress()
				const userAddress = await user.getAddress()
				await jpyw.mint(deployerAddress, 10000)
				await jpyw.addToBlockList(userAddress)
				await expect(jpyw.transfer(userAddress, 10000)).to.be.revertedWith(
					'illegal access(block list)'
				)
			})
			it('donot transferFrom', async () => {
				const deployerAddress = await deployer.getAddress()
				const userAddress = await user.getAddress()
				const user2Address = await user2.getAddress()
				await jpyw.mint(deployerAddress, 10000)
				await jpyw.approve(user2Address, 10000)
				await jpyw.addToBlockList(userAddress)
				await expect(
					jpywUser2.transferFrom(deployerAddress, userAddress, 10000)
				).to.be.revertedWith('illegal access(block list)')
			})
		})
		describe('fail', () => {
			it('no have role', async () => {
				const userAddress = await user.getAddress()
				await expect(jpywUser.addToBlockList(userAddress)).to.be.revertedWith(
					'illegal access(block list)'
				)
			})
		})
	})

	describe('removeFromBlockList', () => {
		describe('success', () => {
			it('remove block list', async () => {
				const userAddress = await user.getAddress()
				await jpyw.addToBlockList(userAddress)
				const before = await jpyw.isBlockList(userAddress)
				expect(before).to.equal(true)
				await jpyw.removeFromBlockList(userAddress)
				const after = await jpyw.isBlockList(userAddress)
				expect(after).to.equal(false)
			})
		})
		describe('fail', () => {
			it('no have role', async () => {
				const userAddress = await user.getAddress()
				await expect(
					jpywUser.removeFromBlockList(userAddress)
				).to.be.revertedWith('illegal access(block list)')
			})
		})
	})
})
