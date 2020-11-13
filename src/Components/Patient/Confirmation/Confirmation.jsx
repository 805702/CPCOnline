import React from 'react'
import { Link } from 'react-router-dom'
import Block from '../../../Global/Block/Block'

import './Confirmation.css'

export default function Confirmation(props) {
    return (
        <React.Fragment>
            <Block message={props.status?'Transaction success':'Transaction failed'} pageName={'Demand status'} />
            <div className={props.status?'cnfrm-hldr cnfrm-scs':"cnfrm-hldr cnfrm-fail"}>
                <i className={props.status?'fa fa-check confirmation-success':'fa fa-times confirmation-failed'} />
                <i className="confirmation-header">{props.status?'The transaction was successfull':'The transaction failed'}</i>
                {props.status && props.entryMethod==='text'?<i className="confirmation-message">
                    To <Link to='/result'>follow your demand</Link> click on the examinations on the navigaton and use this code to follow your demand
                </i>:(!props.status && props.entryMethod==='text'?
                <i className="confirmation-message">
                    The transaction failed either because it was canceled, it timed out or the server encountered an error
                        {/* <i className="try-dmd-agn">Try again</i> */}
                </i>:null)}
                {props.status && props.entryMethod==='image'?<i className='confirmation-message'>
                    To <Link to='/imageDemands'>follow your demand click here</Link>. Your demand was successfull will be treated and will notify you
                </i>:(!props.status && props.entryMethod==='image'?
                <i className='confirmation-message'>
                    The transaction could not be submitted. please try again
                </i>:null)}
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
