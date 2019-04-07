import React, { Component } from 'react';
import { ipfsFetcher } from '../ipfsStore';
import SingleElection from './SingleElection';

export default class ElectionList extends Component{
    constructor(props){
        super(props)
        this.state = {
            elections : null,
            electionHash : null
        }
    }

    componentDidMount = async() => {
        
        let electionHash = []
        let elections = []
        let length = 0;
        const {contract} = this.props.userObject
        
        await contract.methods.electionsCount().call()
        .then(res => length = res)
        .catch(console.error)

        
        for(let i=0;i<length;i++){

            let result
            await contract.methods.getElections(i).call()
            .then(res => result = res)
            .catch(console.error)


            let electionData = await ipfsFetcher(result)

            electionHash.push(result)
            elections.push(electionData)
        }
       
        this.setState({
            elections,
            electionHash
        })

        console.log(elections)
    }

   

    render(){
        console.log("Election List")
        return(
            <div>
                {
                    this.state.elections &&
                    <div>
                        {this.state.elections.map((item, index) => 
                            <SingleElection 
                                key={index} 
                                index={index} 
                                item={item} 
                                electionHash={this.state.electionHash}
                                userObject={this.props.userObject} 
                                updateHomeState={this.props.updateHomeState}
                            />   
                        )}
                    </div> 
                }
            </div>
        )
    }
}