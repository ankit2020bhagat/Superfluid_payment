// SPDX-License_Identifier: UNLICENSED;
pragma solidity ^0.8.14;

import {ISuperfluid, ISuperToken, ISuperApp} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract Payment is Ownable {
    using SuperTokenV1Library for ISuperToken;

    event FlowIntoContract(address sender,address receiver,int96 flowrate);
    event fundsWithDraw(address receiver,uint amount);
    event FlowfromContract(address receiver,int96 flowrate);

    function makePaymentWithoutStream(ISuperToken token, uint256 amount) external {
        token.transferFrom(msg.sender, address(this), amount);
       
    }

    function makePaymentStreamInToContract(
        ISuperToken token,
        int96 flowRate
    ) external {
        token.createFlowFrom(msg.sender, address(this), flowRate);
         emit FlowIntoContract(msg.sender, address(this), flowRate);
    }

    function updatePaymentStreamInToContract(
        ISuperToken token,
        int96 flowRate
    ) external {
        token.updateFlowFrom(msg.sender, address(this), flowRate);
        emit FlowIntoContract(msg.sender, address(this), flowRate);
    }

    function stopPaymentStreamInToContract(ISuperToken token) external {
        token.deleteFlow(msg.sender, address(this));
    }

    function withdrawFunds(
        ISuperToken token,
        uint256 amount
    ) external onlyOwner {
        token.transfer(msg.sender, amount);
        emit fundsWithDraw(msg.sender,amount);

    }

    function makePaymentStreamFomContract(
        ISuperToken token,
        address receiver,
        int96 flowRate
    ) external onlyOwner {
        token.createFlow(receiver, flowRate);
        emit FlowfromContract(receiver,flowRate);

    }

    function updatePaymentStreamFromContract(
        ISuperToken token,
        address receiver,
        int96 flowRate
    ) external onlyOwner {
        token.updateFlow(receiver, flowRate);
        emit FlowfromContract(receiver,flowRate);
    }

    function stopPaymentStreamFromContract(
        ISuperToken token,
        address receiver
    ) external onlyOwner {
        token.deleteFlow(address(this), receiver);
    }

    function getPaymentflowInfo(
        ISuperToken token,
        address sender,
        address receiver
    )
        external
        view
        returns (
            uint256 timestamp, 
            int96 flowRate,
            uint256 deposit,
            uint256 owedDeposit
        )
        
    {
        token.getFlowInfo(sender,receiver);
        (timestamp,flowRate,deposit,owedDeposit)=token.getFlowInfo(sender, receiver);
    }

    
}
