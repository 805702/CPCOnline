import React from 'react';
import { connect } from 'react-redux';

/**
 * 
 * @param {*} demandHasExamJoin  is the list of demandHasExamJoin that is coupled with the examination table an medExamDemand table
 * 
 * this function will be used to get the different GIN's of the patient. 
 * this information will be used to model the first interface of the results page
 * 
 * @returns {Array} groupArray that is the list of the different GIN's and their demand dates.
 */
let groupMedExamDemandByGIN=(demandHasExamJoin, searchValue)=>{
    let groupArray=[] //here i will have the different GIN's
    if(searchValue===''){
        demandHasExamJoin.map(ademandHasExam=>{
            let test = groupArray.filter(GIN=>GIN.GIN===ademandHasExam.GIN)
            if(test.length===0)groupArray.push({GIN:ademandHasExam.GIN, dateDemanded:ademandHasExam.dateCreated})
            return null
        })
    }
    else{
        let test = demandHasExamJoin.find(ademandHasExam=>Number(searchValue) === ademandHasExam.GIN)
        if (test !== undefined) groupArray.push(test)
    }

    return groupArray.sort((a,b)=>(new Date(a.dateDemanded))>(new Date(b.dateDemanded))?-1:1)
}

function StyleDemands(props){
    let demandGIN = groupMedExamDemandByGIN(props.demandHasExamJoin, props.searchValue)
    if(demandGIN.length>0){
        return(
            <div className="grouped-demands">
                {demandGIN.map(aDemand=>{
                    return (
                        <div className="demand-GIN" key={aDemand.GIN} onClick={()=>props.demandClick(aDemand.GIN)}>
                            <div className="demand-GIN-indicator"></div>
                            <div className="demand-GIN-data">
                                <span className="demand-GIN-data-group">
                                    <i className="demand-GIN-data-label">Demand id:</i>
                                    <i className="demand-GIN-data-value">{aDemand.GIN}</i>
                                </span>
                                <span className="demand-GIN-data-group">
                                    <i className="demand-GIN-data-label">Demand id:</i>
                                    <i className="demand-GIN-data-value">{aDemand.dateDemanded}</i>
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }else{
        return(
            <div className="grouped-demands no-demands">
                <div className="demand-GIN">
                    <div className="demand-GIN-indicator"></div>
                    <div className="demand-GIN-data">
                        <span className="demand-GIN-data-group">
                            <i className="demand-GIN-data-label">You have no demands with this GIN</i>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return{
        demandHasExamJoin: state.DemandHasExamJoin.demandHasExamJoin,
        user: state.User.user
    }
}

export default connect(mapStateToProps)(StyleDemands)
