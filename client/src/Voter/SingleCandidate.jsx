import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Person from '@material-ui/icons/Person'
import Radio from '@material-ui/core/Radio';
import { ipfsFetcher } from '../ipfsStore';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import "../App.css"

export default class SingleCandidate extends Component{
    constructor(props){
        super(props)
        this.state = {
            candidateObject : "",
            loaderStart : false
        }
    }

    componentWillMount = async() => {

        this.setState({ loaderStart : true })

        if(this.props.candidate !== "NOTA"){
            const {contract} = this.props.userObject
            let candidateHash
            await contract.methods.getCandidatePersonal(this.props.candidate).call()
            .then(res => candidateHash = res)
            .catch(console.error)

            let candidateObject = await ipfsFetcher(candidateHash)

            this.setState({
                candidateObject, loaderStart : false
            })
        }

        this.setState({ loaderStart : false })
     
    }

    selectIt = () => {
        this.props.updateSelectedCandidate(this.props.candidate)
    }

    

    render(){
        console.log(this.props)
        console.log(this.state.candidateObject)
        return(
            <div>
                <Fade
                    in={this.state.candidateObject === true}
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
                <Grid item xs={3}>
                {
                    (this.state.candidateObject || this.props.candidate == "NOTA")
                        && <Card className={(this.props.selectedCandidate === this.props.candidate) ? "SelectedElectedCard" : "ElectedCard"} elevation={5}>
                                <CardContent>
                                <Person className="personIcon1" />
                                <Typography varient="h3">
                                    {this.state.candidateObject.Name ? this.state.candidateObject.Name : "NOTA"}
                                </Typography>
                                <Typography varient="h4">
                                    {this.state.candidateObject.ElectionParty}
                                </Typography>
                                </CardContent>
                                <CardActions className="cardRadio">
                                <Grid 
                                    container 
                                    direction="row"
                                    justify="center"
                                    alignItems="center"
                                >
                                    <Grid item xs={12}>
                                    <Radio
                                        checked={this.props.selectedCandidate === this.props.candidate}
                                        onChange={this.selectIt}
                                        value={this.props.candidate}
                                        name="candidate"
                                        aria-label="candidate"
                                    />
                                    </Grid>
                                </Grid>
                                
                            </CardActions>
                            </Card>
                }
            </Grid>
            </div>
            
        )
    }
}