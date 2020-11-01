import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import './App.css';
import Code from './Components/Authentication/Code/Code.jsx';
// import Login from './Components/Authentication/Login/Login';
import Password from './Components/Authentication/Password/Password';
import Signin from './Components/Authentication/Signin/Signin';
import Confirm from './Components/Operator/Demand/Confirm/Confirm';
import GINConfirm from './Components/Operator/Demand/GINConfirm/GINConfirm';
import Home from './Components/Patient/Home/Home';
import RequestEstimate from './Components/Patient/RequestEstimate/RequestEstimate';
import Results from './Components/Patient/Results/Results';

class App extends Component {
  render(){
    return (
      <Router>
        <Switch>
            <Route exact path='/'><Signin dispatch={this.props.dispatch} /></Route>
            <Route exact path='/demand'> <RequestEstimate dispatch={this.props.dispatch} /></Route>
            <Route exact path='/login/:login' render={
              ()=>{
                const login = window.location.pathname.split('_')
                if(login.length === 2 && /^((6[5-9])|(2[2-3]))[0-9]{7}$/i.test(login[1])){
                  switch(login[0]){
                    case '/login/password':
                      return <Password login={login[1]} dispatch={this.props.dispatch} />
                    case '/login/code':
                      return <Code login={login[1]} dispatch={this.props.dispatch} />
                    default:
                      return <Redirect to='/' />
                  }
                }else return <Redirect to='/' />
              }
            } />
            <Route exact path='/patientHome' component={Home} />
            <Route exact path='/adminHome' component={Home} />
              {/* ()=>{
                //get user role from the token  and redirect to the right page.
                //do an if to verify if the localStorage has the user.
                //the switch
                let user='patient'
                switch(user){
                  default:
                    return <Home />
                }
              }
            } /> */}
            <Route exact path='/result'><Results dispatch={this.props.dispatch} /></Route>
            <Route exact path='/confirmDemands'><GINConfirm dispatch={this.props.dispatch} /></Route>
            <Redirect to='/' />
        </Switch>
      </Router>
    );
  }
}

export default App;
