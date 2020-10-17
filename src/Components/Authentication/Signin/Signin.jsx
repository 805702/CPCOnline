import React from 'react';

import ComponentMould from '../../../Global/ComponentMould/ComponentMould.jsx';
import Block from '../../../Global/Block/Block.jsx';
import SigninForm from './SigninForm';
import './Signin.css'


function Signin(props) {
    return (
    <ComponentMould>
      <Block pageName='Welcome' message="Welcome to CPCOnline" />
      <SigninForm uploadPhone={props.uploadPhone}/>
    </ComponentMould>
    )
}

export default Signin