# how to set up

```bash
yarn
npx hardhat compile
```

# how to deploy

```bash
npx hardhat run --network <Network Name> scripts/<deploy scripts>.ts
```

# how to verify
```bash
npx hardhat verify --network  <Network Name> --contract contracts/Admin.sol:Admin <Admin Contract Address>
npx hardhat verify --network <Network Name>  --contract contracts/Jpyw.sol:Jpyw <Jpyw Implemention Contract Address>
npx hardhat verify --network <Network Name> --contract contracts/UpgradeableProxy.sol:UpgradeableProxy --constructor-args arguments.js <UpgradeableProxy Contract Address>

arguments.js
  module.exports = [
     Implemention Contract Address,
     Admin Contract Address,
     "0x",
   ];
```


# how to test

```bash
yarn build
yarn test
```

# how to lint

```bash
yarn lint
```
