const hre = require("hardhat")
const { Framework } = require("@superfluid-finance/sdk-core")
const { ethers } = require("hardhat")
require("dotenv").config()
const PaymentABI =
    require("../artifacts/contracts/Payment.sol/Payment.json").abi

async function main() {
  
    const paymentContractAddress = "0xc11A9E0545B9Ab6659506648C2CBc3F47114c2C1"

    const provider = new hre.ethers.providers.JsonRpcProvider(
        process.env.MUMBAI_API_URL
    )

    const sf = await Framework.create({
        chainId: (await provider.getNetwork()).chainId,
        provider
    })

    const signers = await hre.ethers.getSigners()

    const payment = new ethers.Contract(
        paymentContractAddress,
        PaymentABI,
        provider
    )

    const tokenx = await sf.loadSuperToken("MATICx")
   // console.log("super token Address",daix.address);

    await payment
        .connect(signers[0])
        .deletePaymentStreamInToContract(tokenx.address)
        .then(function (tx) {
            console.log(`
        Congrats! You just successfully delete a flow that was being sent into the contract. 
        Tx Hash: ${tx.hash}
    `)
        })
}


main().catch(error => {
    console.error(error)
    process.exitCode = 1
})
