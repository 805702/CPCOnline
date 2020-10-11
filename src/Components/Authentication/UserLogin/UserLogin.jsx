import React from 'react';
import './UserLogin.css'

/**
 * 
 * <tt>UserLogin</tt> is the component that styles the user login details during sign in
 * @param {login} props will be used to display the user login detail during sign in
 * this will be displayed in the <tt>Block</tt> component
 * @returns {JSX} to display the user login details
 */
export default function UserLogin(props){
    return(
        <div className="user-login">
            <i className="fa fa-user-circle" />
            <i>{props.login}</i>
        </div>
    )
}
