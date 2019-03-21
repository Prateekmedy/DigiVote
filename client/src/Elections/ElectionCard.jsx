import React, { Component } from 'react';

export default class ElectionCard extends Component{

    constructor(props){
        super(props)
        this.state = {
            item : this.props.item
        }
    }

    openRequest = () => {
        console.log(this.state.item);

        this.props.updateElectionState(true, this.state.item)
    }

    render(){

        let divStyle = {
            cursor: 'pointer',
            color : 'red',
            margin:'10px'
        }

       

        return (
            <div style={divStyle} onClick={this.openRequest}>{this.props.item}</div>
        )
    }
        
    
    
}