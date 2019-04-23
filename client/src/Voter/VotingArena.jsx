import React, { Component } from 'react';
import SingleCandidate from './SingleCandidate';
import {otpSender, otpVerifier} from '../utils/OtpGenrator'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import TouchApp from '@material-ui/icons/TouchApp';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../App.css';

export default class VoterArena extends Component{
    constructor(props){
        super(props)
        this.state = {
            candidates : null,
            selectedCandidate : "",
            OTPUnlock : false, //this true value is for debugging, assign false after debugging
            OTP : "",
            otpVerify : true, //this true value is for debugging, assign false after debugging
            loaderStart : false
        }
    }

    componentWillMount = () => {

        this.setState({ loaderStart : true })

       let candidates =  this.props.selectedElection.candidates.filter((candidate) => {
                            return (candidate[2] === this.props.AadhaarObject.Constituency)
                        })

            candidates.push(this.props.selectedElection.candidates[0])

        this.setState({
            candidates, loaderStart : false
        })
        console.log(candidates)
    }

    updateSelectedCandidate = (selectedCandidate) => {
        this.setState({
            selectedCandidate
        })
    }

    voteIt = async() => {
        this.setState({ loaderStart : true })
        console.log(this.state.selectedCandidate)

        //sending an OTP to register mobile no.
        //Promise for sending the OTP
         await otpSender(this.props.AadhaarObject.Mobile, "Digivote")
         .then(data => {
           console.log(data)
           console.log("OTP Sended Successfully")
           this.setState({
             isOtpSended : true
           })
         })
         .catch(console.error)
           
         this.setState({
             OTPUnlock : true, loaderStart : false
         })

    }

    updateOTP(evt){               
        this.setState({
            OTP : evt.target.value
        });
    }

    voteDone = async(event) => {
        this.setState({ loaderStart : true })
        event.preventDefault()

        await otpVerifier(this.props.AadhaarObject.Mobile, this.state.OTP)
        .then(data => {
            console.log(data)
            console.log("OTP Verified")
            this.setState({
            otpVerify : true
            })
        })
        .catch(console.error)

        if(this.state.otpVerify){

            await this.props.userObject.contract.methods.addVoterToElection(this.props.selectedElection.electionHash, this.props.AadhaarHash).send({from: this.props.userObject.accounts[2],gas:6721975})
            .then((result) => {
              console.log(result)
              console.log("Voter Added to Election")
            })
            .catch((error) => {
              console.log(error)
            })

            await this.props.userObject.contract.methods.addAadhaar(this.props.selectedElection.electionHash, this.props.AadhaarObject.Aadhaar).send({from: this.props.userObject.accounts[2],gas:6721975})
            .then((result) => {
              console.log(result)
              console.log("VOter Aadhaar added to Election")
            })
            .catch((error) => {
              console.log(error)
            })

            let length=0

            await this.props.userObject.contract.methods.countElectionCandidates(this.props.selectedElection.electionHash).call()
            .then(res => length = res)
            .catch(console.error)

            for(let i=0; i<length; i++){
                
                await this.props.userObject.contract.methods.voteSelectedCandidates(this.props.selectedElection.electionHash, this.state.selectedCandidate, i).send({from: this.props.userObject.accounts[2],gas:6721975})
                .then((result) => {
                console.log(result)
                console.log("VOter voted to the selected Candidate in election")
                })
                .catch((error) => {
                console.log(error)
                })

            }
            
            this.setState({ loaderStart : false })
            console.log("Voting Successfully")
            alert("Thank You Voting into the Election :)")
            this.props.updateResetAll()

        }else{
            this.setState({ loaderStart : false })
            console.log("OTP is Invalid")
            alert("OTP is Invalid")
        }
    }

    render(){
        console.log("Voter's Arena")
        console.log(this.props.AadhaarObject)
        console.log(this.props.selectedElection)
        return(
            <div>
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
                    justify="flex-end"
                    alignItems="center"
                    style={{ height : "100vh", width: "100%", background : "#4527a0"}}
                >
                    <Grid item xs={9}>
                        <Paper 
                            elevation={2}
                            className="VotingArenaCard"
                            style={{ background : "#fff" , margin : "20px"}}
                        >
                            <Grid container item xs={12}>
                                <Grid item xs={12}>
                                    <Typography variant="h5" gutterBottom>{this.props.selectedElection.election.typeOfElection}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" gutterBottom>{this.props.selectedElection.election.constituency}</Typography>
                                </Grid>
                            </Grid> 
                            <Grid 
                                container 
                                item 
                                xs={12}
                                direction="row"
                                justify="center"
                                alignItems="center"
                            >
                              <Paper 
                                elevation={5}
                                className="VotingArenaCardInner"
                              >
                                <Grid container style={{ width : "100%", height : "200px"}}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" style={{ color : "#fff" }}gutterBottom>Select The Candidate</Typography>
                                    </Grid>
                                    <Grid container item xs={12} style={{ padding:"15px" }}>
                                    {
                                        this.state.candidates.map((candidate, index) =>
                                                    <SingleCandidate 
                                                        key={index} 
                                                        index={index} 
                                                        candidate={candidate[0]} 
                                                        selectedCandidate={this.state.selectedCandidate}
                                                        updateSelectedCandidate={this.updateSelectedCandidate}
                                                        userObject={this.props.userObject}
                                                    />    
                                        )
                                    }
                                    </Grid>
                                </Grid>
                              </Paper>  
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        {
                            this.state.OTPUnlock
                                ? <Paper 
                                        elevation={2}
                                        className="VoterCard"
                                    >
                                        <Grid 
                                            container 
                                            direction="row"
                                            justify="center"
                                            alignItems="center"
                                        >
                                            <Grid item xs={12}>
                                                <Typography variant="h6" gutterBottom>Enter OTP</Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    required
                                                    name="OTP"
                                                    id="OTP"
                                                    label="OTP"
                                                    value={this.state.OTP}
                                                    onChange={evt => this.updateOTP(evt)}
                                                    margin="normal"
                                                    type="number"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button 
                                                    variant="contained" 
                                                    color="primary"
                                                    style={{
                                                    marginTop : "30px",
                                                    margin:"5px"
                                                    }} 
                                                    className="VoteDoneBtn"
                                                    onClick={this.voteDone}  
                                                >Vote Done</Button>
                                            </Grid> 
                                        </Grid>
                                    </Paper>
                                :   <Fab color="primary" aria-label="Touch" className="touchIcon" onClick={this.voteDone}>
                                        <TouchApp />
                                    </Fab>
                        }
                    </Grid>
                </Grid>
            </div>
        )
    }
}

//delete the VoteDo button and uncomment the above code , this thing is only done for debugging