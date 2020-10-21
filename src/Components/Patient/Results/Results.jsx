import React from 'react'
import { connect } from 'react-redux';
import { date } from 'yup';

import Block from '../../../Global/Block/Block'
import ComponentMould from '../../../Global/ComponentMould/ComponentMould'

function getUserId(){
    //here we are supposed to get the connected user's Id
    userId=1
    return userId
}

function getUserMedExamDemands(){
    //here we are going to get all the med Exams of the user and order them by date(desc) most recent to oldest
    let idUser = getUserId;
    return props.medicalExamDemand.filter(aDemand=>aDemand.idUser === idUser).sort((a,b)=>new Date(a.dateCreated)>new date(b.dateCreated)?-1:1)
}

function medExamDmdHasExam_Of_Demands(){
    //here we are going to get the exams in the various demands so we can make the list.
    let demands = getUserMedExamDemands()
    demands.map(aDemand=>{
        
    })

}

function Results(props) {
    return (
        <ComponentMould>
            <Block pageName='Your Results' message='Get your results or search for them using the SIN or GIN of the request' />
            <div className="resultBody">
                <input type='search' className='result-search' />

            </div>
        </ComponentMould>
    )
}

const mapStateToProps = state =>{
    return{
        examination: state.Examination.examinations,
        medicalExamDemandHasExamination: state.MedExamDemandHasExam.medExamDemandHasExam,
        medExamResult: state.MedExamResult.medExamResult,
        medicalExamDemand: state.MedicalEamDemand.medicalExamDemand
    }
}

export default connect(mapStateToProps)(Results)