import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";

export class MetamaskService{

    getProvider = async () => {
        return await detectEthereumProvider();
    }

    hasProvider = () => {
        return window.ethereum !== undefined;
    }

    enable = async () => {
        return await window.ethereum.enable();
    }

    connectWallet = async () => {
        const provider = await this.getProvider();
        const accounts = await provider.request({method: 'eth_requestAccounts'});
        return accounts[0];
    }

    deploy = async (data, args, sender) => {

        const provider = await this.getProvider();
        const web3 = new Web3(provider);
        const contract = new web3.eth.Contract(data.abi);
        const deployerContract = await contract.deploy({
            data: data.bytecode,
            arguments: args
        }).send({
            from: sender,
            gas: '5000000',
        })

        return deployerContract.options.address;

    }

    approve = async (token, spender, amount, sender) => {

        const provider = await this.getProvider();
        const web3 = new Web3(provider);
        const contract = new web3.eth.Contract(token.abi, token.address);
        const approve = await contract.methods.approve(spender, amount).send({
            from: sender,
            gas: '5000000',
        })
        return approve;
    }
}