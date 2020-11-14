import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Block from '../../../Global/Block/Block'
import ComponentMould from '../../../Global/ComponentMould/ComponentMould'
import './Results.css'
import StyleReceipt from './StyleReceipt/StyleReceipt';
import StyleDemands from './StyleDemands/StyleDemands'
import parseJwt from '../../../utils/parseJwt';

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
        let token = localStorage.getItem('userToken')
        let parsedToken = token===null?undefined:parseJwt(token)
        if(token===null || parseJwt(token).phoneUser==='' )this.props.history.push('/')
        else{
            fetch('http://localhost:4000/api/result/getPatientResultData',{
                body:JSON.stringify({phone:parsedToken.phoneUser}),
                headers: {'Content-Type': 'application/json'},
                method:'post'
            }).then(data=>data.json())
            .then(result=>{
                this.props.dispatch({type:'LOAD_DEMAND_HAS_EXAM_JOIN', payload:result.demandHasExamJoin})
                this.props.dispatch({type:'LOAD_MED_EXAM_RESULT', payload:result.medExamResult})
                this.props.dispatch({type:'LOAD_USER', payload:result.user.user})
            }).catch(err=>console.log(err))
        }
    }


    demandClick=(key)=>{
        this.setState({GIN:key})
    }

    handleSearchChange=e=>{
        this.setState({searchValue:e.target.value})
    }

    handleBackBtn=()=>{
        this.setState({GIN:'', searchValue:''})
    }

    render() {
        return (
            <ComponentMould>
                <Block pageName='Your Results' message='Get your results or search for them using the SIN or GIN of the request' />
                <div className="result-body">
                    {this.state.GIN!=='' && !isNaN(this.state.GIN) ?
                        <StyleReceipt receipt={false} GIN={this.state.GIN} handleBackBtn={this.handleBackBtn} callingComponent='result'/>
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

export default withRouter(Results)