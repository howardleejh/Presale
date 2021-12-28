// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')
const { ethers } = require('hardhat')
const json = require('../GeneratedAccounts.json')

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const LotteryContract = await hre.ethers.getContractFactory('Lottery')
  //@dev enter contract address
  const Lottery = await LotteryContract.attach(
    '0xe12bECDeb2451c1F4667f7839b717A907A9023c6'
  )
  const addresses = []
  let addressBatches = []
  let batch = 250

  //@dev getting all 5000 wallets into a local variable
  json.forEach((item) => addresses.push(item.wallet))
  //@dev using array.slice() to create batches from initial array
  for (let i = 0, j = addresses.length; i < j; i += batch) {
    let tempArr = addresses.slice(i, i + batch)
    addressBatches.push(tempArr)
  }
  //@dev getting signer functions
  const [deployer] = await ethers.getSigners()

  let nonce = await deployer.getTransactionCount()

  //@dev sending multiple transactions with manual nonce assignment
  addressBatches.forEach(async (item, index) => {
    try {
      let tx = await Lottery.initParticipants(item, {
        gasLimit: 8000000,
        nonce: nonce + index,
      })
      console.log(tx)
    } catch (err) {
      return console.error(err)
    }
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
