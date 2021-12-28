// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')
const { ethers } = require('hardhat')

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
  const [deployer] = await ethers.getSigners()

  let nonce = await deployer.getTransactionCount()

  for (let i = 0; i < 20; i++) {
    try {
      let tx = await Lottery.selectWinners(50, {
        gasLimit: 8000000,
        nonce: nonce + i,
      })
      console.log(tx)
    } catch (err) {
      return console.log(err)
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
