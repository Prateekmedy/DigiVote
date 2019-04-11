import React, { Component } from 'react';
import { ipfsFetcher } from '../ipfsStore';

export default class Post_Anaylsis extends Component{
    constructor(props){
        super(props)
        this.state = {
            totalVoter : 0,
            totalVoting : 0,
            votersData : [],
            maleVoter : [],
            femaleVoter : [],
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

        //calling for the voters data of election
        let votersData = []

        for(let i=0; i<totalVoting; i++){

            let voterHash
            await contract.methods.getVoterToElection(this.props.selectedElection.electionHash, i).call()
            .then(res => voterHash = res)
            .catch(console.error)

            let voterData = await ipfsFetcher(voterHash)
            votersData.push(voterData)
            //console.log(voterData)
        }

        //calling for seggregation of Gender of the Voters.
        let maleVoter = votersData.filter((voter) => {
            return (voter.Gender == 'M')
        })

        let femaleVoter = votersData.filter((voter) => {
            return (voter.Gender == 'F')
        })

        //calling for seggrigation of Political Parties of the Candidate
        const {candidates} = this.props.selectedElection 
        let totalCandidates = candidates.length,
            candidatesData = []
        
        //looping for fetching the CAndidate paersonal data from its username
        for(let i=0; i< totalCandidates; i++){
            if(candidates[i][0] !== "NOTA"){
                let candidateHash
                await contract.methods.getCandidatePersonal(candidates[i][0]).call()
                .then(res => candidateHash = res)
                .catch(console.error)
    
                let candidateData = await ipfsFetcher(candidateHash)
                candidatesData.push(candidateData)
            }
        }

        //functions for grouping the Candiates from there respective political parties
        const groupBy = key => array =>
            array.reduce((objectsByKeyValue, obj) => {
                const value = obj[key];
                objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
                return objectsByKeyValue;
        }, {});

        //preparing a template function for groupby parties from any array object
        const groupbyParties = groupBy('ElectionParty')
        //preparing the template function for group by constituency(places) of the candidates.
        const groupByConstituency = groupBy(2) 

        //calling that function with candidates data object to group it by the parties
        let candidateByParties = groupbyParties(candidatesData)

        //calling that function with  total numbe of candidates of an election to be group by constituencies
        let candidateByConstituency = groupByConstituency(candidates) 


        console.log(candidateByParties)


        this.setState({
            totalVoter,
            totalVoting,
            votersData,
            maleVoter,
            femaleVoter
        })
    }

    render(){
        return(
            <div>
                Bla Bla
                {
                   // this.state.femaleVoter
                }
            </div>
        )
    }
}