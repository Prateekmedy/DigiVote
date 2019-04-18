import React, { Component } from 'react';
import { ipfsFetcher } from '../ipfsStore';
import SingleElection from './SingleElection';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Slider from "react-slick";
import '../App.css'
import '../index.css'

export default class ElectionList extends Component{
    constructor(props){
        super(props)
        this.state = {
            elections : null,
            electionHash : null,
            liveElections : [],
            CRElections : [],
            otherElections : []
        }
        
    }

    //update the liveElection and val = 0 remove the election and 1 means add the election
    updateLiveElections = (item, val) => {

        if(val){

            let count = 0
            for(let i=0;i<this.state.liveElections.length;i++){
                if(item == this.state.liveElections[i]){
                    count = count + 1;
                    break;
                }
            }

            if(count == 0){
                let liveElections = this.state.liveElections
                liveElections.push(item)
                this.setState({ liveElections })
            }
            
        }else{
            let liveElections = this.state.liveElections.filter(function(item, index, arr){

                return (item !== arr[index]);
            
            });

            this.setState({ liveElections })
        }  
    }

    updateCRElections = (item, val) => {
        if(val){

            let count = 0
            for(let i=0;i<this.state.CRElections.length;i++){
                if(item == this.state.CRElections[i]){
                    count = count + 1;
                    break;
                }
            }

            if(count == 0){
                let CRElections = this.state.CRElections
                CRElections.push(item)
                this.setState({ CRElections })
            }
            
        }else{
            let CRElections = this.state.CRElections.filter(function(item, index, arr){

                return (item !== arr[index]);
            
            });

            this.setState({ CRElections })
        }    
    }

    updateOtherElections = (item, val) => {
        if(val){

            let count = 0
            for(let i=0;i<this.state.otherElections.length;i++){
                if(item == this.state.otherElections[i]){
                    count = count + 1;
                    break;
                }
            }

            if(count == 0){
                let otherElections = this.state.otherElections
                otherElections.push(item)
                this.setState({ otherElections })
            }
            
        }else{
            let otherElections = this.state.otherElections.filter(function(item, index, arr){

                return (item !== arr[index]);
            
            });

            this.setState({ otherElections })
        }    
    }

    componentWillMount = async() => {
        
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
        console.log(this.state.otherElections)

        let StS
        if(this.state.liveElections !== null ) {
            if(this.state.liveElections.length >= 3 ) StS = 3
            if(this.state.liveElections.length == 2) StS = 2
            if(this.state.liveElections.length == 1) StS = 1
            if(this.state.liveElections.length < 1) StS  = 0
        }

        const settingsLive = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: StS,
            slidesToScroll: 1
        };

        if(this.state.CRElections !== null ) {
            if(this.state.CRElections.length >= 3 ) StS = 3
            if(this.state.CRElections.length == 2) StS = 2
            if(this.state.CRElections.length == 1) StS = 1
            if(this.state.CRElections.length < 1) StS  = 0
        }

        const settingsCR = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: StS,
            slidesToScroll: 1
        };

        if(this.state.otherElections !== null ) {
            if(this.state.otherElections.length >= 3 ) StS = 3
            if(this.state.otherElections.length == 2) StS = 2
            if(this.state.otherElections.length == 1) StS = 1
            if(this.state.otherElections.length < 1) StS  = 0
        }

        const settingsOther = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: StS,
            slidesToScroll: 1
        };

        if(this.state.elections !== null ) {
            if(this.state.elections.length >= 3 ) StS = 3
            if(this.state.elections.length == 2) StS = 2
            if(this.state.elections.length == 1) StS = 1
            if(this.state.elections.length < 1) StS  = 0
        }

        const settingsAll = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: StS,
            slidesToScroll: 1
        };
          
        return(
            <div>
                <Grid 
                    className="HomePageDiv" 
                    container
                >
                <Grid container item  xs={3}>
                    <div className="BrandLogo"></div>
                </Grid>
                <Grid container item  xs={9}>
                    <div className="sideBanner">
                        <div className="rightImg"></div>
                        <div className="LandingBtnDiv">
                            <button 
                                className="LandingBtn"
                                onClick={() => this.props.updateHomeState(1, null)}  
                            >Organizer</button>
                            <button 
                                className="LandingBtn"
                                onClick={() => this.props.updateHomeState(2, null)}
                            >Candidate</button>
                        </div>
                        
                    </div>
                </Grid>
                <Grid item xs={12}>  
                    <div className="leftImg"></div>
                </Grid>
                <Grid item xs={12}>
                    <div className="LandingText"></div>
                </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12}>
                        <div className="LiveElectionHeading"></div>
                    </Grid>
                </Grid>
                <div className="LiveElectionCards">
                {
                    this.state.liveElections &&
                        <Slider {...settingsLive}>
                    
                        {this.state.liveElections.map((item, index) => 
                            <div key={index}>
                            <SingleElection 
                                key={index} 
                                index={index} 
                                item={item} 
                                electionHash={this.state.electionHash}
                                userObject={this.props.userObject} 
                                updateHomeState={this.props.updateHomeState}
                                updateLiveElections={this.updateLiveElections}
                                updateCRElections={this.updateCRElections}
                                updateOtherElections={this.updateOtherElections}
                            />   
                            </div>
                        )}
                        
                        </Slider>
                }
                </div>
                <Grid container >
                    <Grid item xs={12}>
                        <div className="CRElectionHeading"></div>
                    </Grid>
                </Grid>
                <div className="CRElectionCards">
                {
                    this.state.CRElections &&
                        <Slider {...settingsCR}>
                    
                        {this.state.CRElections.map((item, index) => 
                            <div key={index}>
                            <SingleElection 
                                key={index} 
                                index={index} 
                                item={item} 
                                electionHash={this.state.electionHash}
                                userObject={this.props.userObject} 
                                updateHomeState={this.props.updateHomeState}
                                updateLiveElections={this.updateLiveElections}
                                updateCRElections={this.updateCRElections}
                                updateOtherElections={this.updateOtherElections}
                            />   
                            </div>
                        )}
                        
                        </Slider>
                }    
                </div>
                <Grid container >
                    <Grid item xs={12}>
                        <div className="OverElectionHeading"></div>
                    </Grid>
                </Grid>
                <div className="OverElectionCards">
                {
                    this.state.otherElections &&
                        <Slider {...settingsOther}>
                    
                        {this.state.otherElections.map((item, index) => 
                            <div key={index}>
                            <SingleElection 
                                key={index} 
                                index={index} 
                                item={item} 
                                electionHash={this.state.electionHash}
                                userObject={this.props.userObject} 
                                updateHomeState={this.props.updateHomeState}
                                updateLiveElections={this.updateLiveElections}
                                updateCRElections={this.updateCRElections}
                                updateOtherElections={this.updateOtherElections}
                            />   
                            </div>
                        )}
                        
                        </Slider>
                }
                </div>
                <Grid container >
                    <Grid item xs={12}>
                        <div className="AllElectionHeading"></div>
                    </Grid>
                </Grid>
                <div className="AllElectionCards">
                {
                    this.state.elections &&
                        <Slider {...settingsAll}>
                    
                        {this.state.elections.map((item, index) => 
                            <div key={index}>
                            <SingleElection 
                                key={index} 
                                index={index} 
                                item={item} 
                                electionHash={this.state.electionHash}
                                userObject={this.props.userObject} 
                                updateHomeState={this.props.updateHomeState}
                                updateLiveElections={this.updateLiveElections}
                                updateCRElections={this.updateCRElections}
                                updateOtherElections={this.updateOtherElections}
                            />   
                            </div>
                        )}
                        
                        </Slider>
                }
                </div>
                <Grid container >
                    <Grid item xs={12}>
                        <div className="Footer"></div>
                    </Grid>
                </Grid>
                <Fade
                    in={this.state.elections === null}
                    unmountOnExit
                >
                    <Grid 
                        container 
                        direction="row"
                        justify="center"
                        alignItems="center"
                        className="loaderDiv"
                    >
                        <CircularProgress className="loader"/>
                    </Grid>
                    
                </Fade>
            </div>
        )
    }
}