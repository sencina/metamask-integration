import {useEffect, useState} from "react";
import Web3 from "web3";
import {MetamaskService} from "../../metamask/metamask.service";
import {musitoken} from "../../constants/contants";
import web3 from "web3";

const Button = () => {

    const [defaultAccount, setDefaultAccount] = useState("")
    const [userBalance, setUserBalance] = useState(0)
    const service = new MetamaskService();

        // Request user's permission to access their accounts
        const enableMetaMask = async () => {
            try {
                await service.enable();
                // MetaMask is connected and accounts are accessible
            } catch (error) {
                // Failed to connect to MetaMask or access accounts
                console.error(error);
            }
        }


        const contractAddress = "0x1D8dABc03ffBba08b1ca1122387A294924017fF2"
        const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]

        // const contract = new web3.eth.Contract(contractABI, contractAddress)

        const approveMoney = async () => {

            service.approve({abi: contractABI, address: contractAddress}, contractAddress, 1000, defaultAccount)

        }

        const deployContract = async () => {
            try {
                const data = await service.deploy(musitoken, ["Test", "TT", 2, 300], defaultAccount)
                console.log(data)
            } catch (e) {
                console.log(e)
            }
            ;
        }

        const connectWalletHandler = async () => {
            try {
                const wallet = await service.connectWallet()
                setDefaultAccount(wallet)
            }catch (e){
                console.log(e)
            }
        }

        return (
            <>
                <button onClick={connectWalletHandler}>Connect</button>
                <button onClick={approveMoney}>Approve</button>
                <button onClick={deployContract}>Deploy!</button>
                <p>{service.hasProvider().toString()}</p>
                <p>{defaultAccount}</p>
            </>
        );

}


export default Button;