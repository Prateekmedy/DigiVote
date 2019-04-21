import React, { Component } from 'react';
import { ipfsFetcher } from '../ipfsStore';
import Home from '@material-ui/icons/Home';

export default class Pre_Analysis extends Component{

    constructor(props){
        super(props)
        this.state = {
            totalVoter     : 0,
            totalVoting    : 0,
            Array18To30    : [],
            Array31To50    : [],
            Array51To150   : [],
            candidatesData : []
        }
    }

    componentWillMount = async() => {

        const {contract} = this.props.userObject

        //call for total number of Voter in the Election
        let totalVoter = this.props.selectedElection.election.TotalVoters

        //call for total voting held in Election
        let totalVoting = 0
        await contract.methods.aadhaarCount(this.props.selectedElection.electionHash).call()
        .then(res => totalVoting = res)
        .catch(console.error)

        //calling for the voter age grouping that voted in election
        let Array18To30 = [],
            Array31To50 = [],
            Array51To150 = []

        for(let i=0; i<totalVoting; i++){

            let voterHash
            await contract.methods.getVoterToElection(this.props.selectedElection.electionHash, i).call()
            .then(res => voterHash = res)
            .catch(console.error)

            let voterData = await ipfsFetcher(voterHash)
            let voterAge = new Date().getFullYear() - voterData.DoB.substring(6,10)

            if(voterAge >= 18 && voterAge <= 30)  Array18To30.push(voterAge)
            if(voterAge >= 31 && voterAge <= 50)  Array31To50.push(voterAge)
            if(voterAge >= 51 && voterAge <= 150) Array51To150.push(voterAge)

        }

        //calling for assosiated Election Party Candidate 
        const {candidates} = this.props.selectedElection
        
        let candidatesData = [],
            candidateHash

        for(let i=1; i<candidates.length; i++){
            console.log(candidates[i][0])
            await contract.methods.getCandidatePersonal(candidates[i][0]).call()
            .then(res => candidateHash = res)
            .catch(console.error)

            let candidateData = await ipfsFetcher(candidateHash)

            candidatesData.push(candidateData)

        }
       

        //coding for updating the state of this component
        console.log(`Total Voter ${totalVoter} & Total Voting ${totalVoting}`)

        this.setState({
            totalVoter,
            totalVoting,
            Array18To30,
            Array31To50,
            Array51To150,
            candidatesData
        })
    }

    render(){
        console.log(this.state)
        return(
            <div>
                <h2>Welcome to Pre Result-Analysis Report</h2>
                <h3>Total Voters : {this.state.totalVoter}</h3>
                <h3>Total Voting : {this.state.totalVoting}</h3>
                <h3>Number of Young Voters (18-30) : {this.state.Array18To30.length}</h3>
                <h3>Number of Adult Voters (18-30) : {this.state.Array31To50.length}</h3>
                <h3>Number of Old Age Voters (18-30) : {this.state.Array51To150.length}</h3>
                <Home className="HomeIcon" onClick={() => this.props.updateHomeState(0, null)} />
            </div>
        )
    }
} 