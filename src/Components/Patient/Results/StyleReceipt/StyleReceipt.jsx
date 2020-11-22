import React from 'react';
import { connect } from 'react-redux';
import './StyleReceipt.css'

function requestResult (GIN) {
    alert(`Results requested for ${GIN}`)
}

function StyleReceipt(props){
    let exams = props.demandHasExamJoin.filter(aDemand=>aDemand.GIN === props.GIN)
    if(exams.length === 1 && exams[0].bValue===null) exams=[]
    let calculateTotal = ()=>{
        let total = 0;
        exams.map(anExam=>{
            total+=anExam.bValue
            return null
        })
        return total*105
    }

    let aDemand = props.demandHasExamJoin.find(aDemand=>aDemand.GIN===props.GIN)
    let dateDemanded = aDemand.dateCreated.split('T')
    dateDemanded[1]= dateDemanded[1].split('.0')[0]
    dateDemanded =dateDemanded.join(' ')
    return(
        <div>
            {props.callingComponent!=='demand'?<i className="fa fa-arrow-left receipt-back-btn" onClick={()=>props.handleBackBtn()} />
            :<i className="fa fa-download download-receipt" onClick={()=>props.handleBackBtn()} >Download receipt</i>}
            <div className="receipt-header">
                <span className="receipt-header-line">
                    <i className="receipt-header-line-name">CENTRE PASTEUR</i>
                    <i className="receipt-header-line-value">Yaounde le {dateDemanded}</i>
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
                    let dueDate = examResult.dueDate.split('T')
                    dueDate[1]= dueDate[1].split('.0')[0]
                    dueDate =dueDate.join(' ')
                    return (
                      <div
                        className="demand-GIN"
                        key={anExam.idMedExamDemandExamination}
                      >
                        <div className="demand-GIN-indicator"></div>
                        <div className="demand-GIN-data">
                          <span className="demand-GIN-data-group">
                            <i className="demand-GIN-data-label">
                              Name examination:
                            </i>
                            <i className="demand-GIN-data-value">
                              {anExam.nameExamination}
                            </i>
                          </span>
                          <span className="demand-GIN-data-group">
                            <i className="demand-GIN-data-label">Exam price:</i>
                            <i className="demand-GIN-data-value">
                              {anExam.bValue * 105} CFA
                            </i>
                          </span>
                          {new Date() > new Date(examResult.dueDate) ? (
                            examResult.resultRef === null ? (
                              props.callingComponent==='result'?<span className="demand-GIN-data-group btn-own">
                                <i
                                  className="demand-GIN-data-value req-rslt-btn"
                                  onClick={() => {
                                    requestResult(anExam.GIN);
                                  }}
                                >
                                  Request results
                                </i>
                              </span>:
                              props.callingComponent!=='demand'?<span className="demand-GIN-data-group">
                              <i className="demand-GIN-data-label">Pending</i>
                              <i className="demand-GIN-data-value">Confirmation</i>
                            </span>:null
                            ) : (
                              props.callingComponent==='result'?<span className="demand-GIN-data-group btn-own">
                                <a
                                  className="demand-GIN-data-value dwnld-btn"
                                  download={`Results_Demand_${anExam.GIN}`}
                                  href={`http://localhost:4000/static/${examResult.resultRef}`}
                                  target="_blank"
                                  >
                                  Get results
                                </a>
                              </span>:
                              <span className="demand-GIN-data-group">
                              <i className="demand-GIN-data-label">Pending</i>
                              <i className="demand-GIN-data-value">Confirmation</i>
                            </span>
                            )
                          ) : (
                            props.callingComponent==='result'?<span className="demand-GIN-data-group">
                              <i className="demand-GIN-data-label">Due Date:</i>
                              <i className="demand-GIN-data-value">{dueDate}</i>
                            </span>:
                            <span className="demand-GIN-data-group">
                              <i className="demand-GIN-data-label">Pending</i>
                              <i className="demand-GIN-data-value">Confirmation</i>
                            </span>
                          )}
                        </div>
                      </div>
                    );
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

        </div>
    )
}

const mapStateToProps = state =>{
    return{
        demandHasExamJoin: state.DemandHasExamJoin.demandHasExamJoin,
        medExamResult: state.MedExamResult.medExamResult,
        user: state.User.user,
    }
}

export default connect(mapStateToProps)(StyleReceipt)