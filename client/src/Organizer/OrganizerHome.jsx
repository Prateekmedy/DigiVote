import React, { Component } from 'react';
import ReactDom from 'react-dom'
import OrganizerLogin from './OrganizerLogin';
import OrganizerDashboard from './OrganizerDashboard';

export default class OrganizerHome extends Component{

    constructor(props){
        super(props)
    }

    render(){

        console.log(this.props)
        return (
            
            <div>
            <h1>This is Organanizers Home</h1>
            {this.props.isLogin 
            ? <OrganizerDashboard 
                loginUpdate = {this.props.loginUpdate}
                /> 
            : <OrganizerLogin 
                contract={this.props.contract} 
                accounts={this.props.accounts} 
                web3={this.props.web3} 
                accountCreator={this.props.accountCreator} 
                acc={this.props.accAddress}
                isLogin = {this.props.isLogin}
                loginUpdate = {this.props.loginUpdate}
                />
            }

            </div>
        )
    }
}