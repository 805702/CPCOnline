import React from 'react'
import { Link } from 'react-router-dom'
import Block from '../../../Global/Block/Block'

import './Confirmation.css'

export default function Confirmation(props) {
    console.log(props)
    return (
        <React.Fragment>
            <Block message={props.status?'Transaction success':'Transaction failed'} pageName={'Demand status'} />
            <div className={props.status?'cnfrm-hldr cnfrm-scs':"cnfrm-hldr cnfrm-fail"}>
                <i className={props.status?'fa fa-check confirmation-success':'fa fa-times confirmation-failed'} />
                <i className="confirmation-header">{props.status?'The transaction was successfull':'The transaction failed'}</i>
                {props.status?<i className="confirmation-message">
                    To <Link to='/examinations'>follow your demand</Link> click on the examinations on the navigaton and use this code to follow your demand
                </i>:
                <i className="confirmation-message">
                    the transaction failed either because it was canceled or it timed out 
                        <i className="try-dmd-agn">Try again</i>
                </i>}
                <i className="thanks">Thank you for trusting CPC</i>
                {props.status?<div className="demand-code">
                    <i className="confirmation-label">Demand code:</i>
                    <i className="confirmation-code">{props.SIN}</i>
                </div>:null}
                <i className="home-btn"><Link to='/home'>Back to Home</Link></i>
            </div>
        </React.Fragment>
    )
}
