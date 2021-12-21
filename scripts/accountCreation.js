// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
require('dotenv')
const hre = require('hardhat')
const fs = require('fs')

async function main() {
  const generatedAccounts = []

  const account = hre.ethers.Wallet.createRandom()

  for (let i = 0; i < 100; i++) {
    const wallet = hre.ethers.Wallet.fromMnemonic(
      account._mnemonic().phrase,
      `m/44'/60'/0'/0/${i}`
    )
    generatedAccounts.push({
      wallet: wallet.address,
      p_key: wallet._signingKey().privateKey,
    })
  }
  let jsonData = JSON.stringify(generatedAccounts)
  fs.writeFile('GeneratedAccounts.json', jsonData, function (err) {
    if (err) throw err
    console.log('File created!')
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
