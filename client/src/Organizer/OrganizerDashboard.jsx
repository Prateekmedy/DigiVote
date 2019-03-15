import React, { Component } from 'react';

class OrganizerDashboard extends Component{

    constructor(props){
        super(props)
    }

    logoutHandler = () => {
        this.props.loginUpdate(false)
    }

    render(){
        return (
            <div>
                <h1>Hi this is Organizer Dashboard</h1>
                <button onClick={this.logoutHandler}>Logout</button>
            </div>
        )
    }

    
}

export default OrganizerDashboard