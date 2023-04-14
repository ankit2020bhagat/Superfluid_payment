const hre = require("hardhat")
require("dotenv").config()

async function main() {

  const paymentFactory = await hre.ethers.getContractFactory("Payment")

  const paymentContract = await paymentFactory.deploy()

  await paymentContract.deployed()

  console.log("Payment deployed to:", paymentContract.address)
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
//