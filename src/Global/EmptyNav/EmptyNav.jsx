import React from 'react'
import logo from '../assets/logo.png'
import './EmptyNav.css'

/**
 * 
 * The navigation bar for the signin page
 * contains the <tt>CPC</tt> logo
 * @returns {JSX} to display the nav bar
 */
export default function EmptyNav() {
    return (
      <div className="empty-nav">
        <img src={logo} alt="logo" style={{ width: 61, height: 51 }} />
      </div>
    );
}
