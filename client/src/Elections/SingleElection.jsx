import React, { Component } from 'react';

export default class SingleElection extends Component{
    constructor(props){
        super(props)
        this.state = {    
            showCandidates : null,
            isShow : false,
            candidateCount : 0
        }
    }

    checkCandidates = async() => {
        
        if(this.state.isShow){
            this.setState({
                isShow : false
            })
        }else{

            const {contract} = this.props.userObject
            let length = 0
            let showCandidates=[];

            await contract.methods.countElectionCandidates(this.props.electionHash[this.props.index]).call()
            .then(res => length = res)
            .catch(console.error)
            
            if(length != 0){
                for(let i=0; i< length; i++){

                    let result = "";
                    await contract.methods.getSelectedCandidates(this.props.electionHash[this.props.index], i).call()
                    .then(res => result = res)
                    .catch(console.error)

                    showCandidates.push(result)
                }
            }else{
                showCandidates = "Candidates are not Nominated yet"
            }
        
            this.setState({
                showCandidates,
                isShow : true,
                candidateCount : length
            })

        }

        
    }

    render(){

        const {item} = this.props;
        console.log(this.state.candidateCount)
        return(
            <div className="electionCardDiv" style={{ border: '2px solid #000'}}>
                <h2>{item.typeOfElection}</h2>
                <h3>{item.organizer}</h3>
                <h4>{item.constituency}</h4>
                <h4>{item.electionDate}</h4>
                <h4>{item.resultDate}</h4>
                <h4>{item.ICRD}</h4>
                <h4>{item.FCRD}</h4>
                <button onClick={this.checkCandidates}>{this.state.isShow ? "Hide Candidate" : "Show Candidate"}</button>
                <div>
                    {(this.state.showCandidates && this.state.isShow) 
                        && this.state.showCandidates
                    }
                    <button className={(parseInt(this.state.candidateCount) && this.state.isShow) ? "show" : "hide"} onClick={this.goToVote}>Vote</button>                    
                </div>
            </div>
        )
    }
}