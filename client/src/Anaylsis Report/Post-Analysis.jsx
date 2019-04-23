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
import { Chart } from "react-google-charts";
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
            candidatesData : [],
            loaderStart : false,
            winParty : null,
            PartiesVote : []
        }
    }

    componentWillMount = async() => {

        this.setState({ loaderStart : true })
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

        for(let i=0;i<newArray.length;i++){
                newArray[i][1].sort(function(a,b){
                    return b[1] - a[1];
                })
            
        }

        // console.log(candidatesData)
        // console.log(candidateByParties)
        // console.log(PartiesVote)
        // console.log(newArray)


        this.setState({
            totalVoter,
            totalVoting,
            votersData,
            maleVoter,
            femaleVoter,
            loaderStart : false,
            PartiesVote,
            candidateByConstituency : newArray
        })
    }

    render(){
        console.log(this.state.PartiesVote)
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
                        <Typography variant="h4" gutterBottom>Post Election Report</Typography>
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
                                                ['Election', 'Gender Voters'],
                                                ['Male Voters', this.state.maleVoter.length],
                                                ['Female Voters', this.state.femaleVoter.length]
                                            ]}
                                            options={{
                                                title: 'Gender Voter Percentage',
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
                                                    ['Election', 'Total Voting Percentage'],
                                                    ['Non Voters', (this.state.totalVoter - this.state.totalVoting)],
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
                                    {
                                        cons[0] !== "anywhere" 
                                            &&  <ExpansionPanel className="ConstituencyResult">
                                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Typography variant="h6">{cons[0] == "anywhere" ? "NOTA" : cons[0]} Constituency Winner</Typography>                                           
                                                </ExpansionPanelSummary>
                                                <ExpansionPanelDetails>
                                                <Grid container  justify="center" > 
                                                   
                                                            <Grid container item xs={12} style={{ "background" : "#64dd17", "color" : "#fff" }}>
                                                                <Grid item xs={6}>
                                                                    <Typography variant="subtitle1" className="CandidateName" color="textPrimary" gutterBottom>
                                                                        {cons[1][0][0]}
                                                                    </Typography> 
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <Typography variant="subtitle1" className="CandidateVote" color="textPrimary" gutterBottom>
                                                                        {cons[1][0][1]}
                                                                    </Typography>
                                                                </Grid>
                                                                <hr />
                                                            </Grid>
                                                        
                                                </Grid>
                                                </ExpansionPanelDetails>
                                                </ExpansionPanel>
                                    }
                                        
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