import React, { Component } from 'react'

export default class AadhaarVerify extends Component {

    constructor(props){
        super(props)
        this.state = {
            voterId : ""
        }
    }

    verifyVoterId =(event) => {

        event.preventDefault()
       
        if(this.props.voterId === this.state.voterId){
            this.props.voterIdVerified()
        }else{
            console.log("Enter the correct VoterID")
        }

    }   
    
    updateVoterId = (evt) => {
        this.setState({
            voterId : evt.target.value
        })
    }


    render(){
        return(
            <div>
                <form onSubmit={this.verifyVoterId}>
                    <h3>Enter your VoterID</h3>
                    <input type="text"  value={this.state.voterId} onChange={evt => this.updateVoterId(evt)}/>
                    <input type="submit" value="Verify" />
                </form>
            </div>
        )
    }

 }
