import React, { Component } from 'react';
import ElectionCard from '../Elections/ElectionCard'
import Grid from '@material-ui/core/Grid';
import { ipfsFetcher } from '../ipfsStore';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';

export default class CandidateNomineeRequest extends Component{

    constructor(props){
        super(props)
        this.state = {
            elections:null,
            electionsData : null,
            isElectionSelected : false,
            selectedElection : null,
            newElections : null,
            currentElectionInterval : null,
            candidateRequestCount : 0,
            candidateRequestElection : null,
            loaderStart : null
        }
    }

    componentWillMount = async() => {

        this.setState({ loaderStart : true })
        
        const {contract} = this.props.userObject
        let elections = [],
            electionsData = [],
            length = 0;
        
        await contract.methods.electionsCount().call()
        .then(res => length = res)
        .catch(console.error)

        for(let i=0;i<length;i++){

            let result
             await contract.methods.getElections(i).call()
            .then(res => result = res)
            .catch(console.error)

            let electionData = await ipfsFetcher(result)
            elections.push(result)
            electionsData.push(electionData)

        }

        //setting an interval for update the new Election every 5sec 
        let  currentElectionInterval = setInterval(this.updateCurrentElection, 5000)


        let candidateRequestCount = 0,
            candidateRequestElection = []

        await contract.methods.candidateRequestsCount(this.props.username).call()
        .then(res => candidateRequestCount = res)
        .catch(console.error)

        for(let i=0;i<candidateRequestCount;i++){

            let requestObject
            await contract.methods.getRequest(this.props.username, i).call()
            .then(res => requestObject = res)
            .catch(console.error)

            candidateRequestElection.push(requestObject[1])
        }

        this.setState({
            elections,
            electionsData,
            currentElectionInterval,
            candidateRequestCount,
            candidateRequestElection,
            loaderStart : false
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
                <Fade
                    in={this.state.loaderStart === true}
                    unmountOnExit
                >
                    <Grid 
                        container 
                        direction="row"
                        justify="center"
                        alignItems="center"
                        className="loaderDiv1"
                    >
                        <CircularProgress className="loader"/>
                    </Grid>
                </Fade>
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
                                    candidateRequestElection={this.state.candidateRequestElection}
                                    candidateRequestCount={this.state.candidateRequestCount}
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