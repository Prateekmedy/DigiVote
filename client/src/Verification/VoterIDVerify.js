import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export default class VoterIDVerify extends Component {

    constructor(props){
        super(props)
        this.state = {
            voterId : ""
        }
    }

    verifyVoterId =(event) => {

        event.preventDefault()
       
        if(this.props.voterId === this.state.voterId){
            this.props.voterIdVerified()
        }else{
            alert("Enter The Correct VoterID")
            console.log("Enter the correct VoterID")
        }

    }   
    
    updateVoterId = (evt) => {
        this.setState({
            voterId : evt.target.value
        })
    }


    render(){
        return(
            <div>
                <Grid 
                    container 
                    direction="row"
                    justify="center"
                    alignItems="center"
                    className="testClass"
                >
                    <Paper 
                        elevation={2}
                        className="VoterIDCard"
                    >
                    <Grid 
                        container 
                        direction="row"
                        justify="center"
                        alignItems="center"
                    >
                        <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom>Verify VoterID</Typography>
                        </Grid>
                        <Grid item xs={12}>
                        <TextField
                            required
                            name="VoterID"
                            id="VoterID"
                            label="VoterID"
                            value={this.state.voterId}
                            onChange={evt => this.updateVoterId(evt)}
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
                            onClick={this.verifyVoterId}  
                        >Verify</Button>
                        </Grid> 
                        </Grid>
                    </Paper>
                </Grid>
            </div>
        )
    }

 }
