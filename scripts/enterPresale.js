// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')
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
  const PreSaleContract = await hre.ethers.getContractFactory('PreSale')
  const PreSale = await PreSaleContract.attach(
    '0x511C79b55b165E6dc3C1eCAE67d9FFA981A64852'
  )

  let wallet = new hre.ethers.Wallet(json[0].p_key)

  let walletBalance = await PreSale.connect(wallet).getBalance()
  await walletBalance.wait()
  // try {
  //   let txRes = await PreSale.connect(json[0].wallet).enterPresale()

  //   await txRes.wait()
  // } catch (err) {
  //   console.log(err)
  //   return
  // }

  // console.log(`${txRes} is successful!`)
  console.log(walletBalance)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
