import React from 'react'
import { Link } from 'react-router-dom'

import './HomeLink.css'

function HomeLink(props) {
    return (
            <Link 
                to={props.to}
                className='home-link'
            >
                <div className="home-link-span">
                {props.linkName}
            {
                props.notif && props.notifNum!=='0'?
                <span className="home-notif">{props.notifNum}</span>
                :null
            }
                </div>
        </Link>
    )
}

export default HomeLink