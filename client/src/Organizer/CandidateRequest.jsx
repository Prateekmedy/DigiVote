import React, { Component } from 'react';

export default class CandidateRequest extends Component{
    constructor(props){
        super(props)

        let approve = false, reject = false, nominate = false

        if(this.props.status === 'Approved') approve = true

        if(this.props.status === 'Rejected') reject = true

        if(this.props.status === 'Nominated') nominate = true

        this.state = {
            isApproved : approve,
            isRejected : reject,
            isNominated : nominate
        }
    }

    doApprove = async(name) => {
        
        const {contract} = this.props.userObject
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

                    await contract.methods.updateRequestStatus(index, i, RequesterUsername, "Approved").send({from: '0xB18DFE177bd96c229D5e0E6D06446Ff0eF825B13',gas:6721975})
                    .then((receipt) => {
                      console.log(receipt)
                    })
                    .catch((error) => {
                      console.log(error)
                    });

                    this.setState({ isApproved : true })
                }

                if(name === 'Reject'){

                    await contract.methods.updateRequestStatus(index, i, RequesterUsername, "Rejected").send({from: '0xB18DFE177bd96c229D5e0E6D06446Ff0eF825B13',gas:6721975})
                    .then((receipt) => {
                      console.log(receipt)
                    })
                    .catch((error) => {
                      console.log(error)
                    });

                    this.setState({ isReject : true })
                }

                if(name === 'Nominate'){

                    await contract.methods.updateRequestStatus(index, i, RequesterUsername, "Nomianted").send({from: '0xB18DFE177bd96c229D5e0E6D06446Ff0eF825B13',gas:6721975})
                    .then((receipt) => {
                      console.log(receipt)
                    })
                    .catch((error) => {
                      console.log(error)
                    });

                    this.setState({ isNominated : true })
                }
                
            }
        }

    }

    doNominate = async() => {

        const {contract} = this.props.userObject
        let {RequesterUsername, electionHash } = this.props

        await contract.methods.addCandidate(electionHash, RequesterUsername).send({from: '0xB18DFE177bd96c229D5e0E6D06446Ff0eF825B13',gas:6721975})
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
                <h4>{this.props.RequesterUsername}</h4>
                <button style={(this.state.isApproved || this.state.isNominated) ? hide : show} onClick={() => this.doApprove("Approve")}>Approve</button>
                <button style={(this.state.isApproved || this.state.isNominated) ? hide : show} onClick={() => this.doApprove("Reject")}>Reject</button>
                <button style={(this.state.isApproved || this.state.isNominated) ? show : hide} onClick={this.doNominate}>Add to Election</button>
            </div>
        )
    }
}