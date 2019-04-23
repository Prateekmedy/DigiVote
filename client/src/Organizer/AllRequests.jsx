import React, { Component } from 'react';
import CandidateRequest from './CandidateRequest';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';

export default class AllRequests extends Component{
    constructor(props){
        super(props)
        this.state = {
            requests:null,
            loaderStart : false,
            refresh : 0
        }
    }

    componentDidMount = async() => {

        this.setState({ loaderStart : true })
        
        let requests = [];
        let length = 0;

        const {contract} = this.props.userObject;
        
        await contract.methods.requestsCount().call()
        .then(res => length = res)
        .catch(console.error)

        for(let i=0;i<length;i++){

            let result
             await contract.methods.getAllRequest(i).call()
            .then(res => result = res)
            .catch(console.error)
            console.log(result)
            requests.push(result)
        }

        
        let newRequest = requests.filter((request) => {
            return request[4] !== "Rejected"
        })
        console.log(requests)
        console.log(newRequest)
       
        this.setState({
            requests : newRequest, loaderStart : false, refresh : 0
        })

       
    }

    refresh = () => {
        this.setState({ refresh : 1 })
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
                <Grid className="RegisterCard" container>
                {
                    this.state.requests &&
                    <Grid container >
                        {this.state.requests.map((item, index) =>    
                                <CandidateRequest 
                                    userObject={this.props.userObject}
                                    key={index}
                                    index={index}
                                    RequesterUsername={item[0]} 
                                    electionHash={item[1]}
                                    time={item[2]}
                                    place={item[3]}
                                    status={item[4]} 
                                    refresh={this.refresh}   
                                />          
                        )}
                    </Grid> 
                }
                </Grid>
            </div>
            
        )
    }
}