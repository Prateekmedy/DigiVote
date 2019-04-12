import React, { Component } from 'react';
import ElectionCard from '../Elections/ElectionCard'
import Grid from '@material-ui/core/Grid';
import { ipfsFetcher } from '../ipfsStore';

export default class CandidateNomineeRequest extends Component{

    constructor(props){
        super(props)
        this.state = {
            elections:null,
            electionsData : null,
            isElectionSelected : false,
            selectedElection : null,
            newElections : null,
            currentElectionInterval : null
        }
    }

    componentWillMount = async() => {
        
        let elections = [],
            electionsData = [],
            length = 0;
        
        await this.props.userObject.contract.methods.electionsCount().call()
        .then(res => length = res)
        .catch(console.error)

        for(let i=0;i<length;i++){

            let result
             await this.props.userObject.contract.methods.getElections(i).call()
            .then(res => result = res)
            .catch(console.error)

            let electionData = await ipfsFetcher(result)
            elections.push(result)
            electionsData.push(electionData)

        }

        //setting an interval for update the new Election every 5sec 
        let  currentElectionInterval = setInterval(this.updateCurrentElection, 5000)

        this.setState({
            elections,
            electionsData,
            currentElectionInterval
        })

        console.log(this.state.electionsData)
       
    }

    //INterbal function for showing only those Election to the candidate which are now open to register the candidate
    updateCurrentElection = () => {
         
        let newElections = [],
            length = this.state.electionsData.length

        if(length){
            for(let i=0; i< length; i++){

                let ICRD = new Date(this.state.electionsData[i].ICRD)
                let FCRD = new Date(this.state.electionsData[i].FCRD)
    
                if((new Date() >= ICRD) && (new Date() <= FCRD)){
                    newElections.push([this.state.electionsData[i], this.state.elections[i]])
                }
            }
    
            if(newElections.length > 0){
                this.setState({
                    newElections
                })
            }
            
        }
        

        console.log(this.state.newElections)
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

    componentWillUnmount = () => {
        clearInterval(this.state.currentElectionInterval)
        this.setState({
            elections:null,
            electionsData : null,
            isElectionSelected : false,
            selectedElection : null,
            newElections : null,
            currentElectionInterval : null
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
                <Grid 
                container 
                style={{
                  height : "500px",
                  width : "100%"
                }}
                >
                    <div style={this.state.isElectionSelected ? hide : show}>
                    {
                        this.state.newElections &&
                        <Grid container >
                            { this.state.newElections.map((item, index) =>
                                <ElectionCard 
                                    electionData={item[0]} 
                                    key={index} 
                                    updateElectionState={this.updateElectionState}
                                    username={this.props.username} 
                                    userObject={this.props.userObject}  
                                    electionHash={item[1]} 
                                    candidateHash={this.props.candidateHash}
                                />
                            )}
                        </Grid> 
                    }
                    </div>
                </Grid>
            </div>
        )
    }
}