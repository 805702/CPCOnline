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
            let test = groupArray.filter(_=>_.GIN===ademandHasExam.GIN)
            if(test.length===0)groupArray.push({GIN:ademandHasExam.GIN, dateDemanded:ademandHasExam.dateCreated})
            return null
        })
    }
    else{
        let test = demandHasExamJoin.filter(ademandHasExam=>ademandHasExam.GIN.includes(searchValue))
        if (test.length!==0) {
            test.map(_=>{
                let __ = groupArray.find(___=>___.GIN===_.GIN)
                if (__ === undefined) groupArray.push({GIN:_.GIN, dateDemanded:_.dateCreated})
                return null
            })
        //     // groupArray.push({GIN:test.GIN, dateDemanded:test.dateCreated})
        }
    }

    return groupArray.sort((a,b)=>(new Date(a.dateDemanded))>(new Date(b.dateDemanded))?-1:1)
}

function StyleDemands(props){
    let demandGIN = groupMedExamDemandByGIN(props.demandHasExamJoin, props.searchValue)
    if(demandGIN.length>0){
        return(
            <div className="grouped-demands">
                {demandGIN.map(aDemand=>{
                    let dateDemanded = aDemand.dateDemanded.split('T')
                    dateDemanded[1]= dateDemanded[1].split('.0')[0]
                    dateDemanded =dateDemanded.join(' ')
                    return (
                        <div className="demand-GIN" key={aDemand.GIN} onClick={()=>props.demandClick(aDemand.GIN)}>
                            <div className="demand-GIN-indicator"></div>
                            <div className="demand-GIN-data">
                                <span className="demand-GIN-data-group">
                                    <i className="demand-GIN-data-label">Demand id:</i>
                                    <i className="demand-GIN-data-value">{aDemand.GIN}</i>
                                </span>
                                <span className="demand-GIN-data-group">
                                    <i className="demand-GIN-data-label">Demand  date:</i>
                                    <i className="demand-GIN-data-value">{dateDemanded}</i>
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
