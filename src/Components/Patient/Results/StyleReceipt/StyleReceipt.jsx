import React from 'react';
import { connect } from 'react-redux';

function downloadResults (ref, GIN) {
    fetch(`${ref}`)
        .then(response => {
            response.blob().then(blob => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = `Results_Demand_${GIN}`;
                a.click();
            });
            //window.location.href = response.url;
    });
}

function requestResult (GIN) {
    alert(`Results requested for ${GIN}`)
}

function StyleReceipt(props){
    let exams = props.demandHasExamJoin.filter(aDemand=>aDemand.GIN === props.GIN)
    let calculateTotal = ()=>{
        let total = 0;
        exams.map(anExam=>{
            total+=anExam.bValue
            console.log(anExam.bVal)
            return null
        })
        return total*105
    }

    return(
        <React.Fragment>
            <i className="fa fa-arrow-left receipt-back-btn" onClick={()=>props.handleBackBtn()} />
            <div className="receipt-header">
                <span className="receipt-header-line">
                    <i className="receipt-header-line-name">CENTRE PASTEUR</i>
                    <i className="receipt-header-line-value">Yaounde le {exams[0].dateCreated}</i>
                </span>
                <span className="receipt-header-line">
                    <i className="receipt-header-line-name">Demand id</i>
                    <i className="receipt-header-line-value">: {props.GIN}</i>
                </span>
                <span className="receipt-header-line">
                    <i className="receipt-header-line-name">Patient</i>
                    <i className="receipt-header-line-value">: {props.user.firstNameUser + ' '+props.user.lastNameUser}</i>
                </span>
                <span className="receipt-header-line">
                    <i className="receipt-header-line-name">Phone</i>
                    <i className="receipt-header-line-value">: {props.user.phoneUser}</i>
                </span>
            </div>

            <div className="grouped-demands">
                {exams.map(anExam=>{
                    let examResult = props.medExamResult.find(medExamResult=>medExamResult.idMedExamDemandExamination === anExam.idMedExamDemandExamination)
                    return(
                        <div className="demand-GIN" key={anExam.idMedExamDemandExamination}>
                            <div className="demand-GIN-indicator"></div>
                            <div className="demand-GIN-data">
                                <span className="demand-GIN-data-group">
                                    <i className="demand-GIN-data-label">Name examination:</i>
                                    <i className="demand-GIN-data-value">{anExam.nameExamination}</i>
                                </span>
                                <span className="demand-GIN-data-group">
                                    <i className="demand-GIN-data-label">Exam price:</i>
                                    <i className="demand-GIN-data-value">{anExam.bValue * 105} CFA</i>
                                </span>
                                {(new Date())>(new Date(examResult.dueDate))?(
                                    examResult.dateUploaded===null?(
                                        <span className="demand-GIN-data-group btn-own">
                                            <i className="demand-GIN-data-value req-rslt-btn" onClick={()=>{requestResult(anExam.GIN)}}>Request results</i>
                                        </span>
                                    ):(
                                        <span className="demand-GIN-data-group btn-own">
                                            <i className="demand-GIN-data-value dwnld-btn" onClick={()=>{downloadResults(examResult.resultRef, anExam.GIN)}}>Get results</i>
                                        </span>
                                    )
                                )
                                :
                                <span className="demand-GIN-data-group">
                                    <i className="demand-GIN-data-label">Due Date:</i>
                                    <i className="demand-GIN-data-value">{examResult.dueDate}</i>
                                </span>
                                }
                            </div>
                        </div>
                    )
                })}
            </div>

            {props.receipt?
            <div className="receipt-footer">
                <span className="receipt-footer-line">
                    <i className="receipt-footer-line-name">Demand Total</i>
                    <i className="receipt-footer-line-value">: {calculateTotal()} CFA</i>
                </span>
                <i className="receipt-header-line-value">This receipt is only valid for 30 days</i>

            </div>
            :null
            }

        </React.Fragment>
    )
}

const mapStateToProps = state =>{
    return{
        demandHasExamJoin: state.DemandHasExamJoin.demandHasExamJoin,
        medExamResult: state.MedExamResult.medExamResult,
        user: state.User.user
    }
}

export default connect(mapStateToProps)(StyleReceipt)