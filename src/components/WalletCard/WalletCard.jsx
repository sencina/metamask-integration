import React, {useState} from "react";
import './WalletCard.css'
import {ethers} from "ethers";
import Web3 from "web3";
import BigNumber from "bignumber.js";

const MATIC_WEI_MULTIPLIER = 1000000000000000000
// Constants
const USDT_ADDRESS = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f';
const USDT_ABI = [{"inputs":[{"internalType":"address","name":"_proxyTo","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_new","type":"address"},{"indexed":false,"internalType":"address","name":"_old","type":"address"}],"name":"ProxyOwnerUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_new","type":"address"},{"indexed":true,"internalType":"address","name":"_old","type":"address"}],"name":"ProxyUpdated","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxyOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxyType","outputs":[{"internalType":"uint256","name":"proxyTypeId","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferProxyOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newProxyTo","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"updateAndCall","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_newProxyTo","type":"address"}],"name":"updateImplementation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];// Initialize web3 provider
// Initialize web3 provider
let web3;
const API_MATICUSDT = 'https://api.binance.com/api/v3/ticker/price?symbol=MATICUSDT'

const WalletCard = () => {

    const [defaultAccount, setDefaultAccount] = useState(null)
    const [userBalance, setUserBalance] = useState(0)
    const [errorMessage, setErrorMessage] = useState('')
    const [okMessage, setOkMessage] = useState('')
    const [transactionData, setTransactionData] = useState({
        to: '0x71d9c123eA17e1942Ac5036Cf7D5a488EDc747CD',
        amount: 0
    })

    const PRIVATE_KEY = 'b66705d3b964e9cbe8ed3437bbad5ebf440f803a1aea14c42dbf51aec7cbe651'

    const connectWalletHandler = async () => {
        if (window.ethereum) {
            window.ethereum.request({method: 'eth_requestAccounts'})
                .then(result => {
                    accountChangeHandler(result[0])
                })
        } else {
            setErrorMessage('No wallet detected')
        }
    }

    const accountChangeHandler = async (account) => {
        setDefaultAccount(account)
        await getUserBalance(account.toString())
    }

    const getUserBalance = async (adress) => {
        window.ethereum.request({method: 'eth_getBalance', params: [adress, 'latest']})
            .then(balance => {
                setUserBalance(ethers.formatEther(balance))
            })
    };

    const chainChangeHandler = async (chainId) => {
        // Polygon MainNet ChainId: 0x89
        // if (chainId !== '0x89'){
        //     alert('Connect to Polygon Network')
        // }

        // Polygon Mumbai TestNet ChainId: 0x13881
        // if (chainId !== '0x13881') {
        //     alert('Connect to Polygon Mumbai Test Network')
        // }
    }

    const handleTransactionDataChange = (prop) => (event) => {
        setTransactionData({...transactionData, [prop]: Number(event.target.value)})
    }

    const sendTransaction = async () => {
        const transaction = {
            from: defaultAccount,
            to: transactionData.to,
            value: '0x' + (transactionData.amount * MATIC_WEI_MULTIPLIER).toString(16)
        }
        window.ethereum.request({method: 'eth_sendTransaction', params: [transaction]})
            .then(txHash => {
                validateTransaction(txHash).then(result => alert(result))
            })
            .catch(error => {
                console.log(error)
            })
    }

    const validateTransaction = async (txHash) => {

        let checkTransactionLoop = () => {

            return window.ethereum.request({method: 'eth_getTransactionReceipt', params: [txHash]}).then(receipt => {
                if (receipt != null) {
                    return 'confirmed'
                } else {
                    return checkTransactionLoop()
                }
            })
        }

        return checkTransactionLoop()

    }

    window.ethereum.on(
        'accountsChanged',
        accountChangeHandler
    )

    window.ethereum.on('chainChanged', chainChangeHandler)

    const sendUSDT = async () => {

        try {
            // Get the connected account
            const accounts = await web3.eth.getAccounts();
            const sender = accounts[0];

            // Get the USDT contract instance
            const usdtContract = new web3.eth.Contract(USDT_ABI, USDT_ADDRESS);

            // Convert 10 USDT to the smallest unit (wei)
            const amountToSend = web3.utils.toWei(transactionData.amount.toString(), 'ether');

            // Set the recipient address
            const recipient = transactionData.to; // Replace with your recipient address

            // Create the transaction object
            const txObject = {
                from: sender,
                to: USDT_ADDRESS,
                value: amountToSend,
            };

            // Send the transaction
            const tx = await web3.eth.sendTransaction(txObject);

            console.log(tx);
        } catch (error) {
            console.log(error);
        }


    }

    return (
        <div className='walletCard'>
            <h4> {"Connection to MetaMask using window.ethereum methods"} </h4>
            <button onClick={connectWalletHandler} disabled={defaultAccount !== null}>{defaultAccount === null ? "Connect Wallet" : "Wallet Connected!"}</button>
            <div className='accountDisplay'>
                <h3>Address: {defaultAccount}</h3>
            </div>
            <div className='balanceDisplay'>
                <h3>Balance: {userBalance}</h3>
            </div>
            <h4>Send funds</h4>
            <input type={"number"} onChange={handleTransactionDataChange('amount')}></input>
            <button onClick={sendTransaction}>Send</button>
            <p style={{color:"red"}}>{errorMessage}</p>
            <p style={{color:"green"}}>{okMessage}</p>
        </div>
    )
}

export default WalletCard