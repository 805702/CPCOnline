import React,{Component} from 'react';
import { connect } from 'react-redux';

import HomeLink from './HomeLink/HomeLink';
import './Home.css'
import parseJwt from '../../../utils/parseJwt';

class Home extends Component{

    componentDidMount(){
        let userToken = localStorage.getItem('userToken')
        fetch('http://localhost:4000/api/user/getUser',{
            method:'post',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({
                idUser:parseJwt(userToken).phoneUser
            })
        })
        .then(data=>data.json())
        .then(result=>{
            if(result.roleUser!=='visitor'){
                this.props.dispatch({type: "LOAD_USER", payload: result.user})
            }
        })
        .catch(err=>{
            console.log("hello", err)
        })
    }

    render(){
        return (
            <div className='home-container'>
                <HomeLink to='/result' linkName='Consult results' notif={false} />
                <HomeLink to='/home' linkName='Notifications' notifNum='1' notif={true} />
                <HomeLink to='/demand' linkName='Request Exam' notif={false} />
                <HomeLink to='/home' linkName='Consult history' notif={false} />
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return{
        notification: state.Notification.notifications,
    }
}

export default  connect(mapStateToProps)(Home);