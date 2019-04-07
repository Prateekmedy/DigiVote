import React, { Component } from "react"
import ElectionContract from "./contracts/Election.json"
import Web3 from 'web3'
//import CandidateHome from './Candidate/CandidateHome'
//import OragnizerHome from './Organizer/OrganizerHome'
import Home from './HomePage'
//import {accountCreator} from './utils/AccountCreater'
//import {ipfsFetcher} from './ipfsStore'
import "./App.css"



//const Buffer = require('buffer/').Buffer;

class App extends Component {

  //declaring the state of the application
  state = { 
            web3: null, 
            accounts: null, 
            contract: null, 
            buffer:'', 
            abi:null, 
            ipfsCredentialsHash: null,
            ipfsCredentailsData: null,
            ipfsPersonalHash: null,
            ipfsPersonalData: null,
            accAddress:null,
            isLogin :false ,
            inputValue:""
          };



  //function for updating account
  updateAccount = (acc) => {
    this.setState({
      accAddress : acc
    })
  }

  //function for creating the new account and recharging it with ether.
  accountCreator = async(password) => {
    
    const {web3, accounts} = this.state;
    
    let accAddress;
    // create new ethereum account with password 
    await web3.eth.personal.newAccount(password)
    .then( (res) => {accAddress = res});

    //store the account address in the state
    this.setState({accAddress});

    //console.log(accAddress)

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

  loginUpdate = (val) => {
    this.setState({
      isLogin : val
    })
  }


  //render function for JSX returns
  render() {
    console.log("App")
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
          <Home 
            contract={this.state.contract} 
            accounts={this.state.accounts} 
            web3={this.state.web3} 
            accountCreator={this.accountCreator} 
            acc={this.state.accAddress}
            isLogin = {this.state.isLogin}
            loginUpdate = {this.loginUpdate}
          />
      </div>
    );
  }
}

export default App;
