import React, { Component } from 'react';

export default class ElectionRequests extends Component{
    constructor(props){
        super(props)
        this.state = {
            requests:null
            // isElectionSelected : false,
            // selectedElection : null
        }
    }

    componentDidMount = async() => {
        
        let requests = [];
        let length = 1;

        const {contract} = this.props.userObject;
        
        // await contract.methods.candidateRequestsCount().call()
        // .then(res => length = res)
        // .catch(console.error)

        for(let i=0;i<length;i++){

            let result
             await contract.methods.getRequest(this.props.username, i).call()
            .then(res => result = res)
            .catch(console.error)

            requests.push(result)
        }
       
        this.setState({
            requests
        })

       
    }

    render(){
        return(
            <div>
                {
                    this.state.requests &&
                    <ul>
                        {this.state.requests.map((item, index) => 
                            <div key={index}>{item}</div>
                        )}
                    </ul> 
                }
            </div>
        )
    }
}