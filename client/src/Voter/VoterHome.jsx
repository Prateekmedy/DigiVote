import React, { Component } from 'react'
import VerifyVoter from './VerifyVoter'
import VotingArena from './VotingArena'

export default class Voter extends Component{
    
    constructor(props){
        super(props)
        this.state = {
            voterVerified : false
        }
    }


    updateVoterVerification = () => {
        this.setState({
            voterVerified : true
        })
    }

    render(){



        return(
            <div>
                <h1>This is Voter's Home</h1>
                {this.state.voterVerified 
                    ? <VotingArena 
                        
                        /> 
                    : <VerifyVoter 
                            updateVoterVerification={this.updateVoterVerification}
                        />
                }
            </div>
            
        )
    }
    
}