import React, { Component } from 'react'
import {ipfsFetcher, ipfsSender} from '../ipfsStore'

class CandidateLogin extends Component{   

    constructor(props){
        super(props)
        this.state = {
            inputUsername:"",
            inputPassword:"",
            ipfsCredentialsHash: null,
            ipfsCredentailsData: null,
            ipfsPersonalHash: null,
            ipfsPersonalData: null,
            isUnlock:false,
            isSignUp : false
        }
    }
    

  //function for Candidate's SignUp (checking for username is not done yet)
  SignUp = async(event) => {

    event.preventDefault()

    const {contract, accounts} = this.props.userObject
    // //calling function by providing the password and returns the Account Address
    // await this.props.userObject.accountCreator("test");

    // console.log(this.props.userObject.acc);

    //-------------------Calling fucntion for the Candidate Credentials Data------------------
    let CredentialsData = {
      Username : "prople",
      Password : "password1",
      Address : accounts[1] //this.state.accAddress
    }  

    //calling the promise by providing the data to convert it to hash
    let ipfsCredentialsHash = await ipfsSender(CredentialsData)
    this.setState({ipfsCredentialsHash})
    console.log(this.state.ipfsCredentialsHash)

    //function for sending hash to the blockchain
    await contract.methods.setCandidateCredentials(CredentialsData.Username, this.state.ipfsCredentialsHash).send({from: '0xB18DFE177bd96c229D5e0E6D06446Ff0eF825B13',gas:6721975})
    .then((receipt) => {
      console.log(receipt)
    })
    .catch((error) => {
      console.log(error)
    });

    //-------------------Calling fucntion for the Candidate Personal Data------------------
    let PersonalData = {
      Username                  : "prople",
      Account                   : accounts[1], //this.state.accAddress
      Name                      : "Vipul Sharma",
      ElectionParty             : "Congress",
      Mobile                    : 6985471365,
      Age                       : 30,
      constituency              : "MP",
	    Father_Name               : "Drolite",
	    Mother_Name               : "Krolite",
	    DOB                       : "1/1/1980",
	    Cast                      : "General",
	    Party_type                : "Recoganised Party",
	    Party_Symbol              : "abc.jpg",
	    Citizenship               : "Indian",
	    Education_Qualification   : "BE"	
    }  

    //calling the promise by providing the data to convert it to hash
    let ipfsPersonalHash = await ipfsSender(PersonalData)
    this.setState({ipfsPersonalHash})
    console.log(this.state.ipfsPersonalHash)

    //function for sending hash to the blockchain
    await contract.methods.setCandidatePersonal(PersonalData.Username,this.state.ipfsPersonalHash).send({from: '0xB18DFE177bd96c229D5e0E6D06446Ff0eF825B13',gas:6721975})
    .then((receipt) => {
      console.log(receipt)
    })
    .catch((error) => {
      console.log(error)
    });


    //-------------------------------------Functions for retireving the Data from the Blockchain-----------------
    //calling for fetching the hash from the blockchain.
    let result;
    await contract.methods.getCandidatePersonal(PersonalData.Username).call()
    .then((res) => result = res)
    .catch(console.error)

    console.log(result);

    //calling the promise by providing the hash to convert it to data
    let ipfsPersonalData = await ipfsFetcher(result)
    this.setState({ipfsPersonalData,isSignUp : true})
    console.log(this.state.ipfsPersonalData)



  }
 
  SignIn = async(event) => {

    event.preventDefault();

    const {contract, web3} = this.props.userObject
    let result

    await contract.methods.findCandidate(this.state.inputUsername).call()
    .then((res) => result = res)
    .catch(console.error)
    console.log(result)

    if(result){

      let hash;
      await contract.methods.getCandidateCredentials(this.state.inputUsername).call()
      .then((res) => hash = res)
      .catch(console.error)

      //this.setState({isUnlock:true}) //try for debugging please remove it after debugging
  
      //calling the promise by providing the hash to convert it to data
      let ipfsCredentailsData = await ipfsFetcher(hash)
      this.setState({ipfsCredentailsData})
      console.log(ipfsCredentailsData)

      if(ipfsCredentailsData.Password === this.state.inputPassword){
            await web3.eth.personal.unlockAccount(ipfsCredentailsData.Address,ipfsCredentailsData.Password,600)
            .then(console.log("Unlock"))
            

            let ipfsPersonalHash;
            await contract.methods.getCandidatePersonal(this.state.inputUsername).call()
            .then(res => ipfsPersonalHash = res)
            .catch(console.error)

            this.setState({isUnlock:true, ipfsPersonalHash})
            console.log(this.state.isUnlock)

            
            this.props.updateCandidateData(this.state.ipfsPersonalHash, this.state.inputUsername)
            this.props.loginUpdate(true)
            console.log(this.state.inputUsername)

            console.log("You are Login :)")
      }else{
        console.log("Invalid Password")
      }

  
    }else{
      console.log("Try Again , Invalid Username")
    } 
    
  }

  updateInputUsername(evt) {
    this.setState({
      inputUsername: evt.target.value
    });
  }

  updateInputPassword(evt) {
    this.setState({
      inputPassword: evt.target.value
    });
  }

    render(){
        console.log("CandidateLogin")
        return (
            <div>
            <form onSubmit={this.SignIn}>
                <input name="username" value={this.state.inputUsername} onChange={evt => this.updateInputUsername(evt)}/>
                <input name="password" value={this.state.inputPassword} onChange={evt => this.updateInputPassword(evt)}/>
                <input type="submit" value="SignIn"/>
            </form>
            { !this.state.isSignUp && <button onClick={this.SignUp}>SignUp</button>}
            </div>
        ) 
    }
          
}

export default CandidateLogin;