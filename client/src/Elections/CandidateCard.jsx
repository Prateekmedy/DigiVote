import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class CandidateCard extends Component {
    state = {  }
    render() { 

        let show = {
            display : "block"
        }
        let hide = {
            display : "none"
        }

        return ( 
            <div>
                <Grid 
                    container 
                    direction="row"
                    justify="center"
                    alignItems="center"
                    className="CandidateCardDiv"
                >
                    <Grid item xs={12}>
                       <center> <Typography variant="h6" className="CandidatesHeading" gutterBottom>
                            CANDIDATES
                        </Typography> </center>
                        <center> <Typography variant="body2" className="ICRD" gutterBottom>
                            <em>Candidate Registration Starts : </em>{this.props.item.ICRD.substring(0, 24)}
                        </Typography> </center>
                        <center> <Typography variant="body2" className="FCRD" gutterBottom>
                            <em>Candidate Registration Ends : </em>{this.props.item.FCRD.substring(0, 24)}
                        </Typography> </center>
                    </Grid>
                        <Grid item xs={12}>
                        <div>
                        {(this.props.showCandidates && this.props.isShow) 
                            && this.props.showCandidates.map((candidate, index) => 
                                <div key={index}>
                                    <center> 
                                    <hr />
                                    <Typography variant="subtitle1" className="candidates" gutterBottom>
                                        {candidate[0]}
                                    </Typography> 
                                    
                                    </center>
                                </div>
                                )
                                
                        }
                        <hr />
                        </div>
                        </Grid>
                        <Grid 
                            container 
                            item xs={12}
                            direction="row"
                            justify="center"
                            alignItems="center"
                        >
                            <Button 
                                variant="contained" 
                                color="primary"
                                className="VoteBtn"
                                style={(parseInt(this.props.candidateCount) && this.props.isShow && this.props.isVotingTime) ? show : hide}
                                onClick={this.props.goToVote}
                            >Vote</Button>
                        </Grid>
                </Grid>
            </div>
         );
    }
}
 
export default CandidateCard;