import React, { Component } from 'react'
import {ipfsFetcher, ipfsSender} from '../ipfsStore'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Home from '@material-ui/icons/Home';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';


class OrganizerLogin extends Component{   

    constructor(props){
        super(props)
        this.state = {
            inputUsername:"",
            inputPassword:"",
            username : "",
            password : "",
            name : "",
            Organization : "",
            mobile : "",
            DP : null,
            ipfsCredentialsHash: null,
            ipfsCredentailsData: null,
            ipfsPersonalHash: null,
            ipfsPersonalData: null,
            isUnlock:false,
            isSignUp : false,
            goToSignUp : false,
            loaderStart : false
        }
    }
    
  //function for Organizer's SignUp (checking for username is not done yet)
  SignUp = async(event) => {

    this.setState({ loaderStart : true })

    event.preventDefault()

    //checking for the empty textfiled or entry
    if((this.state.username && this.state.name && this.state.mobile && this.state.Organization && this.state.password) == ""){
      alert("Enter all the Details First !!")
      this.setState({ isSignUp : false, loaderStart : false })
      
    }else{
      const {contract, accounts} = this.props.userObject
      // //calling function by providing the password and returns the Account Address
      // await this.props.userObject.accountCreator("test");

      // console.log(this.props.userObject.acc);

      //prepering the image


      //-------------------Calling fucntion for the Organizer Credentials Data------------------

      let isUsernamePresent = false
      await contract.methods.findOrganizer(this.state.username).call()
      .then(res => isUsernamePresent = res)
      .catch(console.error)

      if(!isUsernamePresent){

        let CredentialsData = {
          Username : this.state.username,
          Password : this.state.password,
          Address  : accounts[0] //this.state.accAddress
        }  
    
        //calling the promise by providing the data to convert it to hash
        let ipfsCredentialsHash = await ipfsSender(CredentialsData)
        this.setState({ipfsCredentialsHash})
        console.log(this.state.ipfsCredentialsHash)
    
        //function for sending hash to the blockchain
        await contract.methods.setOrganizerCredentials(this.state.username, this.state.ipfsCredentialsHash).send({from: accounts[2],gas:6721975})
        .then((receipt) => {
          console.log(receipt)
        })
        .catch((error) => {
          console.log(error)
        });
    
        //-------------------Calling fucntion for the Organizer Personal Data------------------
        let PersonalData = {
          Username      : this.state.username,
          Address       : accounts[0], //this.state.accAddress
          Name          : this.state.name,
          Organization  : this.state.Organization,
          Mobile        : this.state.mobile,
          DP            : this.state.DP
        }  
    
        //calling the promise by providing the data to convert it to hash
        let ipfsPersonalHash = await ipfsSender(PersonalData)
        this.setState({ipfsPersonalHash})
        console.log(this.state.ipfsPersonalHash)
    
        //function for sending hash to the blockchain
        await contract.methods.setOrganizerPersonal(this.state.username,this.state.ipfsPersonalHash).send({from: accounts[2],gas:6721975})
        .then((receipt) => {
          console.log(receipt)
        })
        .catch((error) => {
          console.log(error)
        });
    
    
        //-------------------------------------Functions for retireving the Data from the Blockchain-----------------
        // //calling for fetching the hash from the blockchain.
        // let result;
        // await contract.methods.getOrganizerPersonal(this.state.username).call()
        // .then((res) => result = res)
        // .catch(console.error)
    
        // //calling the promise by providing the hash to convert it to data
        // let ipfsPersonalData = await ipfsFetcher(result)
        this.setState({//ipfsPersonalData,
          isSignUp : true, 
          goToSignUp : false, 
          loaderStart : false
        })
        alert("Thank You for Register !")
        // console.log(this.state.ipfsPersonalData)
    
        
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
    const username = this.state.inputUsername
    let result

    await contract.methods.findOrganizer(username).call()
    .then((res) => result = res)
    .catch(console.error)

    console.log(result)
    if(result){

      let hash;
      await contract.methods.getOrganizerCredentials(username).call()
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

            this.setState({isUnlock:true})
            console.log(this.state.isUnlock)

            this.props.updateOrganizerData(ipfsCredentailsData)
            this.props.loginUpdate(true)
            
            this.setState({ loaderStart : false })
            console.log("You are Login :)")
      }else{
        this.setState({ loaderStart : false })
        console.log("Invalid Password")
        alert("Invalid Password, try Again !!")
      }

  
    }else{
      this.setState({ loaderStart : false })
      console.log("Try Again , Invalid Username")
      alert("Invalid Username, Try Again !!")
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

  updateUsername(evt) {
    this.setState({
      username: evt.target.value
    });
  }

  updateName(evt) {
    this.setState({
      name: evt.target.value
    });
  }

  updatePassword(evt) {
    this.setState({
      password: evt.target.value
    });
  }

  updateOrganization(evt) {
    this.setState({
      Organization: evt.target.value
    });
  }

  updateMobile(evt) {
    this.setState({
      mobile: evt.target.value
    });
  }

  updateDP(evt) {
    this.setState({
      DP: evt.target.files[0]
    });
  }

  // accountCheck = async() => {
  //   const {contract} = this.props.userObject;

  //   await contract.methods.getOrganizerPersonal("prateekmedy").call()
  //   .then(console.log)
  //   .catch(console.error)

  // }

    render(){
        console.log("OrganizerLogin")
        
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
                          className="RegisterCard"
                        >
                          <Typography variant="h4" gutterBottom>Organizer Register</Typography>
                          <Grid container spacing={24}>
                            <Grid item xs={6}>
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
                            <Grid item xs={6}>
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
                            <Grid item xs={6}>
                              <TextField
                                required
                                name="Organization"
                                id="Organization"
                                label="Organization"
                                value={this.state.Organization}
                                onChange={evt => this.updateOrganization(evt)}
                                margin="normal"
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                required
                                name="Mobile"
                                id="Mobile"
                                label="Mobile"
                                value={this.state.mobile}
                                onChange={evt => this.updateMobile(evt)}
                                type="number"
                                margin="normal"
                              />
                            </Grid>
                            <Grid item xs={12}>
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
                            <input
                              accept="image/*"
                              id="DP"
                              name="DP"
                              type="file"
                              onChange={evt => this.updateDP(evt)}
                              style={{
                                display:"none"
                              }}
                            />
                            <Grid item xs={12}>
                              <label htmlFor="DP">
                                Upload the Profile Image
                                <Button variant="contained" component="span" style={{ marginLeft : "10px"}}>
                                  Upload
                                </Button>
                              </label>
                            </Grid>
                            <Grid item xs={12}>
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
                          <Typography variant="h4" gutterBottom>Organizer Login</Typography>
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

export default OrganizerLogin;