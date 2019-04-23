import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { ipfsFetcher } from '../ipfsStore';
import Person from '@material-ui/icons/Person'
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import "../App.css"


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
            isNominated : nominate,
            electionData : null,
            loaderStart : false
        }
    }

    componentWillMount = async() => {

      this.setState({ loaderStart : true })

      let electionData = await ipfsFetcher(this.props.electionHash)
      this.setState({
        electionData, loaderStart : false
      })
    }

    doApprove = async(name) => {

      this.setState({ loaderStart : true })
        
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

                   // this.props.refresh()
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
                      isNominated : true,
                      loaderStart : false
                    })
                }
                
            }
        }

    }

    doNominate = async() => {

      this.setState({ loaderStart : true })

        const {contract, accounts} = this.props.userObject
        let {RequesterUsername, electionHash, place } = this.props

        await contract.methods.addCandidate(electionHash, RequesterUsername, place).send({from: accounts[2],gas:6721975})
        .then((receipt) => {
          console.log(receipt)
        })
        .catch((error) => {
          console.log(error)
        });

        this.setState({ loaderStart : false })
        this.doApprove("Nominate")
        alert("Candidate Added to Election")

    }

    render(){
      console.log(this.props)
      console.log(this.state)
        let hide = {
            display : 'none'
        } 

        let show = {
            display : 'block'
        }

        return(
            <div>
              {
                this.state.electionData &&
                  <Card className="RequestCard" elevation={5}>
                    <CardContent>
                      <Typography varient="h4">
                        {this.state.electionData.typeOfElection}
                      </Typography>
                      <Typography className="RequestCardText2">
                        {this.state.electionData.constituency}
                      </Typography>
                      <Person className="personIcon" />
                      <Typography varient="h4" className="RequestCardText3">
                        {this.props.RequesterUsername}
                      </Typography>
                      <Typography varient="h6" className="RequestCardText4" color="textSecondary">
                        {this.props.status}
                      </Typography>
                    </CardContent>
                    <CardActions style={{ marginTop : "-5px"}}>
                    <Button 
                      color="primary" 
                      variant="outlined" 
                      size="small" 
                      style={(this.state.isApproved || this.state.isNominated) ? hide : show} 
                      onClick={() => this.doApprove("Approve")}
                    >
                      Approve
                    </Button>
                    <Button 
                      color="secondary" 
                      variant="outlined" 
                      size="small" 
                      style={(this.state.isApproved || this.state.isNominated || this.state.isRejected) ? hide : show} 
                      onClick={() => this.doApprove("Reject")}
                    >
                      Reject
                    </Button>
                    <Button 
                      color="secondary" 
                      variant="outlined" 
                      size="small" 
                      style={(this.state.isApproved) ? show : hide} 
                      onClick={this.doNominate} 
                    >
                      Add To Election
                    </Button>
                  </CardActions>
                  </Card>
              }
            </div>
        )
    }
}