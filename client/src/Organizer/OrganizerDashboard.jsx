import React, { Component } from 'react';
import OrganizeElection from './OragnizeElection';
import AllRequests from './AllRequests'

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
                <h1>Hi this is Organizer Dashboard</h1>
                <button onClick={() => { this.setState({val:1})}}>Create Election</button>
                <button onClick={() => { this.setState({val:2})}}>All Request</button>
                <button onClick={this.logoutHandler}>Logout</button>
                {Option}     
            </div>
        )
    }

    
}

export default OrganizerDashboard