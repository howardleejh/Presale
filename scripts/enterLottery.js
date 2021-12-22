// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')
const { ethers } = require('hardhat')
const fs = require('fs')
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
  const Lottery = await LotteryContract.attach(
    '0xDBefF38cC6a6f873AC4d262383F711C5a6f79A55'
  )
  let dataArr = []

  json.forEach((item) => dataArr.push(item.wallet))

  try {
    let txRes = await Lottery.initParticipants(dataArr, {
      gasPrice: 3000000000,
      gasLimit: ethers.utils.parseEther('3'),
    })

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
