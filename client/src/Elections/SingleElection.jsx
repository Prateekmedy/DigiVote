import React, { Component } from 'react'
import { resolve } from 'multiaddr';

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
            
            if((length - 1)  != 0){
                //console.log("yaha aaraha hai kya")
                for(let i=0; i< length; i++){

                    let result = "";
                    await contract.methods.getSelectedCandidates(this.props.electionHash[this.props.index], i).call()
                    .then(res => result = res)
                    .catch(console.error)
                   
                    showCandidates.push(result)
                }
                //console.log(showCandidates[0])

            }else{
                showCandidates = [["Candidates are not Nominated yet", 0]]
                //console.log("ye aana chahiye")
                
            }
        
            this.setState({
                showCandidates,
                isShow : true,
                candidateCount : length - 1 
            })
            

        }

        
    }

    goToVote = async() => {
        console.log("move to Voting Home")
        const {contract} = this.props.userObject

        let TotalVoters = 0
        await contract.methods.aadhaarCount(this.props.electionHash[this.props.index]).call()
        .then(res => TotalVoters = res)
        .catch(console.error)


        //condition for checking that all thr voter are voted or not 
        if(TotalVoters < this.props.item.TotalVoters){

            let selectedElection = {
                electionHash : this.props.electionHash[this.props.index],
                election     : this.props.item,
                candidates   : this.state.showCandidates
            }

            this.props.updateHomeState(3, selectedElection)

        }else{

            console.log("Total Voter count exceeds")
            alert("All Voters are already Voted!")

        }
        
        
    }

    openResult = async() => {

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

        let selectedElection = {
            electionHash : this.props.electionHash[this.props.index],
            election     : this.props.item,
            candidates   : showCandidates
        }

        this.props.updateHomeState(4, selectedElection)
    }

    openPreReport = async() => {

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


        let selectedElection = {
            electionHash : this.props.electionHash[this.props.index],
            election     : this.props.item,
            candidates   : showCandidates
        }

        //console.log(selectedElection.candidates[0])
        this.props.updateHomeState(5, selectedElection)
    }

    render(){
        const {item} = this.props;
        console.log(this.state.showCandidates)
        return(
                <div className="electionCardDiv" style={{ border: '2px solid #000'}}>
                    <h2>{item.typeOfElection}</h2>
                    <h3>{item.organizer}</h3>
                    <h4>{item.constituency}</h4>
                    <h4>{item.electionDate}</h4>
                    <h4>{item.resultDate}</h4>
                    <h4>{item.ICRD}</h4>
                    <h4>{item.FCRD}</h4>
                    <button onClick={this.openPreReport}>Pre Report</button>
                    <button onClick={this.openResult}>Result</button>
                    <button onClick={this.checkCandidates}>{this.state.isShow ? "Hide Candidate" : "Show Candidate"}</button>
                    <div>
                        {(this.state.showCandidates && this.state.isShow) 
                            && this.state.showCandidates.map((candidate, index) => 
                                <div key={index}>
                                    {candidate[0]}
                                </div>
                                )
                        }
                        <button className={(parseInt(this.state.candidateCount) && this.state.isShow) ? "show" : "hide"} onClick={this.goToVote}>Vote</button>                    
                    </div>
                </div>     
        )
    }
}