import React from 'react';
import './ComponentMould.css';

/**
 * 
 * ComponentMould is the part general to all components to give their form
 * @param {children} props contains all the children passed as props
 * these <tt>children</tt> is the JSX that will be displayed in the component
 * @returns {JSX} the interface presents the page as should be
 */
export default function ComponentMould(props){
    return(
        <div className="component-container">
            <div className="component-holder">
                {props.children}
            </div>
        </div>
    )
}