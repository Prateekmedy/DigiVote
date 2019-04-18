import React, { Component } from 'react';
import CandidateRequestForm from '../Candidate/CandidateRequestForm'
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AccountBalance from '@material-ui/icons/AccountBalance'
import Modal from '@material-ui/core/Modal';
import '../App.css';

export default class ElectionCard extends Component{

    constructor(props){
        super(props)
        this.state = {
            electionData : this.props.electionData,
            electionHash : this.props.electionHash,
            isFormOpen : false, //flase it after debugging
            isPresent : false
        }
    }

    componentDidMount = () => {

        let isPresent
        
        this.props.candidateRequestElection.forEach((election) => {
            if(election === this.props.electionHash){
                isPresent = true
            }
        })

        this.setState({ isPresent })
    }

    openRequest = async() => {
        //console.log(this.state.item);
        const {contract} = this.props.userObject

        //check whether the CAndidate is already nominated for this election or not
        let length = 0
        await contract.methods.countElectionCandidates(this.props.electionHash).call()
        .then(res => length = res)
        .catch(console.error)

        if(length !== 0){

            let userFounded = false

            for(let i=0; i<length; i++){

                let result
                await contract.methods.getSelectedCandidates(this.props.electionHash, i).call()
                .then(res => result = res)
                .catch(console.error)

                if(result[0] == this.props.username){
                    userFounded = true
                    break
                }
            }

            if(userFounded){
                console.log("this candidate is Already Nominated at this Election")
                alert("Sorry You are Already Nominated for this Election")
            }else{
                //this.props.updateElectionState(true, this.state.electionHash)
                this.setState({
                    isFormOpen : true
                })
            }

        }else{
            // this.props.updateElectionState(true, this.state.electionHash)
            this.setState({
                isFormOpen : true
            })
        }
   
    }

    updateForm = () => this.setState({ isFormOpen : false})

    render(){
        console.log("Election Card")

        return (
            <div>
                <Card className="RequestCard" elevation={5}>
                    <CardContent>
                      <Typography varient="h4">
                        {this.props.electionData.typeOfElection}
                      </Typography>
                      <Typography className="RequestCardText2">
                        {this.props.electionData.constituency}
                      </Typography>
                      <AccountBalance className="ABIcon" />
                      <Typography varient="h4" className="RequestCardText3">
                        {this.props.electionData.organizer}
                      </Typography>
                      <Typography varient="h6" className="RequestCardText4" color="textSecondary">
                        {this.props.electionData.FCRD.substring(0, 24)}
                      </Typography>
                    </CardContent>
                    <CardActions style={{ marginTop : "-13px"}}>
                    <Grid 
                        container 
                        direction="row"
                        justify="center"
                        alignItems="center" >
                    <Button 
                      color="primary" 
                      variant="outlined" 
                      size="small" 
                      className={this.state.isPresent ? "hide" : "show"}
                      onClick={this.openRequest} 
                    >
                      Request It
                    </Button>
                    </Grid>
                  </CardActions>
                </Card>
                  <Grid container 
                        direction="row"
                        justify="center"
                        alignItems="center" >
                    <Grid item xs={12}>
                        <Modal
                            aria-labelledby="Election-Request-Form"
                            aria-describedby="Election-Request-Form"
                            open={this.state.isFormOpen}
                            onClose={() => this.setState({ isFormOpen : false })}
                            className="ElectionRequestForm"
                        >
                            <CandidateRequestForm 
                                electionHash={this.props.electionHash} 
                                candidateHash={this.props.candidateHash}
                                username={this.props.username}
                                userObject={this.props.userObject}
                                updateForm={this.updateForm}
                            />
                        </Modal>
                    </Grid>
                </Grid>
            </div>
            )
    }
        
    
    
}