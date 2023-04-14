const hre = require("hardhat")
const { Framework } = require("@superfluid-finance/sdk-core")
const { ethers } = require("hardhat")
require("dotenv").config()
const PaymentABI =
    require("../artifacts/contracts/Payment.sol/Payment.json").abi


async function main() {
   

   
    const paymentContractAddress = "0xaef8778c547D14FC5867A29D6cC173DF689Da942"
   
    const receiver = "0x73b7BA3e6A62f40b650aC892A835fDBFAACeE1Ba"

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
        .makePaymentStreamFomContract(tokenx.address,receiver,"38580246913",{gasLimit :6721975,gasPrice: 20000000000})
        .then(function (tx) {
            console.log(`
        Congrats! You just successfully created a flow from the  contract. 
        Tx Hash: ${tx.hash}
    `)
        })
}


main().catch(error => {
    console.error(error)
    process.exitCode = 1
})