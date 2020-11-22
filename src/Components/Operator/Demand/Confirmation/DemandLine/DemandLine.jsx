import React from 'react';

import './DemandLine.css'

function DemandLine(props){
    return(
        props.td?
        <div className="demand-GIN" key={props.SIN} onClick={()=>props.onClick(props.SIN)} >
            <div className="demand-GIN-indicator"></div>
            <div className="demand-GIN-data" >
                <span className="clickable-area" >
                    <span className="demand-GIN-data-group">
                        <i className="demand-GIN-data-label">Demand id:</i>
                        <i className="demand-GIN-data-value">{props.SIN}</i>
                    </span>
                    <span className="demand-GIN-data-group">
                        <i className="demand-GIN-data-label">Demand date:</i>
                        <i className="demand-GIN-data-value">{props.date}</i>
                    </span>
                </span>
            </div>
        </div>
        :<div className="demand-GIN" key={props.SIN} onClick={()=>props.onClick(props.SIN)} >
            <div className="demand-GIN-indicator"></div>
            <div className="demand-GIN-data" >
                <span className="clickable-area" >
                    <span className="demand-GIN-data-group">
                        <i className="demand-GIN-data-label">No demands</i>
                        <i className="demand-GIN-data-value">awaiting confirmation</i>
                    </span>
                </span>
            </div>
        </div>
    )
}

export default DemandLine