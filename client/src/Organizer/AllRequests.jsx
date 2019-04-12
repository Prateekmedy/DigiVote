import React, { Component } from 'react';
import CandidateRequest from './CandidateRequest';
import Grid from '@material-ui/core/Grid';

export default class AllRequests extends Component{
    constructor(props){
        super(props)
        this.state = {
            requests:null
        }
    }

    componentDidMount = async() => {
        
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
       
        this.setState({
            requests
        })

       
    }

    render(){
        return(
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
                                />          
                        )}
                    </Grid> 
                }
            </Grid>
        )
    }
}