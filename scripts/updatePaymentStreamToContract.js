const hre = require("hardhat")
const { Framework } = require("@superfluid-finance/sdk-core")
const { ethers } = require("hardhat")
require("dotenv").config()
const PaymentABI =
    require("../artifacts/contracts/Payment.sol/Payment.json").abi


async function main() {

    const paymentContractAddress = "0xaef8778c547D14FC5867A29D6cC173DF689Da942"

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


    await payment
        .connect(signers[0])
        .updatePaymentStreamInToContract(tokenx.address, "285802469135")
        .then(function (tx) {
            console.log(`
        Congrats! You just successfully updated a flow into the  contract. 
        Tx Hash: ${tx.hash}
    `)
        })
}


main().catch(error => {
    console.error(error)
    process.exitCode = 1
})
