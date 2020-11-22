import React from 'react';

import logo from '../../assets/logo.png'
import './Block.css'

/**
 * 
 * <tt>Block</tt> will be used to display the header part of each page
 * @param {pageName} props will be used to display the various <tt>page names</tt>
 * @param {message} props will be used to display the guidance <tt>message</tt> of that page
 * @param {children} props will be used in case there is extra information to be passed to the header block.
 * the developper will have to design this as a component and pass it as a child to the <tt>Block</tt> component
 * @returns {JSX} to display the header <tt>Block</tt>
 */
export default function Block(props) {
    return (
        <div className="block-name">
            {props.message==='Validate your request' || props.pageName==='Complete Payment'?null:<img src={logo} alt='logo' style={{width: 89.7, height: 66.78}} />}
            <i className='page-name'>{props.pageName}</i>
            {props.message?<i className='block-message'>{props.message}</i>:null}
            {props.children}
        </div>
    )
}

