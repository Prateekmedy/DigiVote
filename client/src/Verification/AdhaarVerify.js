import React, { Component } from 'react';
import AadhaarData from './AdhaarData'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import Home from '@material-ui/icons/Home';

export default class AadhaarVerify extends Component {

    constructor(props){
        super(props)
        this.state = {
            Aadhaar : "",
            loaderStart : false
        }
    }

    verifyIt = async(event) => {

        this.setState({ loaderStart : true })

        event.preventDefault()

        let found = false
        
    
        if(this.state.Aadhaar.length === 12){

            let votedAadhaarArray = []
            let isAadhaarVoted = undefined
            let length = 0

            console.log(this.props.selectedElection.electionHash)
            await this.props.userObject.contract.methods.aadhaarCount(this.props.selectedElection.electionHash).call()
            .then(res => length = res)
            .catch(console.error)

            console.log(length)

            for(let i=0;i<length;i++){

                let result =""

                await this.props.userObject.contract.methods.checkAadhaar(this.props.selectedElection.electionHash, i).call()
                .then(res => result = res)
                .catch(console.error)

                votedAadhaarArray.push(result)
            }

            isAadhaarVoted = votedAadhaarArray.find((aadhaar) => {
                return aadhaar === this.state.Aadhaar
            })            
            //console.log(isAadhaarVoted)

            if(isAadhaarVoted !== undefined){

                this.setState({ loaderStart : false })
                alert("You are already did the Voting for this Election")
                console.log("Already Voted with this Aadhaar Card")
                this.props.updateHomeState(0, null)

            }else{

                console.log(AadhaarData.AadhaarCards.length)
                for(let i = 0; i < AadhaarData.AadhaarCards.length; i++){

                    if(AadhaarData.AadhaarCards[i].Aadhaar_Id === this.state.Aadhaar){
    
                        if(AadhaarData.AadhaarCards[i].e_Kyc.Poa.state === this.props.selectedElection.election.constituency){
                            
                            let {Aadhaar_Id} = AadhaarData.AadhaarCards[i]
                            let {name, mobile, dob, gender} = AadhaarData.AadhaarCards[i].e_Kyc.Poi
                            let {house, street, landmark, state, dist, pc} = AadhaarData.AadhaarCards[i].e_Kyc.Poa
                            let {voterID} = AadhaarData.AadhaarCards[i].e_Kyc.Seeds
                
                            //console.log(AadhaarData.AadhaarCards[i].e_Kyc)
    
                            found = true
                            let AadhaarObject = {
                                Aadhaar     : Aadhaar_Id,
                                Name        : name,
                                DoB         : dob,
                                Gender      : gender,
                                Mobile      : mobile,
                                Address     : house+street+landmark,
                                State       : state,
                                Constituency: dist,
                                Pincode     : pc,
                                VoterId     : voterID
                            }
                            
                            //console.log(AadhaarObject)
                            this.setState({ loaderStart : false })
                            this.props.updateAadhaarData(AadhaarObject)  
                            this.props.updateOtpWidgetUnlock()
    

                        }else{
                            this.setState({ loaderStart : false })
                            alert("This Election is not Oragnize in your Constituency")
                            console.log("This Election is not Oragnize in your Constituency")
                            this.props.updateHomeState(0, null)
                            break
                        }
                        
                        break
                    }
                    
                }
            }

            

        }else{
            this.setState({ loaderStart : false })
            console.log("Enter the correct 12 digit Aadhar Card")
            alert("Enter the correct 12 Digit Aadhaar Card !!")
        }
        
        
        
        if(!found){
            this.setState({ loaderStart : false })
            console.log("Aadhaar Card not found")
            alert("Aadhaar Card Not Found !!")
            return false
        }

    }   
    
    updateAadhaar = (evt) => {
        this.setState({
            Aadhaar : evt.target.value
        })
    }


    render(){
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
                    direction="row-reverse"
                    justify="center"
                    alignItems="center"
                    className="testClass"
                >
                    <Paper 
                        elevation={2}
                        className="AadhaarCard"
                    >
                    <Grid 
                        container 
                        direction="row"
                        justify="center"
                        alignItems="center"
                    >
                        <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom>Verify Aadhaar</Typography>
                        </Grid>
                        <Grid item xs={12}>
                        <TextField
                            required
                            name="Aadhaar"
                            id="Aadhaar"
                            label="Aadhaar"
                            value={this.state.Aadhaar}
                            onChange={evt => this.updateAadhaar(evt)}
                            margin="normal"
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
                            onClick={this.verifyIt}  
                        >Verify</Button>
                        </Grid> 
                        <Home className="HomeIcon" onClick={() => this.props.updateHomeState(0, null)} />
                        </Grid>
                    </Paper>
                </Grid>
            </div>
        )
    }

 }
