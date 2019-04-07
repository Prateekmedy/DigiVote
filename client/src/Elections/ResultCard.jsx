import React, { Component } from 'react';

export default class ResultCard extends Component{

    constructor(props){
        super(props)
        this.state = {

        }
    }

    render(){
        console.log(this.props)
        return(
            <div>
                <h2>Election Result</h2>
                <h3>{this.props.selectedElection.election.typeOfElection}</h3>
                <h3>{this.props.selectedElection.election.constituency}</h3>
                
                {
                    this.props.selectedElection.candidates.map((candidate, index) => 
                        <div key={index}>
                            <h3>{candidate[0]}</h3>
                            <h2>{candidate[1]}</h2>
                        </div>
                    )
                }
                
            </div>
        )
    }
}