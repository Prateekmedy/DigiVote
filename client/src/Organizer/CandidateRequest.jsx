import React, { Component } from 'react';

export default class CandidateRequest extends Component{
    constructor(props){
        super(props)

        let approve = false, reject = false, nominate = false, request = false

        if(this.props.status === "Requested") request = true        
        
        if(this.props.status === "Approved") approve = true

        if(this.props.status === "Rejected") reject = true

        if(this.props.status === "Nomianted") nominate = true

        this.state = {
            isRequested : request,
            isApproved : approve,
            isRejected : reject,
            isNominated : nominate
        }
    }

    componentWillMount = () => {
      console.log(this.state)
    }

    doApprove = async(name) => {
        
        const {contract, accounts} = this.props.userObject
        let {RequesterUsername, index, electionHash } = this.props
        let length = 0;
        
        await contract.methods.candidateRequestsCount(RequesterUsername).call()
        .then(res => length = res)
        .catch(console.error)

        for(let i = 0; i < length; i++){

            let result
            await contract.methods.getRequest(RequesterUsername, i).call()
            .then(res => result = res)
            .catch(console.error)

            if(result[1] === electionHash){

                if(name === 'Approve'){

                    await contract.methods.updateRequestStatus(index, i, RequesterUsername, "Approved").send({from: accounts[2],gas:6721975})
                    .then((receipt) => {
                      console.log(receipt)
                    })
                    .catch((error) => {
                      console.log(error)
                    });

                    this.setState({
                      isRequested : false,
                      isApproved : true,
                      isRejected : false,
                      isNominated : false
                    })
                }

                if(name === 'Reject'){

                    await contract.methods.updateRequestStatus(index, i, RequesterUsername, "Rejected").send({from: accounts[2],gas:6721975})
                    .then((receipt) => {
                      console.log(receipt)
                    })
                    .catch((error) => {
                      console.log(error)
                    });

                    this.setState({
                      isRequested : false,
                      isApproved : false,
                      isRejected : true,
                      isNominated : false
                    })
                }

                if(name === 'Nominate'){

                    await contract.methods.updateRequestStatus(index, i, RequesterUsername, "Nomianted").send({from: accounts[2],gas:6721975})
                    .then((receipt) => {
                      console.log(receipt)
                    })
                    .catch((error) => {
                      console.log(error)
                    }); 

                    this.setState({
                      isRequested : false,
                      isApproved : false,
                      isRejected : false,
                      isNominated : true
                    })
                }
                
            }
        }

    }

    doNominate = async() => {

        const {contract, accounts} = this.props.userObject
        let {RequesterUsername, electionHash, place } = this.props

        await contract.methods.addCandidate(electionHash, RequesterUsername, place).send({from: accounts[2],gas:6721975})
        .then((receipt) => {
          console.log(receipt)
        })
        .catch((error) => {
          console.log(error)
        });

        this.doApprove("Nominate")

    }

    render(){

        let hide = {
            display : 'none'
        } 

        let show = {
            display : 'block'
        }

        return(
            <div>
                <h4>{this.props.RequesterUsername} ({this.state.isNominated ? "Nominated" : "Unnominated"})</h4>
                <button style={(this.state.isApproved || this.state.isNominated) ? hide : show} onClick={() => this.doApprove("Approve")}>Approve</button>
                <button style={(this.state.isApproved || this.state.isNominated || this.state.isRejected) ? hide : show} onClick={() => this.doApprove("Reject")}>Reject</button>
                <button style={(this.state.isApproved) ? show : hide} onClick={this.doNominate}>Add to Election</button>
            </div>
        )
    }
}