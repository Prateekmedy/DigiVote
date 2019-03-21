import React, { Component } from 'react';
import CandidateNomineeRequest from './CandidateNomineeRequest';
import ElectionRequests from './ElectionRequests';

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
                <h1>Hi this is Candidate Dashboard</h1>
                <button onClick={() => { this.setState({val:1})}}>Elections</button>
                <button onClick={() => { this.setState({val:2})}}>Requests</button>
                <button onClick={this.logoutHandler}>Logout</button> 
                {Option}      
            </div>
        )
    }

    
}

export default CandidateDashboard