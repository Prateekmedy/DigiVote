import React, { Component } from 'react';
import OrganizerHome from './Organizer/OrganizerHome'
import CandidateHome from './Candidate/CandidateHome'
import VoterHome from './Voter/VoterHome'
import ElectionList from './Elections/ElectionList';
import ResultCard from './Elections/ResultCard';
import Pre_Analysis from './Anaylsis Report/Pre-Anaylsis';
import Post_Anaylsis from './Anaylsis Report/Post-Analysis';

export default class Home extends Component{

    constructor(props){
        super(props)
        this.state = {
            val : 0,
            userObject : null,
            selectedElection : null
        }
    }

    componentWillMount(){
        const userObject = {
            contract        :   this.props.contract, 
            accounts        :   this.props.accounts,
            web3            :   this.props.web3, 
            accountCreator  :   this.props.accountCreator, 
            acc             :   this.props.accAddress
        }

        this.setState({
            userObject
        })
    }

    updateResetAll = () => {
        this.setState({
            val : 0,
            selectedElection : null 
        })
    }

    updateHomeState = (val, selectedElection) => {
        this.setState({
            val, selectedElection
        })
    }

    

    render(){
        console.log("HomePage")
       
        let Option = "";

        switch(this.state.val){
            case 1 : Option = <OrganizerHome 
                                    isLogin={this.props.isLogin} 
                                    loginUpdate={this.props.loginUpdate} 
                                    userObject={this.state.userObject} 
                                />
            break;
            case 2 : Option = <CandidateHome isLogin={this.props.isLogin} loginUpdate={this.props.loginUpdate} userObject={this.state.userObject}/>
            break;
            case 3 : Option = <VoterHome  
                                    userObject={this.state.userObject}
                                    selectedElection={this.state.selectedElection}
                                    updateHomeState={this.updateHomeState}
                                    acc={this.props.acc}
                                    accountCreator={this.props.accountCreator}
                                    updateResetAll={this.updateResetAll}
                                />
            break;
            case 4 : Option = <ResultCard 
                                    userObject={this.state.userObject}
                                    selectedElection={this.state.selectedElection}
                                />
            break;
            case 5 : Option = <Pre_Analysis 
                                    userObject={this.state.userObject}
                                    selectedElection={this.state.selectedElection}
                                />
            break;
            case 6 : Option = <Post_Anaylsis
                                    userObject={this.state.userObject}
                                    selectedElection={this.state.selectedElection}
                                />
            break;
            default : Option = <ElectionList 
                                    userObject={this.state.userObject} 
                                    updateHomeState={this.updateHomeState}
                                /> 
        }

        return(
            <div>
                {/* <h1>This is Home Page</h1> */}
                <button onClick={() => { this.setState({val:0})}}>Home</button>
                <button onClick={() => { this.setState({val:1})}}>Organize</button>
                <button onClick={() => { this.setState({val:2})}}>Candidate</button>
                {/* <button onClick={() => { this.setState({val:3})}}>Voter</button> */}
                { Option }
            </div>
        )
    }
}