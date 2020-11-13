import React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import ComponentMould from '../../../../../Global/ComponentMould/ComponentMould';

import DemandLine from '../DemandLine/DemandLine';
import './Confirm.css'


function Confirm(props) {
    let demands = props.medicalExamDemand.sort((a,b)=>(new Date(a.dateCreated))>(new Date(b.dateCreated))?1:-1)
    demands = demands.map((aDemand,index)=>{
        let demandDate = aDemand.dateCreated.split('T')
        demandDate[0] = new Date(demandDate[0]).toDateString()
        demandDate[1]= demandDate[1].split('.0')[0]
        demandDate =demandDate.join(' at ')

        return <DemandLine key={aDemand.SIN} No={index+1} onClick={props.onNext} SIN={aDemand.SIN} date={demandDate} td={true} />
    })
    return (
        <ComponentMould>
            <div className='confirm-demand-container'>
                <DemandLine td={false} />
                <Scrollbars style={{height:'50vh'}}>
                    <div className="confirm-demand-holder">
                        {demands}
                    </div> 
                </Scrollbars>
            </div>
        </ComponentMould>
    )
}

const mapStateToProps=state=>{
    return{
        medicalExamDemand:state.MedicalExamDemand.medicalExamDemand
    }
}

export default connect(mapStateToProps)(Confirm)