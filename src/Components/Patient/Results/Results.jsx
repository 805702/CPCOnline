import React, { Component } from 'react'
import { connect } from 'react-redux';

import Block from '../../../Global/Block/Block'
import ComponentMould from '../../../Global/ComponentMould/ComponentMould'
import './Results.css'
import StyleReceipt from './StyleReceipt/StyleReceipt';
import StyleDemands from './StyleDemands/StyleDemands'

//when this page is loaded, all the results pertaining to the patient is loaded automatically from the backend
//the backend will provide two crucial information
//1. the first information table is the medicalExamDemand_has_Examination that will have an inner join with the  examination table and another inner join with MedicalExamDemand.
// the structure of 1 will be the following columns: 
// idMedicalExamDemandExamination idMedicalExamDemand nameExamination daysToResult GIN medicalExamDemand.dateCreated,
//
//2. the second information table is the MedicalExamResult table of all the medicalExamDemand_has_Examination table.
//
//the above data will be logged to the redux and we shall map it to props and use.


class Results extends Component {
    state={
        GIN:'', searchValue:''
    }

    componentDidMount(){
        //load data for the route of innerJoin and the user data here
    }


    demandClick=(key)=>{
        this.setState({GIN:key})
    }

    handleSearchChange=e=>{
        this.setState({searchValue:e.target.value})
    }

    handleBackBtn=()=>{
        this.setState({GIN:''})
    }

    render() {
        return (
            <ComponentMould>
                <Block pageName='Your Results' message='Get your results or search for them using the SIN or GIN of the request' />
                <div className="result-body">
                    {this.state.GIN!=='' && !isNaN(this.state.GIN)?
                        <StyleReceipt receipt={false} GIN={this.state.GIN} handleBackBtn={this.handleBackBtn} />
                        :
                        <React.Fragment>
                            <input type='text' placeholder='Search GIN...' onChange={this.handleSearchChange} className='result-search' />
                            <StyleDemands searchValue={this.state.searchValue} demandClick={this.demandClick} />
                        </React.Fragment>
                    }
                </div>
            </ComponentMould>
        )
    }
}


const mapStateToProps = state =>{
    return{
        demandHasExamJoin: state.DemandHasExamJoin.demandHasExamJoin,
        user: state.User.user
    }
}

export default connect(mapStateToProps)(Results)