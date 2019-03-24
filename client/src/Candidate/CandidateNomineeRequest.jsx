import React, { Component } from 'react';
import ElectionCard from '../Elections/ElectionCard'
import CandidateRequestForm from './CandidateRequestForm'

export default class CandidateNomineeRequest extends Component{

    constructor(props){
        super(props)
        this.state = {
            elections:null,
            isElectionSelected : false,
            selectedElection : null
        }
    }

    componentDidMount = async() => {
        
        let elections = [];
        let length = 0;
        
        await this.props.userObject.contract.methods.electionsCount().call()
        .then(res => length = res)
        .catch(console.error)

        for(let i=0;i<length;i++){

            let result
             await this.props.userObject.contract.methods.getElections(i).call()
            .then(res => result = res)
            .catch(console.error)

            elections.push(result)
        }
       
        this.setState({
            elections
        })

       
    }


    updateElectionState = (value, election) => {
        this.setState({
            isElectionSelected : value,
            selectedElection : election
        })
    }

    initialState = () => {
        this.setState({
            isElectionSelected : false,
            selectedElection : null
        })
    }

  

    render(){

        console.log("CandidateNomineeRequest")
        let hide = {
            display : 'none'
        } 

        let show = {
            display : 'block'
        }
        
        return(
            <div>
                <div style={this.state.isElectionSelected ? hide : show}>
                <h2>This is List of Elections</h2>
                {
                    this.state.elections &&
                    <ul>
                        {this.state.elections.map((item, index) => 
                            <ElectionCard item={item} key={index} updateElectionState={this.updateElectionState}/>
                        )}
                    </ul> 
                }
                </div>
                <div style={this.state.isElectionSelected ? show : hide}>
                    {/* <h2>Here is your Elections</h2> 
                    <h2>{this.state.selectedElection}</h2> */}
                    <CandidateRequestForm 
                        electionHash={this.state.selectedElection} 
                        candidateHash={this.props.candidateHash}
                        username={this.props.username}
                        userObject={this.props.userObject}
                        back={this.initialState}
                    />
                    <button onClick={this.initialState}>Back</button>   
                </div>   
            </div>
        )
    }
}