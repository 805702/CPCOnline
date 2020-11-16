import React, { Component } from 'react'
import parseJwt from '../../../utils/parseJwt'
import { connect } from 'react-redux';
import { toast, ToastContainer } from "react-toastify";

class ManageUsers extends Component {
  state = {
    phoneActifUser:null,
    confirmed:false,
    activateConfirm:false
  };

  componentDidMount() {
    let userToken = localStorage.getItem("userToken");
    fetch("http://localhost:4000/api/auth/validateToken", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: userToken }),
    })
    .then((data) => data.json())
    .then((result) => {
        if (!result.err) {
            this.props.dispatch({ type: "LOAD_USER", payload: result.theUser, });
            this.props.dispatch({ type: "LOAD_IS_AUTHENTICATED", payload: true, });
        if(this.props.isAuthenticated && this.props.user.roleUser==='admin')
            fetch('http://localhost:4000/api/user/getAllUsers',{
                method:'get',
                headers:{'Content-Type':'application/json'}
            }).then(data=>data.json())
            .then(result=>{
                if(!result.err){
                    if(result.dbReturn){
                        this.props.dispatch({type:'LOAD_PERSONNEL', payload:result.dbReturn})
                    }else this.NotifyOperationFailed("The result of the DB does not hold")
                }else if ( result.err.toString() === "TypeError: Failed to fetch" )
                    this.NotifyOperationFailed( "Verify that your internet connection is active" );
                else this.NotifyOperationFailed(result.err.toString());
            })
            .catch((err) => {
                if (err.toString() === "TypeError: Failed to fetch") {
                    this.NotifyOperationFailed( "Verify that your internet connection is active" );
                } else this.NotifyOperationFailed(err.toString());
            });

        } else if(!result.theUser)this.NotifyOperationFailed('No user found with given credentials')
        else if ( result.err.toString() === "TypeError: Failed to fetch" ) { 
        this.NotifyOperationFailed( "Verify that your internet connection is active" ); 
        } else if ( result.err.toString() === "Failed to authenticate token" ) this.NotifyOperationFailed("User not authenticated");
        else this.NotifyOperationFailed(result.err.toString());
    })
    .catch((err) => {
        if (err.toString() === "TypeError: Failed to fetch") {
        this.NotifyOperationFailed( "Verify that your internet connection is active" );
        } else if (err.toString() === "Failed to authenticate token") this.NotifyOperationFailed("User not authenticated");
        else this.NotifyOperationFailed(err.toString());
    });
  }

  NotifyOperationFailed(message) {
    return toast.error(message);
  }

  NotifyOperationSuccess(message) {
    return toast.success(message);
  }

  handlePatientClick=(phone)=>{
    if(this.state.phoneActifUser===phone)this.setState({phoneActifUser:null})
    else this.setState({phoneActifUser:phone})
  }

  handleDeactivateBtn=(e)=>{
    if(e.target.id==='no')this.setState({activateConfirm:false, confirmed:false})
    else this.setState({activateConfirm:false, confirmed:true})
  }

  confirmDeactivateUser=()=>{
    if(this.state.activateConfirm)
    return(
        <div className="deactivate-confirm-block">
            <span className="deactivate-message">
                { `Are you sure you want to deactivate User with phone ${this.state.phoneActifUser} `}
            </span>
            <span className="deactivate-btns">
                <button className='deactivate-no' id='no' onClick={this.handleDeactivateBtn}>NO</button>
                <button className='deactivate-yes' id='yes' onClick={this.handleDeactivateBtn}>YES</button>
            </span>
        </div>
    )
  }

  changeUserStatus(phone){
    // if(this.state.confirmed){
        let user = this.props.personnel.find(_=>_.phoneUser===phone)
        let status = 'inactive'
        if(user !== undefined  && user.statusUser === 'inactive') status='active'
        fetch('http://localhost:4000/api/user/deleteUser',{
            method:'post',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({phone, status})
        }).then(data=>data.json())
        .then(result=>{
            if(!result.err){
                this.NotifyOperationSuccess('User account was successfully deactivated')
                if(user !== undefined  && user.statusUser === 'inactive')
                this.props.dispatch({type:'ACTIVATE_USER', payload:phone})
                else this.props.dispatch({type:'DEACTIVATE_USER', payload:phone})
                // this.setState({confirmed:false})
            }else if ( result.err.toString() === "TypeError: Failed to fetch" )
                this.NotifyOperationFailed( "Verify that your internet connection is active" );
            else this.NotifyOperationFailed(result.err.toString());
        })
        .catch((err) => {
            if (err.toString() === "TypeError: Failed to fetch") {
                this.NotifyOperationFailed( "Verify that your internet connection is active" );
            } else this.NotifyOperationFailed(err.toString());
        });
    // }
  }

  modifyUserPassword(phone){
    const email = this.props.personnel.find(_=>_.phoneUser===phone).emailUser
    fetch('http://localhost:4000/api/user/resetPassword',{
        method:'post',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ phone, email })
    }).then(data=>data.json())
    .then(result=>{
        if(!result.err){
            this.NotifyOperationSuccess(`User password has been reset a mail has been sent to ${email} with the new password`)
        }else if ( result.err.toString() === "TypeError: Failed to fetch" )
            this.NotifyOperationFailed( "Verify that your internet connection is active" );
        else this.NotifyOperationFailed(result.err.toString());
    })
    .catch((err) => {
        if (err.toString() === "TypeError: Failed to fetch") {
            this.NotifyOperationFailed( "Verify that your internet connection is active" );
        } else this.NotifyOperationFailed(err.toString());
    });
  }

  styleUsers = ()=>{
    let users = this.props.personnel.sort((a,b)=>a.statusUser<b.statusUser?(a.phoneUser<b.phoneUser?1:-1):(a.roleUser<b.roleUser?1:-1))
    return users.map(theUser=>{
    // const theUser = this.props.personnel.find(user=>user.phoneUser===phoneUser)
    return(
        this.state.phoneActifUser!==theUser.phoneUser?(
            <div className="non-selected-userData" key={theUser.phoneUser} onClick={()=>this.handlePatientClick(theUser.phoneUser)}>
                <span className="non-slct-usr-data">{theUser.phoneUser}</span>
                <span className="non-slct-usr-data">{theUser.firstNameUser}</span>
                {theUser.roleUser!=='partner'?<span className="non-slct-usr-data">{theUser.lastNameUser}</span>
                :<span className="non-slct-usr-data">{theUser.emailUser}</span>}
                <span className="non-slct-usr-data">
                    {theUser.statusUser==='active'?<input type='checkbox' checked disabled />:<input type='checkbox' checked={false} disabled />}
                </span>
            </div>
        ):(
            // <div className="selected-user-data" key={theUser.phoneUser} onClick={()=>this.handlePatientClick(theUser.phoneUser)}>
            <div className="selected-user-data" key={theUser.phoneUser} >
                <span className="slctd-usr-data">
                    <i className="slctd-user-data-name">Phone: </i>
                    <i className='slctd-user-data-value'>{theUser.phoneUser}</i>
                </span>
                <span className="slctd-usr-data">
                    <i className="slctd-user-data-name">{theUser.roleUser!=='partner'?'First name: ':'Partner name: '}</i>
                    <i className='slctd-user-data-value'>{theUser.firstNameUser}</i>
                </span>
                
                {theUser.role!=='partner'?
                    <span className="slctd-usr-data">
                        <i className="slctd-user-data-name">Last name: </i>
                        <i className='slctd-user-data-value'>{theUser.lastNameUser}</i>
                    </span>:null
                }
                <span className="slctd-usr-data">
                    <i className="slctd-user-data-name">Birth date: </i>
                    <i className='slctd-user-data-value'>{theUser.dateOfBirthUser}</i>
                </span>
                <span className="slctd-usr-data">
                    <i className="slctd-user-data-name">Gender: </i>
                    <i className='slctd-user-data-value'>{theUser.genderUser.toUpperCase()}</i>
                </span>
                <span className="slctd-usr-data">
                    <i className="slctd-user-data-name">Role: </i>
                    <i className='slctd-user-data-value'>{theUser.roleUser.toUpperCase()}</i>
                </span>
                <span className="slctd-usr-data">
                    <i className="slctd-user-data-name">Email: </i>
                    <i className='slctd-user-data-value'>{theUser.emailUser}</i>
                </span>
                <span className="slctd-usr-data">
                    <i className="slctd-user-data-name">{theUser.roleUser!=='partner'?'Matricule: ':'Reduction: '}</i>
                    <i className="slctd-user-data-value">{theUser.specialData}</i>
                </span>
                <span className="slctd-usr-data">
                    <i className="slctd-user-data-name">User status: </i>
                    <i className="slctd-user-data-value">
                        {
                            theUser.statusUser==='active'?<input type='checkbox' checked onClick={()=>this.changeUserStatus(theUser.phoneUser)} />
                            :<input type='checkbox' checked={false} onClick={()=>this.changeUserStatus(theUser.phoneUser)}/>
                        }
                    </i>
                </span>
                <button onClick={()=>this.modifyUserPassword(theUser.phoneUser)}>Reset user password</button>
            </div>
        )
    )
    })
  }

  prepareUsersForStyling=()=>{
  }

  render() {
    const token = localStorage.getItem("userToken");
    return (token !== null && parseJwt(token).idUser !== undefined && this.props.isAuthenticated && this.props.user.roleUser==='admin')?
    (
        <div>
            {/* {this.confirmDeactivateUser()} */}
            {console.log('Hello')}
            {this.styleUsers()}
            <ToastContainer />
        </div>
    )
    :<span>Invalid User Sign in to get acces to this page.</span>
  }
}

const mapStateToProps=state=>{
    return{
        isAuthenticated:state.IsAuthenticated.isAuthenticated,
        user: state.User.user,
        personnel: state.Personnel.personnel
    }
}

export default connect(mapStateToProps)(ManageUsers)