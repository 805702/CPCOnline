import React from 'react';

import ComponentMould from '../../../Global/ComponentMould/ComponentMould.jsx';
import Block from '../../../Global/Block/Block.jsx';
import UserLogin from '../UserLogin/UserLogin.jsx';
import './Password.css'
import PasswordForm from './PasswordForm.jsx';


function Password(props) {
  return (
    <ComponentMould>
      <Block pageName='Welcome'>
          <UserLogin login={props.login} />
      </Block>
      <PasswordForm />
    </ComponentMould>
  )
}

export default Password
