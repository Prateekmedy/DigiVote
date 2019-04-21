import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Home from '@material-ui/icons/Home';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import {ipfsFetcher} from '../ipfsStore'

export default class ResultCard extends Component{

    constructor(props){
        super(props)
        this.state = {
            loaderStart : false,
            condidates : [],
            candidateByConstituency : null,
            PartiesVote : [],
            winParty : null
        }
    }

    componentWillMount = async() => {
        this.setState({ loaderStart : true })

        const {contract} = this.props.userObject

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

        //Calculating PartiesVote
        let candidateByPartiesLength = Object.keys(candidateByParties).length
        let PartiesVote = []

        for(let i=0;i<candidateByPartiesLength;i++){
  
            let innerArray = []
            let votes =  0,
                key = Object.keys(candidateByParties)[i]
            
            innerArray.push(Object.keys(candidateByParties)[i])
            for(let j=0;j<candidateByParties[key].length;j++){

               let candidate = candidateByParties[key][j]
                
                candidates.forEach(element => {
                    if(element[0] == candidate.Username){
                        votes = votes + parseInt(element[1])
                    }
                });
            }
            
            innerArray.push(votes)

            PartiesVote.push(innerArray)
        }

        let totalVotes = parseInt(this.props.selectedElection.election.TotalVoters)
        let winningTotal = totalVotes/2

        PartiesVote.sort(function(a,b){
            return b[1] - a[1];
        });

        if((PartiesVote[0][1] >= winningTotal) || (PartiesVote[0][1] > 0)){
            this.setState({ winParty : PartiesVote[0][0] })
        }

        let newArray = Object.entries(candidateByConstituency)

        this.setState({ PartiesVote, candidateByConstituency : newArray, loaderStart : false })

    }

    render(){
        console.log(this.props)
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
                  direction="row"
                  justify="center"
                  alignItems="center"
                  className="ResultBack"
              >
                <Grid item xs={12}>
                    <Paper 
                          elevation={2}
                          className="ElectionHeader"
                    >
                        <Typography variant="h4" gutterBottom>Election Result</Typography>
                    </Paper>
                </Grid>
                <Grid container className="ResultBody">
                <Grid container spacing={16}>
                    <Grid item xs={12}>
                    <Grid container  justify="center" spacing={32}>
                        {this.state.PartiesVote.map((party, index)  => (
                        <Grid key={index} item>
                             <Card className={ party[0] === this.state.winParty ? "ResultCardWin" : "ResultCard" }>
                                <CardContent>
                                <Typography variant="h5" className="PartyName" color="textPrimary" gutterBottom>
                                    {party[0]}
                                </Typography>
                                <Typography variant="h4" className="PartyVote" color="textPrimary" gutterBottom>
                                    {party[1]}
                                </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        ))}
                    </Grid>
                    </Grid>
                </Grid>
                <Grid container spacing={16}>
                    <Grid item xs={12}>
                    <Grid container  justify="center" spacing={16} className="CRGrid">
                        {
                            this.state.candidateByConstituency &&
                                this.state.candidateByConstituency.map((cons, index)  => (
                                    <Grid key={index} item xs={12}>
                                        <ExpansionPanel className="ConstituencyResult">
                                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography variant="h6">{cons[0] == "anywhere" ? "NOTA" : cons[0]} Result</Typography>
                                            </ExpansionPanelSummary>
                                            <ExpansionPanelDetails>
                                            <Grid container  justify="center" spacing={12}> 
                                                {
                                                    cons[1].map((candidate, index)=>
                                                        <Grid key={index} container item xs={12}>
                                                            <Grid item xs={6}>
                                                                <Typography variant="subtitle1" className="CandidateName" color="textPrimary" gutterBottom>
                                                                    {candidate[0]}
                                                                </Typography> 
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <Typography variant="subtitle1" className="CandidateVote" color="textPrimary" gutterBottom>
                                                                    {candidate[1]}
                                                                </Typography>
                                                            </Grid>
                                                            <hr />
                                                        </Grid>
                                                    )
                                                }
                                            </Grid>
                                            </ExpansionPanelDetails>
                                        </ExpansionPanel>
                                    </Grid>
                                    ))
                        }
                    </Grid>
                    </Grid>
                </Grid>
                </Grid>
                <Home className="HomeIcon" style={{ color: "#fff"}} onClick={() => this.props.updateHomeState(0, null)} />
            </Grid>
            </div>
        )
    }
}