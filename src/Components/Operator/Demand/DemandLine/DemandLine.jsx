import React from 'react';

import './DemandLine.css'

function DemandLine(props){
    return(
        props.td?<div className="demand-line">
            <div className="demand-line-no">{props.No}</div>
            <div className="demand-line-SIN">{props.SIN}</div>
            <div className="demand-line-date">{props.date}</div>
        </div>:<div className="demand-line-th">
            <div className="demand-line-no">No</div>
            <div className="demand-line-SIN">Demand request</div>
            <div className="demand-line-date">Demand time</div>
        </div>
    )
}

export default DemandLine