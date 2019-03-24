import React, { Component } from 'react';
//import ReactDom from 'react-dom'
import CandidateLogin from './CandidateLogin';
import CandidateDashboard from './CandidateDashboard';

export default class CandidateHome extends Component{

    constructor(props){
        super(props)
        this.state = {
            candidateHash : null,
            username : null
        }
    }

    updateCandidateData = (hash, username) => {
        this.setState({
            candidateHash : hash,
            username : username
        })
       
    }

    render(){

        console.log("CandidateHome")
        return (
            
            <div>
            <h1>This is Candidate Home</h1>
            {this.props.isLogin 
            ? <CandidateDashboard 
                userObject={this.props.userObject}
                candidateHash = {this.state.candidateHash}
                loginUpdate={this.props.loginUpdate}
                username={this.state.username}
                /> 
            : <CandidateLogin 
                userObject={this.props.userObject}
                updateCandidateData = {this.updateCandidateData}
                isLogin={this.props.isLogin}
                loginUpdate={this.props.loginUpdate}
                />
            }

            </div>
        )
    }
}