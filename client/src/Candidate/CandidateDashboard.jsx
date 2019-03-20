import React, { Component } from 'react';
import CandidateNomineeRequest from './CandidateNomineeRequest';

class CandidateDashboard extends Component{

    constructor(props){
        super(props)
        this.state = {
            isCreate : false,
           // OrganizerData : this.props.OragnizerData
        }
    }

    logoutHandler = () => {
        this.props.loginUpdate(false)
    }

    // createHandler = () => {
    //     this.setState({
    //         isCreate : !this.state.isCreate
    //     })
    //     console.log(this.state.isCreate)
    // }

 

    render(){
        console.log("CandidateDashboard")
        return (
            <div>
                <h1>Hi this is Candidate Dashboard</h1>
                <button onClick={this.logoutHandler}>Logout</button>
                <CandidateNomineeRequest userObject={this.props.userObject}/>    
            </div>
        )
    }

    
}

export default CandidateDashboard