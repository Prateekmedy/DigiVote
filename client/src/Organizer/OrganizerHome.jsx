import React, { Component } from 'react';
//import ReactDom from 'react-dom'
import OrganizerLogin from './OrganizerLogin';
import OrganizerDashboard from './OrganizerDashboard';
import {ipfsFetcher} from '../ipfsStore'

export default class OrganizerHome extends Component{

    constructor(props){
        super(props)
        this.state = {
            OrganizerData : null,
            username : ""
        }
    }

    findUsername = async(Hash) => {
        let username = await ipfsFetcher(Hash)
        this.setState({
            username
        })
    }
    updateOrganizerData = (data) => {

        this.findUsername(data)

        this.setState({
            OrganizerData : data
        })
    }

    render(){


        console.log("OrganizerHome")
        return (
            <div >
                {   true //this.props.isLogin 
                        ? <OrganizerDashboard 
                            userObject={this.props.userObject}
                            OrganizerData = {this.state.OrganizerData}
                            loginUpdate={this.props.loginUpdate}
                            username = {this.state.username}
                            /> 
                        : <OrganizerLogin 
                            userObject={this.props.userObject}
                            updateOrganizerData = {this.updateOrganizerData}
                            loginUpdate={this.props.loginUpdate}
                            />
                }
            </div>
        )
    }
}