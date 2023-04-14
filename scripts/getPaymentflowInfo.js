const hre = require("hardhat")
const { Framework } = require("@superfluid-finance/sdk-core")
const { ethers } = require("hardhat")
require("dotenv").config()
const PaymentABI =
    require("../artifacts/contracts/Payment.sol/Payment.json").abi


async function main() {
   

   
    const paymentContractAddress = "0xc11A9E0545B9Ab6659506648C2CBc3F47114c2C1"

    
   
    const receiver = "0x73b7BA3e6A62f40b650aC892A835fDBFAACeE1Ba"

    const provider = new hre.ethers.providers.JsonRpcProvider(
        process.env.MUMBAI_API_URL
    )

    const sf = await Framework.create({
        chainId: (await provider.getNetwork()).chainId,
        provider
    })

    const signers = await hre.ethers.getSigners()
    const sender = signers[0].address
    console.log("Sender address:",sender);
    const payment = new ethers.Contract(
        paymentContractAddress,
        PaymentABI,
        provider
    )

    const tokenx = await sf.loadSuperToken("MATICx")

  
    let [timestamp,flowRate,deposit,owedDeposit]= await payment
        .connect(signers[0])
        .getPaymentflowInfo(tokenx.address,sender,paymentContractAddress)
        .then(function (tx) {
            console.log(`
        Congrats! You just successfully created a flow from the  contract. 
        Tx Hash: ${tx.hash}
    `)
        })

    console.log(`timestamp: ${timestamp} flowrate: ${flowRate} deposit: ${deposit} oweDeposit: ${owedDeposit}`)
 
}


main().catch(error => {
    console.error(error)
    process.exitCode = 1
})