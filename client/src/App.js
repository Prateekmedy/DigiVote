import React, { Component } from "react";
import ElectionContract from "./contracts/Election.json";
import Web3 from 'web3';
import ipfs from './ipfs';
import {ipfsSender, ipfsFetcher} from './ipfsStore';
import "./App.css";

const Buffer = require('buffer/').Buffer;

class App extends Component {

  //declaring the state of the application
  state = { 
            web3: null, 
            accounts: null, 
            contract: null, 
            buffer:'', 
            abi:null, 
            ipfsHash: null,
            ipfsData: null,
            accAddress:null 
          };

  //function for creating the new account and recharging it with ether.
  accountCreator = async(password) => {
    
    const {web3, accounts} = this.state;
    
    let accAddress;
    // create new ethereum account with password 
    await web3.eth.personal.newAccount(password)
    .then( (res) => {accAddress = res});

    //store the account address in the state
    this.setState({accAddress});

    // trasaction for recharging the new account
    await web3.eth.sendTransaction({
      from : accounts[0],
      to : accAddress,
      value: web3.utils.toWei("0.5", "ether")
    }).then(console.log);

    // console the current balance of new account
    web3.eth.getBalance(accAddress)
    .then((res)=> console.log(web3.utils.fromWei(res, 'ether')));

  }

  componentDidMount = async () => {
    try {

      // Get network provider and web3 instance.
      const web3 = await new Web3(new Web3.providers.HttpProvider(
        "HTTP://127.0.0.1:7545"
      ));

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      //promise for knowing the account balance
      web3.eth.getBalance(accounts[0])
      .then((res)=> console.log(web3.utils.fromWei(res, 'ether')));

      // Get the contract instance for Election.
      const networkIdE = await web3.eth.net.getId();
      const deployedNetworkE = ElectionContract.networks[networkIdE];

      //console the ABI for reviewing
      console.log(ElectionContract.abi);
      this.setState({abi:ElectionContract.abi});
      
      //define the contract instance
      const instance = new web3.eth.Contract(
        ElectionContract.abi,
        deployedNetworkE && deployedNetworkE.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed
      this.setState({ web3, accounts, contract : instance});

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  //function for Organizer's SignUp
  SignUp = async(event) => {

    event.preventDefault();

    const {contract, accounts} = this.state;
    // //calling function by providing the password and returns the Account Address
    // await this.accountCreator("test");

    console.log(this.state.accAddress);

    let CredentialsData = {
      Username : "Prateek",
      Password : "test",
      Address : accounts[0] //this.state.accAddress
    }  

    //calling the promise by providing the data to convert it to hash
    let ipfsHash = await ipfsSender(CredentialsData);
    this.setState({ipfsHash});
    console.log(this.state.ipfsHash);

    //function for sending hash to the blockchain
    await contract.methods.setOrganizerCredentials(accounts[0], this.state.ipfsHash).send({from: '0xB18DFE177bd96c229D5e0E6D06446Ff0eF825B13',gas:6721975})
    .then((receipt) => {
      console.log(receipt);
    })
    .catch((error) => {
      console.log(error);
    });

    let result;
    await contract.methods.getOrganizerCredentials(accounts[0]).call()
    .then((res) => result = res)
    .catch(console.error)

    // await contract.methods.getOrganizerCredentials(accounts[0]).call()
    // .then(console.log)
    // .catch(console.error)

    // //calling the promise by providing the hash to convert it to data
    let ipfsData = await ipfsFetcher(result);
    this.setState({ipfsData})
    console.log(this.state.ipfsData);

    

  }



  //render function for JSX returns
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
        <form onSubmit={this.SignUp}>
          <input type="text" name="label1" className="l1" />
          <input type="submit" value="SignUp"/>
        </form>
        <div>
          <button onClick={this.seek}>Seek</button>
          <button onClick={this.Organizer}>Organizer</button>
          <button onClick={this.countOrganizer}>Count Organizer</button>
          <button onClick={this.createAcc}>Create Account</button>
        </div>
      </div>
    );
  }
}

export default App;
