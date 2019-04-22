import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Home from '@material-ui/icons/Home';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Chart } from "react-google-charts";
import { ipfsFetcher } from '../ipfsStore';

export default class Pre_Analysis extends Component{

    constructor(props){
        super(props)
        this.state = {
            totalVoter     : 0,
            totalVoting    : 0,
            Array18To30    : [],
            Array31To50    : [],
            Array51To150   : [],
            candidatesData : [],
            candidateByParties : []
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

        //functions for grouping the Candiates from there respective political parties
        const groupBy = key => array =>
            array.reduce((objectsByKeyValue, obj) => {
                const value = obj[key];
                objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
                return objectsByKeyValue;
        }, {});

        //preparing a template function for groupby parties from any array object
        const groupbyParties = groupBy('ElectionParty')
        // //preparing the template function for group by constituency(places) of the candidates.
        // const groupByConstituency = groupBy(2) 

        //calling that function with candidates data object to group it by the parties
        let candidateByParties = groupbyParties(candidatesData)

        // //calling that function with  total numbe of candidates of an election to be group by constituencies
        // let candidateByConstituency = groupByConstituency(candidates) 

        let newArray = Object.entries(candidateByParties)

        this.setState({
            totalVoter,
            totalVoting,
            Array18To30,
            Array31To50,
            Array51To150,
            candidatesData,
            candidateByParties : newArray
        })
    }

    render(){
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
                    <Typography variant="h4" gutterBottom>Pre Election Report</Typography>
                </Paper>
            </Grid>
            <Grid container className="ResultBody">
            <Grid container spacing={16}>
                <Grid item xs={12}>
                {
                    this.state.totalVoter
                        && <Grid container  justify="center" spacing={32}>
                                <Grid item>
                                    <Chart
                                        width={'300px'}
                                        height={'300px'}
                                        chartType="PieChart"
                                        data={[
                                            ['Election', "Voter's Age"],
                                            ['Young Voters (18-30)', this.state.Array18To30.length],
                                            ['Adult Voters (31-50)', this.state.Array31To50.length],
                                            ['Old Age Voters (18-30)', this.state.Array51To150.length]
                                        ]}
                                        options={{
                                            title: 'Age Group Voter Percentage',
                                            // Just add this option
                                            pieHole: 0.6,
                                        }}
                                    />
                                </Grid>
                                <Grid item>
                                        <Chart
                                            width={'300px'}
                                            height={'300px'}
                                            chartType="PieChart"
                                            data={[
                                                ['Election', 'Votes'],
                                                ['Non Voters', (this.state.totalVoter-this.state.totalVoting)],
                                                ['Voting', this.state.totalVoting]
                                            ]}
                                            options={{
                                                title: 'Total Voting Percentage',
                                                // Just add this option
                                                pieHole: 0.6,
                                            }}
                                    />
                                </Grid>  
                        </Grid>
                }
                </Grid>
            </Grid>
            <Grid container spacing={16} style={{ marginTop : "50px", marginBottom : "50px"}}>
                <Grid item xs={12}>
                <Grid container  justify="center" spacing={32}>
                    {this.state.candidateByParties.map((party, index)  => (
                    <Grid key={index} item xs={4}>
                         <ExpansionPanel className="PartyCategory">
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Grid container  justify="center" > 
                                <Grid item xs={12}>
                                    <Typography variant="h6">{party[0]}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2">Nominated Candidates</Typography>
                                </Grid>
                            </Grid>                                               
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                            <Grid container  justify="center" > 
                               {
                                   party[1].map((candidate, index)=>
                                    <Grid container key={index} item xs={12}>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle1" className="CandidateName" color="textPrimary" gutterBottom>
                                                {candidate.Name}
                                            </Typography> 
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle1" className="CandidateVote" color="textPrimary" gutterBottom>
                                                {candidate.constituency}
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
                    ))}
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