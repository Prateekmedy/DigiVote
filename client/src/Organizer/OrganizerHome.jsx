import React, { Component } from 'react';
//import ReactDom from 'react-dom'
import OrganizerLogin from './OrganizerLogin';
import OrganizerDashboard from './OrganizerDashboard';
import {ipfsFetcher} from '../ipfsStore'

export default class OrganizerHome extends Component{

    constructor(props){
        super(props)
        this.state = {
            OrganizerData : null
        }
    }

    updateOrganizerData = (data) => {
        console.log(data)
        this.setState({
            OrganizerData : data
        })
    }

    render(){


        console.log("OrganizerHome")
        console.log(this.state.OrganizerData)
        return (
            <div >
                {   this.props.isLogin 
                        ? <OrganizerDashboard 
                            userObject={this.props.userObject}
                            OrganizerData = {this.state.OrganizerData}
                            loginUpdate={this.props.loginUpdate}
                            /> 
                        : <OrganizerLogin 
                            userObject={this.props.userObject}
                            updateOrganizerData = {this.updateOrganizerData}
                            loginUpdate={this.props.loginUpdate}
                            updateHomeState={this.props.updateHomeState}
                            />
                }
            </div>
        )
    }
}