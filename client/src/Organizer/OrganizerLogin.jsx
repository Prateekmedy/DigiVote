import React, { Component } from 'react'
import {ipfsFetcher, ipfsSender} from '../ipfsStore'

class OrganizerLogin extends Component{   

    constructor(props){
        super(props)
        this.state = {
            inputValue:"",
            ipfsCredentialsHash: null,
            ipfsCredentailsData: null,
            ipfsPersonalHash: null,
            ipfsPersonalData: null,
            isUnlock:false
        }
    }
    

  //function for Organizer's SignUp (checking for username is not done yet)
  SignUp = async(event) => {

    event.preventDefault()

    const {contract, accounts} = this.props
    // //calling function by providing the password and returns the Account Address
    // await this.props.accountCreator("test");

    // console.log(this.props.acc);

    //-------------------Calling fucntion for the Organizer Credentials Data------------------
    let CredentialsData = {
      Username : "prateekmedy",
      Password : "test",
      Address : accounts[0] //this.state.accAddress
    }  

    //calling the promise by providing the data to convert it to hash
    let ipfsCredentialsHash = await ipfsSender(CredentialsData)
    this.setState({ipfsCredentialsHash})
    console.log(this.state.ipfsCredentialsHash)

    //function for sending hash to the blockchain
    await contract.methods.setOrganizerCredentials("prateekmedy", this.state.ipfsCredentialsHash).send({from: '0xB18DFE177bd96c229D5e0E6D06446Ff0eF825B13',gas:6721975})
    .then((receipt) => {
      console.log(receipt)
    })
    .catch((error) => {
      console.log(error)
    });

    //-------------------Calling fucntion for the Organizer Personal Data------------------
    let PersonalData = {
      Username : "prateekmedy",
      Address : accounts[0], //this.state.accAddress
      Name : "Prateek Patel",
      Organization : "Elelction Commttion",
      Mobile : 6985471365
    }  

    //calling the promise by providing the data to convert it to hash
    let ipfsPersonalHash = await ipfsSender(PersonalData)
    this.setState({ipfsPersonalHash})
    console.log(this.state.ipfsPersonalHash)

    //function for sending hash to the blockchain
    await contract.methods.setOrganizerPersonal("prateekmedy",this.state.ipfsPersonalHash).send({from: '0xB18DFE177bd96c229D5e0E6D06446Ff0eF825B13',gas:6721975})
    .then((receipt) => {
      console.log(receipt)
    })
    .catch((error) => {
      console.log(error)
    });


    //-------------------------------------Functions for retireving the Data from the Blockchain-----------------
    //calling for fetching the hash from the blockchain.
    let result;
    await contract.methods.getOrganizerPersonal("prateekmedy").call()
    .then((res) => result = res)
    .catch(console.error)

    //calling the promise by providing the hash to convert it to data
    let ipfsPersonalData = await ipfsFetcher(result)
    this.setState({ipfsPersonalData})
    console.log(this.state.ipfsPersonalData)

  }
 
  SignIn = async(event) => {

    event.preventDefault();

    const {contract, web3} = this.props
    const username = "prateekmedy"
    let result

    await contract.methods.findOrganizer(username).call()
    .then((res) => result = res)
    .catch(console.error)


    if(result){

      let hash;
      await contract.methods.getOrganizerCredentials("prateekmedy").call()
      .then((res) => hash = res)
      .catch(console.error)
  
      //calling the promise by providing the hash to convert it to data
      let ipfsCredentailsData = await ipfsFetcher(hash)
      this.setState({ipfsCredentailsData})
      console.log(ipfsCredentailsData)

      if(ipfsCredentailsData.Password === "test"){
            await web3.eth.personal.unlockAccount(ipfsCredentailsData.Address,ipfsCredentailsData.Password,600)
            .then(console.log("Unlock"))

            this.setState({isUnlock:true})
            console.log(this.state.isUnlock)

            // setTimeout(() => {
            //   this.setState({isUnlock:false})
            //   console.log(this.state.isUnlock)
            // }, 60)

            this.props.loginUpdate(true);

            console.log("You are Login :)")
      }else{
        console.log("Invalid Password")
      }

  
    }else{
      console.log("Try Again , Invalid Username")
    } 
    
  }

  updateInputValue(evt) {
    this.setState({
      inputValue: evt.target.value
    });
  }

  // accountCheck = async() => {
  //   const {contract} = this.props;

  //   await contract.methods.getOrganizerPersonal("prateekmedy").call()
  //   .then(console.log)
  //   .catch(console.error)

  // }

    render(){
        console.log(this.props)
        return (
            <div>
            <form onSubmit={this.SignIn}>
                <input value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)}/>
                <input type="submit" value="SignIn"/>
            </form>
            <button onClick={this.SignUp}>SignUp</button>
            {/* <button onClick={this.accountCheck}>Check</button> */}
            </div>
        ) 
    }
          
}

export default OrganizerLogin;