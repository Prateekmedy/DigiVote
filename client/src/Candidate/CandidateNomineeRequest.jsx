import React, { Component } from 'react';

export default class CandidateNomineeRequest extends Component{

    constructor(props){
        super(props)
        this.state = {
            elections:null
        }
    }

    componentDidMount = async() => {
        
        let elections = [];
        for(let i=0;i<3;i++){

            let result
             await this.props.userObject.contract.methods.getElections(i).call()
            .then(res => result = res)
            .catch(console.error)

            elections.push(result)
        }
       
        this.setState({
            elections
        })

       
    }

    render(){
      
        return(
            <div>
                <h2>This is List of Elections</h2>
                {
                    this.state.elections &&
                    <ul>
                        {this.state.elections.map((item, index) => 
                            <li key={index}>{item}</li>
                        )}
                    </ul> 
                }   
            </div>
        )
    }
}