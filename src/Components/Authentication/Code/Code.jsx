import React from 'react';
import ComponentMould from '../../../Global/ComponentMould/ComponentMould.jsx';
import Block from '../../../Global/Block/Block.jsx';
import UserLogin from '../UserLogin/UserLogin.jsx';
import './Code.css'
import '../Password/Password.css'
import 'react-toastify/dist/ReactToastify.css';
import CodeForm from './CodeForm.jsx';




function Code(props) {
    return (
        <ComponentMould>
            <Block pageName='Welcome'>
                <UserLogin login={props.login} />
            </Block>
            <CodeForm dispatch={props.dispatch} />
        </ComponentMould>
    )
}

export default Code