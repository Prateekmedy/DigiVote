import React, { Component } from 'react';

export default class SingleElection extends Component{
    constructor(props){
        super(props)
        this.state = {    
            showCandidates : null,
            isShow : false
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
                isShow : true
            })

        }

        
    }

    render(){

        const {item} = this.props;

        return(
            <div className="electionCardDiv">
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
                </div>
            </div>
        )
    }
}