import 'antd/dist/antd.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home';
import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
import SignUp from './components/SignUp';
import Verify from './components/Veify';
import PrivateRoute from './routing/PrivateRoute';
import PublicRoute from './routing/PublicRoute';
import setAuthToken from './utils/setAuthToken';
axios.defaults.baseURL = '/backend';

const App = ({ token, loading }) => {
  useEffect(() => {
    setAuthToken(token);
    return () => {
      setAuthToken(null);
    };
  }, [token]);
  return (
    <div>
      <Router>
        <>
          <Switch>
            <PrivateRoute
              loading={loading}
              token={token}
              exact
              path='/'
              component={Home}
            />
            <PublicRoute exact token={token} path='/login' component={Login} />
            <PublicRoute
              exact
              token={token}
              path='/signup'
              component={SignUp}
            />
            <PublicRoute token={token} path='/verify/:id' component={Verify} />
            <PublicRoute
              token={token}
              path='/reset/:id'
              component={ResetPassword}
            />
            <PublicRoute
              exact
              token={token}
              path='/forgetPassword'
              component={ForgotPassword}
            />
          </Switch>
        </>
      </Router>
    </div>
  );
};

const mapStateToProps = ({ user: { token, loading } }) => ({
  token,
  loading,
});
export default connect(mapStateToProps)(App);
