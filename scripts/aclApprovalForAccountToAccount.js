const hre = require("hardhat")
const { Framework } = require("@superfluid-finance/sdk-core")
const { ethers } = require("hardhat")

require("dotenv").config()
const PaymentABI =
    require("../artifacts/contracts/Payment.sol/Payment.json").abi

async function main() {
  
    const sender =""
    const receiver = ""
    const provider = new hre.ethers.providers.JsonRpcProvider(
        process.env.MUMBAI_API_URL
    )

    const sf = await Framework.create({
        chainId: (await provider.getNetwork()).chainId,
        provider
    })

    const signers = await hre.ethers.getSigners()
    //console.log(signers[0].address);

    const payment = new ethers.Contract(
        paymentContractAddress,
        PaymentABI,
        provider
    )

    const tokenx = await sf.loadSuperToken("MATICx")

    
    const aclApproval = tokenx.createFlowByOperator({
        sender: sender,
        receiver: receiver,
        flowRate: "385802469135", 
        ctx: "" 
    })
    await aclApproval.exec(signers[0]).then(function (tx) {
        console.log(`
        Congrats! You've just successfully made the money router contract a flow operator. 
        Tx Hash: ${tx.hash}
    `)
    })
}


main().catch(error => {
    console.error(error)
    process.exitCode = 1
})
