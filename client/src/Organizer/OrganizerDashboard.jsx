import React, { Component } from 'react';
import OrganizeElection from './OragnizeElection';
import AllRequests from './AllRequests'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Fab from '@material-ui/core/Fab';

class OrganizerDashboard extends Component{

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

    initialState = () => {
        this.setState({
            val : 0
        })
    }

 

    render(){
        console.log("OrganizerDashboard")

        let Option = "";

        switch(this.state.val){
            case 1 : Option = <OrganizeElection 
                                    back={this.initialState} 
                                    accounts= {this.props.userObject.accounts}
                                    contract= {this.props.userObject.contract}
                                    OrganizerData = {this.props.OrganizerData}
                                />  
            break;
            case 2 : Option = <AllRequests 
                                    userObject={this.props.userObject}
                                />
            break;
            default : Option = null 
        }

        return (
            <div>
                <Grid container >
                    <AppBar position="static" style={{ background : "#4527a0", color : "#fff"}} >
                        <Toolbar>
                            <Typography variant="h6" color="inherit" >
                            Organizer Dashboard
                            </Typography>
                            
                            <Grid container 
                                direction="row"
                                justify="flex-end"
                                alignItems="center"
                                style={{ width: "80%"}}
                            >
                                <Typography variant="button" style={{ color : "#fff" }} gutterBottom>{this.props.OrganizerData ? this.props.OrganizerData.Username : "Unknown"}</Typography>
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
                                
                                    margin:"5px"
                                }}
                                onClick={() => { this.setState({val:1})}}
                            >Create Election</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button 
                                variant="contained" 
                                color="primary"
                                style={{
                                
                                    margin:"5px"
                                }}
                                onClick={() => { this.setState({val:2})}}
                            >All Request</Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={9}>
                        <Paper 
                            elevation={2}
                            className="DashboardCard"
                            style={{ background : "#4527a0" , margin : "20px"}}
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

export default OrganizerDashboard