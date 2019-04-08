import React, { Component } from 'react';

export default class ElectionCard extends Component{

    constructor(props){
        super(props)
        this.state = {
            item : this.props.item
        }
    }

    openRequest = async() => {
        //console.log(this.state.item);
        const {contract} = this.props.userObject

        //check whether the CAndidate is already nominated for this election or not
        let length = 0
        await contract.methods.countElectionCandidates(this.props.item).call()
        .then(res => length = res)
        .catch(console.error)

        if(length !== 0){

            let userFounded = false

            for(let i=0; i<length; i++){

                let result
                await contract.methods.getSelectedCandidates(this.props.item, i).call()
                .then(res => result = res)
                .catch(console.error)

                if(result[0] == this.props.username){
                    userFounded = true
                    break
                }
            }

            if(userFounded){
                console.log("this candidate is Already Nominated at this Election")
                alert("Sorry You are Already Nominated for this Election")
            }else{
                this.props.updateElectionState(true, this.state.item)
            }

        }else{
            this.props.updateElectionState(true, this.state.item)
        }
   
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