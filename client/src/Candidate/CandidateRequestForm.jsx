import React, {Component} from 'react';
import { ipfsFetcher } from '../ipfsStore';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';


export default class CandidateRequestForm extends Component{

    constructor(props){
        super(props)
        this.state = {
            isAgree : false,
            inputPlace : null,
            RequestHash : null,
            electionData : null,
            candidateData : null
        }
    }

    componentWillMount = async() => {

        this.setState({ loaderStart : true })

        let electionData = await ipfsFetcher(this.props.electionHash)
        let candidateData = await ipfsFetcher(this.props.candidateHash)

        this.setState({
            electionData, candidateData, loaderStart : false
        })

    }

    updatePlace = (evt) => this.setState({ inputPlace : evt.target.value})

    updateIsAgree = (evt) => this.setState({ isAgree : evt.target.checked})

    sendRequest = async(event) => {

        this.setState({ loaderStart : true })

        event.preventDefault();
        console.log("request sended")

        const {contract, accounts} = this.props.userObject;
        
        let date= new Date() + "";
        console.log(date)

        await contract.methods.setRequest(this.props.username, this.props.electionHash, date, this.state.inputPlace, "Requested").send({from: accounts[2],gas:6721975})
        .then((receipt) => {
          console.log(receipt)
          alert("Thank You for Sending Request")

          this.setState({ loaderStart : false })
          this.props.updateForm();
          
        })
        .catch((error) => {
          console.log(error)
        });

        

    }

    render(){
        return (
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
                <Paper 
                    elevation={5}
                    className="ElectionRequestForm"
                >
                <Grid container>
                <Grid container item xs={12}>
                    <Grid item xs={6}>
                        <Paper elevation={10} className="ElectionSection">
                        <Typography varient="h1" className="ElectionFormHeader" color="textPrimary">
                           <center> Election Details</center>
                        </Typography>
                        {
                            this.state.electionData &&
                                <Typography  color="textPrimary">
                                    <strong>Election Type</strong>                   : {this.state.electionData.typeOfElection} <br />
                                    <strong>Organizer</strong>                       : {this.state.electionData.organizer} <br />
                                    <strong>Constituency</strong>                    : {this.state.electionData.constituency} <br />
                                    <strong>Total Voters</strong>                    : {this.state.electionData.TotalVoters} <br />
                                    <strong>Election Date</strong>                   : {this.state.electionData.electionStartDateNTime.substring(0, 24)} <br />
                                    <strong>Result Date</strong>                     : {this.state.electionData.resultDate.substring(0, 24)} <br />
                                    <strong>Candiate Registration Last Date</strong> : {this.state.electionData.FCRD.substring(0, 24)} <br />
                                </Typography>
                        }
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper elevation={10} className="CandidateSection">
                        <Typography varient="h1"  className="ElectionFormHeader" color="textPrimary">
                            <center>Candidate Details</center>
                        </Typography>
                        {
                            this.state.candidateData &&
                                <Typography  color="textPrimary">
                                    <strong>Username</strong>        : {this.state.candidateData.Username} <br />
                                    <strong>Name</strong>            : {this.state.candidateData.Name} <br />
                                    <strong>Election Party</strong>  : {this.state.candidateData.ElectionParty} <br />
                                    <strong>Mobile</strong>          : {this.state.candidateData.Mobile} <br />
                                    <strong>Constituency</strong>    : {this.state.candidateData.constituency} <br />
                                </Typography>
                        }
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container
                    item 
                    xs={12}
                    direction="row"
                    justify="center"
                    alignItems="center"
                >
                    <Grid item xs={6}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.isAgree}
                                onChange={evt => this.updateIsAgree(evt)}
                                label = "Agree with Details"
                                value="Agree with Details"
                            />
                        }
                        label="Agree with Details"
                        />
                        
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                              required
                              name="Place"
                              id="Place"
                              label="Place"
                              value={this.state.inputPlace}
                              onChange={evt => this.updatePlace(evt)}
                              margin="normal"
                        />
                    </Grid>
                </Grid>
                <Grid 
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                >
                {
                    this.state.isAgree 
                        && <Button 
                                variant="contained"     
                                color="primary"
                                onClick={this.sendRequest}
                            >
                            Submit
                            </Button>  

                } 
                </Grid>
                </Grid>
                </Paper>
            </div>
        )
    }
}