const hre = require("hardhat")
const { Framework } = require("@superfluid-finance/sdk-core")
const { ethers } = require("hardhat")
require("dotenv").config()
const PaymentABI =
    require("../artifacts/contracts/Payment.sol/Payment.json").abi

async function main() {

    const contractAddress = "0xaef8778c547D14FC5867A29D6cC173DF689Da942"

    const provider = new hre.ethers.providers.JsonRpcProvider(
        process.env.MUMBAI_API_URL
    )

    const sf = await Framework.create({
        chainId: (await provider.getNetwork()).chainId,
        provider
    })

    const signers = await hre.ethers.getSigners()

    const payment = new ethers.Contract(
        contractAddress,
        PaymentABI,
        provider
    )

    const tokenx = await sf.loadSuperToken("MATICx")


    const tokenApproval = tokenx.approve({
        receiver: payment.address,
        amount: ethers.utils.parseEther("1")
    })

    await tokenApproval.exec(signers[0]).then(function (tx) {
        console.log(`
        Congrats! You've just successfully approved the  contract. 
        Tx Hash: ${tx.hash}
    `)
    })
}


main().catch(error => {
    console.error(error)
    process.exitCode = 1
})
