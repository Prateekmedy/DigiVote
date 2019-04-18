import React, { Component } from 'react';
import {ipfsSender} from '../ipfsStore'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import "../App.css"

export default class OrganizeElection extends Component {

    constructor(props){
        super(props)
        this.state = {
            ElectionHash : null,
            ElectionData : null,
            ICRD : null,
            FCRD : null,
            RD : null,
            ESD : null,
            EED : null,
            ToE : "",
            constituency : "",
            organizer : "",
            totalVotes : 0,
            loaderStart : false
        }
    }

    createElection = async(event) => {

      this.setState({ loaderStart : true })
      event.preventDefault()
      //Checking the entry for the empty 
      if(((this.state.ESD && this.state.EED && this.state.RD && this.state.ICRD && this.state.FCRD) == null) && ((this.state.ToE && this.state.organizer && this.state.constituency) == "") && (this.state.totalVotes == 0) ){
        
        alert("Please Enter Something !!")
        this.setState({ loaderStart : false })

      }else{

          console.log(this.state)

          const {contract, OrganizerData, back, accounts} = this.props;
        // console.log(OrganizerData)
          const ElectionData = {
              typeOfElection : this.state.ToE,
              constituency   : this.state.constituency,
              organizer      : this.state.organizer,
              electionStartDateNTime   : this.state.ESD.toString(), //"mm-dd-yyyy hh:ii"
              electionEndDateNTime   : this.state.EED.toString(),
              resultDate     : this.state.RD.toString(),
              ICRD           : this.state.ICRD.toString(),
              FCRD           : this.state.FCRD.toString(),
              TotalVoters    : this.state.totalVotes
          }
          
          let ElectionHash = await ipfsSender(ElectionData);
          console.log(ElectionHash);
          console.log(ElectionData)

          await contract.methods.addElection(OrganizerData.Address, ElectionHash).send({from: accounts[2],gas:6721975})
          .then((result) => {
            console.log(result)
          })
          .then(console.log)
          .catch((error) => {
            console.log(error)
          });

          //add an NOTA CAndidate into the new election
          await contract.methods.addCandidate(ElectionHash, "NOTA", "anywhere").send({from: accounts[2],gas:6721975})
          .then((receipt) => {
            console.log(receipt)
          })
          .catch((error) => {
            console.log(error)
          });
      
          await contract.methods.getElection(OrganizerData.Address, 0).call()
          .then(console.log)
          .catch(console.error)

          this.setState({ loaderStart : false })

          alert("Thank you for Organize Election")
          back();

      }  
    }   

    updateToE = (evt) => this.setState({ ToE : evt.target.value })

    updateConstituency = (evt) => this.setState({ constituency : evt.target.value })

    updateOrganizer = (evt) => this.setState({ organizer : evt.target.value })

    updateTotalVotes = (evt) => this.setState({ totalVotes : evt.target.value })

    updateESD = (val) => this.setState({ ESD : val })

    updateEED = (val) => this.setState({ EED : val })
 
    updateRD = (val) => this.setState({ RD : val })

    updateICRD = (val) => this.setState({ ICRD : val })

    updateFCRD = (val) => this.setState({ FCRD : val })

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
                <Grid 
                container 
                direction="row"
                justify="center"
                alignItems="center"
                style={{
                  height : "500px",
                  width : "100%"
                }}
                >
                  <Paper 
                    elevation={5}
                    className="ElectionRegister"
                  >
                    <Typography variant="h4" gutterBottom>Election Register</Typography>
                      <Grid container>
                        <Grid item xs={12} container>
                          <Grid item xs={4}>
                            <TextField
                              required
                              name="typeOfElection"
                              id="typeOfElection"
                              label="Election Type"
                              value={this.state.ToE}
                              onChange={evt => this.updateToE(evt)}
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <TextField
                              required
                              name="Organizer"
                              id="Organizer"
                              label="Organizer"
                              value={this.state.organizer}
                              onChange={evt => this.updateOrganizer(evt)}
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <TextField
                              required
                              name="Constituency"
                              id="Constituency"
                              label="Constituency"
                              value={this.state.constituency}
                              onChange={evt => this.updateConstituency(evt)}
                              margin="normal"
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} container >
                          <Grid item xs={6}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <Grid container className="DateNTimeCenter">
                                <DatePicker
                                  required
                                  margin="normal"
                                  label="Election Starts Date"
                                  value={this.state.ESD}
                                  onChange={this.updateESD}
                                  className="DateNTime"
                                />
                                <TimePicker
                                  required
                                  margin="normal"
                                  label="Election Starts Time"
                                  value={this.state.ESD}
                                  onChange={this.updateESD}
                                  className="DateNTime"
                                />
                              </Grid>
                            </MuiPickersUtilsProvider>
                          </Grid>
                          <Grid item xs={6}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <Grid container className="DateNTimeCenter">
                                <DatePicker
                                  required
                                  margin="normal"
                                  label="Election Ends Date"
                                  value={this.state.EED}
                                  onChange={this.updateEED}
                                  className="DateNTime"
                                />
                                <TimePicker
                                  required
                                  margin="normal"
                                  label="Election Ends Time"
                                  value={this.state.EED}
                                  onChange={this.updateEED}
                                  className="DateNTime"
                                />
                              </Grid>
                            </MuiPickersUtilsProvider>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} container >
                          <Grid item xs={6}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <Grid container className="DateNTimeCenter">
                                <DatePicker
                                  required
                                  margin="normal"
                                  label="Cand Reg. StartDate"
                                  value={this.state.ICRD}
                                  onChange={this.updateICRD}
                                  className="DateNTime"
                                />
                                <TimePicker
                                  required
                                  margin="normal"
                                  label="Cand Reg. StartTime"
                                  value={this.state.ICRD}
                                  onChange={this.updateICRD}
                                  className="DateNTime"
                                />
                              </Grid>
                            </MuiPickersUtilsProvider>
                          </Grid>
                          <Grid item xs={6}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <Grid container className="DateNTimeCenter">
                                <DatePicker
                                  required
                                  margin="normal"
                                  label="Cand Reg. EndsDate"
                                  value={this.state.FCRD}
                                  onChange={this.updateFCRD}
                                  className="DateNTime"
                                />
                                <TimePicker
                                  required
                                  margin="normal"
                                  label="Cand Reg. EndsTime"
                                  value={this.state.FCRD}
                                  onChange={this.updateFCRD}
                                  className="DateNTime"
                                />
                              </Grid>
                            </MuiPickersUtilsProvider>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} container>
                          <Grid item xs={6}>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <Grid container className="DateNTimeCenter">
                                <DatePicker
                                  required
                                  margin="normal"
                                  label="Result Date"
                                  value={this.state.RD}
                                  onChange={this.updateRD}
                                  className="DateNTime"
                                />
                                <TimePicker
                                  required
                                  margin="normal"
                                  label="Result Time"
                                  value={this.state.RD}
                                  onChange={this.updateRD}
                                  className="DateNTime"
                                />
                              </Grid>
                            </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                required
                                name="TotalVotes"
                                id="TotalVotes"
                                label="Total Votes"
                                value={this.state.totalVotes}
                                onChange={evt => this.updateTotalVotes(evt)}
                                margin="normal"
                                type="number"
                              />
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Button 
                            variant="contained" 
                            color="primary"
                            style={{
                              margin:"5px"
                            }}
                            onClick={this.createElection}
                          >Create</Button>
                        </Grid>  
                      </Grid>
                  </Paper>
              </Grid>
            </div>
              
        )
    }
}