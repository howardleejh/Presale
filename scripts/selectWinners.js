// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const LotteryContract = await hre.ethers.getContractFactory('Lottery')
  const Lottery = await LotteryContract.attach(
    '0x13d8db10b89416940af0B2fee43874712c2bEA81'
  )
  let txRes = null

  try {
    txRes = await Lottery.selectWinners()

    await txRes.wait()
  } catch (err) {
    console.log(err)
    return
  }
  console.log(txRes)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
