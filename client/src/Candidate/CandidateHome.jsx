import React, { Component } from 'react';
//import ReactDom from 'react-dom'
import CandidateLogin from './CandidateLogin';
import CandidateDashboard from './CandidateDashboard';

export default class CandidateHome extends Component{

    constructor(props){
        super(props)
        this.state = {
            CandidateData : null
        }
    }

    updateCandidateData = (data) => {
        this.setState({
            CandidateData : data
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
                CandidateData = {this.state.CandidateData}
                loginUpdate={this.props.loginUpdate}
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