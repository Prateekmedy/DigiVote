import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Person from '@material-ui/icons/Person'
import { ipfsFetcher } from '../ipfsStore';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';

export default class ElectionRequests extends Component{
    constructor(props){
        super(props)
        this.state = {
            requests:null,
            loaderStart : false
            // isElectionSelected : false,
            // selectedElection : null
        }
    }

    componentDidMount = async() => {

      this.setState({ loaderStart : true })
        
        let requests = [];
        let length = 0;

        const {contract} = this.props.userObject;
        
        await contract.methods.candidateRequestsCount(this.props.username ? this.props.username : "modi").call()
        .then(res => length = res)
        .catch(console.error)

        for(let i=0;i<length;i++){

            let result
             await contract.methods.getRequest(this.props.username ? this.props.username : "modi", i).call()
            .then(res => result = res)
            .catch(console.error)   
            
            let electionData = await ipfsFetcher(result[1])

            requests.push([result, electionData])
        }

        

        this.setState({
            requests, loaderStart : false
        })

       
    }

    render(){
        console.log(this.state.requests)
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
                <Grid className="RegisterCard" container>
                {
                    this.state.requests &&
                    <Grid container >
                        {this.state.requests.map((item, index) => 
                            <Card key={index} className="RequestCard">
                            <CardContent>
                              <Typography varient="h4">
                                {item[1].typeOfElection}
                              </Typography>
                              <Typography className="RequestCardText2">
                                {item[1].constituency}
                              </Typography>
                              <Person className="personIcon2" />
                              <Typography varient="h4" className="RequestCardText3">
                                {item[0][0]}
                              </Typography>
                              <Typography varient="h4" className="RequestCardText4">
                                {item[0][3]}
                              </Typography>
                              <Button 
                                color="primary" 
                                variant="outlined" 
                                size="small" 
                                style={{ marginTop : "10px"}}
                               >
                                {item[0][4]}
                              </Button>
                            </CardContent>
                          </Card>
                        )}
                    </Grid> 
                }
            </Grid>
          </div>
            
        )
    }
}