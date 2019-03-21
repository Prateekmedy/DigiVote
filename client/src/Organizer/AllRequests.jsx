import React, { Component } from 'react';

export default class AllRequests extends Component{
    constructor(props){
        super(props)
        this.state = {
            requests:null
            // isAllSelected : false,
            // selectedAll : null
        }
    }

    componentDidMount = async() => {
        
        let requests = [];
        let length = 1;

        const {contract} = this.props.userObject;
        
        // await contract.methods.requestsCount().call()
        // .then(res => length = res)
        // .catch(console.error)

        for(let i=0;i<length;i++){

            let result
             await contract.methods.getAllRequest(i).call()
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