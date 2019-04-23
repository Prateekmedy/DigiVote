import React, { Component } from 'react'
import {ipfsFetcher, ipfsSender} from '../ipfsStore'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DateFnsUtils from '@date-io/date-fns';
import Home from '@material-ui/icons/Home';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';

class CandidateLogin extends Component{   

    constructor(props){
        super(props)
        this.state = {
            inputUsername         :"",
            inputPassword         :"",
            username              : "",
            password              : "",
            name                  : "",
            electionParty         : "",
            age                   : 0,
            mobile                : "",
            constituency          : "",
            fatherName            : "",
            motherName            : "",
            DOB                   : new Date(),
            partySymbol           : null,
            citizenship           : "",
            education             : "",
            ipfsCredentialsHash   : null,
            ipfsCredentailsData   : null,
            ipfsPersonalHash      : null,
            ipfsPersonalData      : null,
            isUnlock              : false,
            isSignUp              : false,
            goToSignUp            : false,
            loaderStart           : false
        }
    }
    

  //function for Candidate's SignUp (checking for username is not done yet)
  SignUp = async(event) => {

    this.setState({ loaderStart : true })

    event.preventDefault()

    //checking for the empty textfiled or entry
    if((this.state.username && this.state.name && this.state.electionParty && this.state.citizenship && this.state.age && this.state.DOB && this.state.mobile && this.state.password && this.state.constituency) == ""){
      alert("Enter all the Details First !!")
      this.setState({ isSignUp : false, loaderStart : false })
    }else{
      const {contract, accounts} = this.props.userObject
      // //calling function by providing the password and returns the Account Address
      // await this.props.userObject.accountCreator("test");

      // console.log(this.props.userObject.acc);

      //-------------------Calling fucntion for the Candidate Credentials Data------------------

      //checking of username is alerady present or not
      let isUsernamePresent = false

      await  contract.methods.findCandidate(this.state.username).call()
      .then(res => isUsernamePresent = res)
      .catch(console.error)

      if(!isUsernamePresent){

        let CredentialsData = {
          Username : this.state.username,
          Password : this.state.password,
          Address : accounts[1] //this.state.accAddress
        }  
    
        //calling the promise by providing the data to convert it to hash
        let ipfsCredentialsHash = await ipfsSender(CredentialsData)
        this.setState({ipfsCredentialsHash})
        console.log(this.state.ipfsCredentialsHash)
    
        //function for sending hash to the blockchain
        await contract.methods.setCandidateCredentials(CredentialsData.Username, this.state.ipfsCredentialsHash).send({from: accounts[2],gas:6721975})
        .then((receipt) => {
          console.log(receipt)
        })
        .catch((error) => {
          console.log(error)
        });
    
        //-------------------Calling fucntion for the Candidate Personal Data------------------
        let PersonalData = {
          Username                  : this.state.username,
          Account                   : accounts[1], //this.state.accAddress
          Name                      : this.state.name,
          ElectionParty             : this.state.electionParty,
          Mobile                    : this.state.mobile,
          Age                       : this.state.age,
          constituency              : this.state.constituency,
          Father_Name               : this.state.fatherName,
          Mother_Name               : this.state.motherName,
          DOB                       : this.state.DOB.toString(),
          Party_Symbol              : this.state.partySymbol,
          Citizenship               : this.state.citizenship,
          Education_Qualification   : this.state.education	
        }  
    
        //calling the promise by providing the data to convert it to hash
        let ipfsPersonalHash = await ipfsSender(PersonalData)
        this.setState({ipfsPersonalHash})
        console.log(this.state.ipfsPersonalHash)
    
        //function for sending hash to the blockchain
        await contract.methods.setCandidatePersonal(PersonalData.Username,this.state.ipfsPersonalHash).send({from: accounts[2],gas:6721975})
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
    
        ////calling the promise by providing the hash to convert it to data
        //let ipfsPersonalData = await ipfsFetcher(result)
        this.setState({ //ipfsPersonalData,
                          isSignUp : true, 
                          goToSignUp : false, 
                          loaderStart : false
        })
        alert("Thank You for Register !")
        //console.log(this.state.ipfsPersonalData)
    
      }else{
        this.setState({ loaderStart : false })
        console.log("Username is Already Excist")
        alert("Username is already excist")
      }
      
    }

    


  }
 
  SignIn = async(event) => {

    this.setState({ loaderStart : true })

    //checking if the entered value is empty
    if((this.state.inputUsername && this.state.inputPassword) == ""){
      alert("Please Enter something !!")
      this.setState({ loaderStart : false})
    }

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

            this.setState({ loaderStart : false })
            console.log("You are Login :)")
      }else{
        this.setState({ loaderStart : false })
        console.log("Invalid Password")
        alert("Invalid Password, Try Again !!")
      }

  
    }else{
      this.setState({ loaderStart : false })
      console.log("Try Again , Invalid Username")
      alert("Invalid Username, Try Again !")
    } 
    
  }

  updateInputUsername = (evt) => this.setState({   inputUsername: evt.target.value  }); 

  updateInputPassword = (evt) => this.setState({  inputPassword: evt.target.value  });

  updateUsername = (evt) => this.setState({  username: evt.target.value  });

  updatePassword = (evt) => this.setState({  password: evt.target.value  });

  updateName = (evt) => this.setState({  name: evt.target.value  });

  updateAge = (evt) => this.setState({  age : evt.target.value  });
  
  updateFatherName = (evt) => this.setState({  fatherName: evt.target.value  });

  updateMotherName = (evt) => this.setState({  motherName: evt.target.value  });

  updateMobile = (evt) => this.setState({  mobile: evt.target.value  });

  updateCitizenship = (evt) => this.setState({  citizenship: evt.target.value  });

  updateEducation = (evt) => this.setState({  education: evt.target.value  });

  updateConsitituency = (evt) => this.setState({  constituency: evt.target.value  });

  updateDOB = (val) => this.setState({  DOB: val  });
  
  updateElectionParty = (evt) => this.setState({  electionParty: evt.target.value  });

  updatePartySymbol = (evt) => this.setState({  partySymbol: evt.target.files[0]  });




    render(){
        console.log("CandidateLogin")
        return (

              <div  className="testClass">
              <Fade
                    in={this.state.loaderStart === true}
                    unmountOnExit
                >
                    <Grid 
                        container 
                        direction="row"
                        justify="center"
                        alignItems="center"
                        className="loaderDiv1"
                    >
                        <CircularProgress className="loader"/>
                    </Grid>
                </Fade>
              <Grid 
                container 
                direction="row"
                justify="center"
                alignItems="center"
                className="testClass"
                >
                  {
                    this.state.goToSignUp
                      ? <Paper 
                          elevation={2}
                          className="RegisterCard2"
                        >
                          <Typography variant="h4" gutterBottom>Candidate Register</Typography>
                          <Grid container>
                            <Grid container item xs={12}>
                              <Grid item xs={4} >
                                <TextField
                                  required
                                  name="username"
                                  id="username"
                                  label="Username"
                                  value={this.state.username}
                                  onChange={evt => this.updateUsername(evt)}
                                  margin="normal"
                                />
                              </Grid>
                              <Grid item xs={4} >
                                <TextField
                                  required
                                  name="name"
                                  id="name"
                                  label="Name"
                                  value={this.state.name}
                                  onChange={evt => this.updateName(evt)}
                                  margin="normal"
                                />
                              </Grid>
                              <Grid item xs={4} >
                                <TextField
                                  required
                                  name="ElelctionParty"
                                  id="ElelctionParty"
                                  label="Elelction Party"
                                  value={this.state.electionParty}
                                  onChange={evt => this.updateElectionParty(evt)}
                                  margin="normal"
                                />
                              </Grid>
                            </Grid>
                            <Grid container item xs={12}>
                              <Grid item xs={4} >
                                <TextField
                                  required
                                  name="FatherName"
                                  id="FatherName"
                                  label="Father Name"
                                  value={this.state.fatherName}
                                  onChange={evt => this.updateFatherName(evt)}
                                  margin="normal"
                                />
                              </Grid>
                              <Grid item xs={4} >
                                <TextField
                                  required
                                  name="MotherName"
                                  id="MotherName"
                                  label="Mother Name"
                                  value={this.state.motherName}
                                  onChange={evt => this.updateMotherName(evt)}
                                  margin="normal"
                                />
                              </Grid>
                              <Grid item xs={4} >
                                <TextField
                                  required
                                  name="Citizenship"
                                  id="Citizenship"
                                  label="Citizenship"
                                  value={this.state.citizenship}
                                  onChange={evt => this.updateCitizenship(evt)}
                                  margin="normal"
                                />
                              </Grid>
                            </Grid>
                            <Grid container item xs={12}>
                              <Grid item xs={4} >
                                <TextField
                                  required
                                  name="Age"
                                  id="Age"
                                  label="Age"
                                  value={this.state.age}
                                  onChange={evt => this.updateAge(evt)}
                                  margin="normal"
                                  type="number"
                                />
                              </Grid>
                              <Grid item xs={4} >
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                  <Grid container className="DateNTimeCenter">
                                    <DatePicker
                                      required
                                      margin="normal"
                                      label="Date of Birth"
                                      value={this.state.DOB}
                                      onChange={this.updateDOB}
                                    />
                                  </Grid>
                                </MuiPickersUtilsProvider>
                              </Grid>
                              <Grid item xs={4} >
                                <TextField
                                  required
                                  name="Mobile"
                                  id="Mobile"
                                  label="Mobile"
                                  value={this.state.mobile}
                                  onChange={evt => this.updateMobile(evt)}
                                  margin="normal"
                                  type="number"
                                />
                              </Grid>
                            </Grid>
                            <Grid container item xs={12}>
                              <Grid item xs={4} >
                                <TextField
                                  required
                                  name="Password"
                                  id="Password"
                                  label="Password"
                                  value={this.state.password}
                                  onChange={evt => this.updatePassword(evt)}
                                  margin="normal"
                                  type="password"
                                />
                              </Grid>
                              <Grid item xs={4} >
                                <TextField
                                  required
                                  name="Education"
                                  id="Education"
                                  label="Education Qualification"
                                  value={this.state.education}
                                  onChange={evt => this.updateEducation(evt)}
                                  margin="normal"
                                />
                              </Grid>
                              <Grid item xs={4} >
                                <TextField
                                  required
                                  name="Constituency"
                                  id="Constituency"
                                  label="Constituency"
                                  value={this.state.constituency}
                                  onChange={evt => this.updateConsitituency(evt)}
                                  margin="normal"
                                />
                              </Grid>
                            </Grid>
                            <Grid 
                              container 
                              item 
                              xs={12}
                              direction="row"
                              justify="center"
                              alignItems="center" 
                              style={{ marginTop : "20px"}}
                            >
                              <input
                                accept="image/*"
                                id="DP"
                                name="DP"
                                type="file"
                                onChange={evt => this.updatePartySymbol(evt)}
                                style={{
                                  display:"none"
                                }}
                              />
                              <Grid item xs={12}>
                                <label htmlFor="DP">
                                  Upload the ElectionParty Symbol
                                  <Button variant="contained" component="span" style={{ marginLeft : "10px"}}>
                                    Upload
                                  </Button>
                                </label>
                              </Grid>
                            </Grid>
                            <Grid 
                              container 
                              item 
                              xs={12}
                              direction="row"
                              justify="center"
                              alignItems="center" 
                              style={{ marginTop : "20px"}}
                            >
                              <Button 
                                variant="contained" 
                                color="primary"
                                style={{
                                  marginTop : "60px",
                                  margin:"5px"
                                }}
                                onClick={this.SignUp}
                              >SignUp</Button>
                              <Button 
                                variant="contained"
                                style={{
                                  marginTop : "60px",
                                  margin:"5px"
                                }}
                                onClick={() => this.setState({ goToSignUp : false })}
                              >Back</Button>
                            </Grid>
                          </Grid>
                         </Paper>
                      : <Paper 
                          elevation={2}
                          className="loginCard"
                        >
                          <Typography variant="h4" gutterBottom>Candidate Login</Typography>
                          <form onSubmit={this.SignIn} autoComplete="off">
                            <TextField
                              required
                              name="username"
                              id="username"
                              label="Username"
                              value={this.state.inputUsername}
                              onChange={evt => this.updateInputUsername(evt)}
                              margin="normal"
                            />
                            <br />
                            <TextField
                              required
                              name="password"
                              id="password"
                              label="Password"
                              type="password"
                              value={this.state.inputPassword}
                              onChange={evt => this.updateInputPassword(evt)}
                              margin="normal"
                            />
                            <br />
                            <Button 
                              variant="contained" 
                              color="primary"
                              style={{
                                marginTop : "30px",
                                margin:"5px"
                              }} 
                              onClick={this.SignIn}  
                            >Login</Button>
                            <Button 
                              variant="contained" 
                              color="secondary"
                              style={{
                                marginTop : "30px",
                                margin:"5px"
                              }}
                              onClick={() => this.setState({ goToSignUp : true })}
                            >Register</Button>
                          </form>
                          <Home className="HomeIcon" onClick={() => this.props.updateHomeState(0, null)} />
                        </Paper>
                  }  
              </Grid>
            </div>
        ) 
    }
          
}

export default CandidateLogin;