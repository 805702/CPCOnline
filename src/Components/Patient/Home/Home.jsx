import React from 'react';
import { connect } from 'react-redux';

import HomeLink from './HomeLink/HomeLink';
import './Home.css'

// this.props.dispatch({type:'VIEW_NOTIFICATION', payload:notification})

function Home(props) {
    return (
        <div className='home-container'>
            <HomeLink to='/home' linkName='Consult results' notif={false} />
            <HomeLink to='/home' linkName='Notifications' notifNum='1' notif={true} />
            <HomeLink to='/demand' linkName='Request Exam' notif={false} />
            <HomeLink to='/home' linkName='Consult history' notif={false} />
        </div>
    )
}

const mapStateToProps = state =>{
    return{
        notification: state.Notification.notifications
    }
}

export default  connect(mapStateToProps)(Home);