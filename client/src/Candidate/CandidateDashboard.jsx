import React, { Component } from 'react';
//import CandidateElection from './CandidateElection';

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
                {/* <button onClick={this.createHandler}>Create Election</button>
                {this.state.isCreate 
                    && <OrganizeElection 
                            createHandler={this.createHandler} 
                            contract= {this.props.contract}
                            OrganizerData = {this.props.OrganizerData}
                        />
                }      */}
            </div>
        )
    }

    
}

export default CandidateDashboard