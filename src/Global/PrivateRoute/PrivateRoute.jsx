import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";
import { connect } from "react-redux";

function PrivateRoute( {render, children, isAuthenticated, ...rest } ) {
  return (
    <Route
      {...rest}
      render={(renderProps) =>{
        return isAuthenticated ? (
          render(renderProps)
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: renderProps.location },
            }}
          />
        )
      }}
    />
  );
}

const mapStateToProps=state=>{
    return{
        isAuthenticated: state.IsAuthenticated.isAuthenticated
    }
}

export default connect(mapStateToProps)(PrivateRoute)