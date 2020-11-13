import React, { Component } from 'react'
import { connect } from 'react-redux'
import './DemandResults.css'
import { toast, ToastContainer } from 'react-toastify'
import DemandResultLine from '../DemandResultLine/DemandResultLine'

function NotifyOperationFailed(message) {
  return toast.error(message);
}

function NotifyOperationSuccess(message) {
  return toast.success(message);
}


class DemandResults extends Component {
    state={
        GIN:'',
        action:''
    }



    componentDidMount(){
        // loadData into demandResults
        if (!this.props.isAuthenticated) {
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
            const { roleUser } = this.props.user;
            const wanted = ['operator','admin'];
            if(this.props.isAuthenticated && wanted.includes(roleUser)){

              fetch('http://localhost:4000/api/result/getDueResults',{
                method:'get',
                headers:{'Content-Type':'application/json'}
              }).then(data=>data.json())
              .then(result=>{
                if(!result.err && result.dbRes){
                  this.props.dispatch({type:'LOAD_DEMAND_RESULTS', payload:result.dbRes})
                }else if (result.err.toString() === "TypeError: Failed to fetch") {
                    NotifyOperationFailed( "Verify that your internet connection is active" );
                }else NotifyOperationFailed(result.err.toString())
              }).catch(err=>{
                if (err.toString() === "TypeError: Failed to fetch") {
                  NotifyOperationFailed( "Verify that your internet connection is active" );
                }else NotifyOperationFailed(err.toString())
              })

            }else NotifyOperationFailed(`${roleUser.toUpperCase()} user not abilitated to view this page`)
            
          } else if(!result.theUser)NotifyOperationFailed('No user found with given credentials')
          else if ( result.err.toString() === "TypeError: Failed to fetch" ) { 
            NotifyOperationFailed( "Verify that your internet connection is active" ); 
            } else if ( result.err.toString() === "Failed to authenticate token" ) NotifyOperationFailed("User not authenticated");
          else NotifyOperationFailed(result.err.toString());
        })
        .catch((err) => {
          if (err.toString() === "TypeError: Failed to fetch") {
            NotifyOperationFailed( "Verify that your internet connection is active" );
          } else if (err.toString() === "Failed to authenticate token") NotifyOperationFailed("User not authenticated");
          else NotifyOperationFailed(err.toString());
        });
      }
    }

    handleResultClick=(GIN)=>{
        if(this.state.GIN===GIN)this.setState({GIN:''})
        else this.setState({GIN})
    }

    styleDemands=()=>{
      if(this.props.demandResults.length!==0){
        return this.props.demandResults.map((aDemand, index)=>{
            let dueDateTime = aDemand.dueDate.split('T')
            dueDateTime[1] = dueDateTime[1].split('.0')[0]
            dueDateTime[0] = new Date(dueDateTime[0]).toUTCString().split(' G')[0]
            dueDateTime[0] = dueDateTime[0].split(' ')
            dueDateTime[0] = `${dueDateTime[0][0]} ${dueDateTime[0][1]} ${dueDateTime[0][2]} ${dueDateTime[0][3]}`
            dueDateTime = dueDateTime.join(' at ')
            return <DemandResultLine
              No={index+1}
              GIN={aDemand.GIN}
              date={dueDateTime}
              fDate={aDemand.dueDate}
              td={true}
              open={this.state.GIN===aDemand.GIN}
              onClick={this.handleResultClick}
              action={this.state.action}
              dispatch={this.props.dispatch}
              key={aDemand.GIN}
            />
        })
      }else return 'No results to display'
    }

    render() {
        return (
          <div className="demand-results-holder">
            <DemandResultLine td={false} />
            {this.styleDemands()}
            <ToastContainer />
          </div>
        );
    }
}

const mapStateToProps=state=>{
    return{
        demandResults: state.DemandResults.demandResults,
        isAuthenticated: state.IsAuthenticated.isAuthenticated,
        user: state.User.user
    }
}

export default connect(mapStateToProps)(DemandResults)