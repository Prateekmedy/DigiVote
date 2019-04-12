import React, { Component } from 'react';
import CandidateNomineeRequest from './CandidateNomineeRequest';
import ElectionRequests from './ElectionRequests';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

class CandidateDashboard extends Component{

    constructor(props){
        super(props)
        this.state = {
            isCreate : false,
            val:0
           // OrganizerData : this.props.OragnizerData
        }
    }

    logoutHandler = () => {
        this.props.loginUpdate(false)
    }


    render(){
        console.log("CandidateDashboard")

        let Option = "";

        switch(this.state.val){
            case 1 : Option = <CandidateNomineeRequest 
                                    userObject={this.props.userObject} 
                                    candidateHash={this.props.candidateHash}
                                    username={this.props.username}
                                />   
            break;
            case 2 : Option = <ElectionRequests  
                                    userObject={this.props.userObject}
                                    username={this.props.username}
                                />
            break;
            default : Option = null 
        }

        return (
            <div>
                <Grid container >
                    <AppBar position="static" style={{ background : "#c62828", color : "#fff"}} >
                        <Toolbar>
                            <Typography variant="h6" color="inherit" >
                            Candidate Dashboard
                            </Typography>
                            
                            <Grid container 
                                direction="row"
                                justify="flex-end"
                                alignItems="center"
                                style={{ width: "80%"}}
                            >
                                <Typography variant="button" style={{ color : "#fff" }} gutterBottom>{this.props.username ? this.props.username : "Unknown"}</Typography>
                                <Button variant="outlined" style={{ color : "#fff", borderColor : "#fff", marginLeft : "10px"}} onClick={this.logoutHandler}>
                                    Logout
                                </Button>
                            </Grid>
                            
                        </Toolbar>
                    </AppBar>    
                </Grid>
                <Grid 
                    container 
                    direction="row"
                    justify="flex-end"
                    alignItems="center"
                    style={{ height : "90vh", width: "100%" , background: "#fff"}}
                >
                    <Grid item xs={3}>
                        <Grid item xs={12}>
                            <Button 
                                variant="contained" 
                                color="primary"
                                style={{
                                    backgroundColor : "#c62828",
                                    margin:"5px"
                                }}
                                onClick={() => { this.setState({val:1})}}
                            >Elections</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button 
                                variant="contained" 
                                color="primary"
                                style={{
                                    backgroundColor : "#c62828",
                                    margin:"5px"
                                }}
                                onClick={() => { this.setState({val:2})}}
                            >Your Request</Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={9}>
                        <Paper 
                            elevation={2}
                            className="DashboardCard"
                            style={{ background : "#c62828" , margin : "20px"}}
                        >
                            <Grid item xs={12}>
                                {Option}
                            </Grid> 
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }

    
}

export default CandidateDashboard