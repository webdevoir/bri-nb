import React from 'react';
import App from './app';
import { Provider } from 'react-redux';
import { Switch, Router, Route, IndexRoute, HashRouter } from 'react-router-dom';
import LoginFormContainer from './session_form/login_form_container';
import SignupFormContainer from './session_form/signup_form_container';
import { AuthRoute, ProtectedRoute } from '../util/route_util';

const Root = ({ store }) => {
    
    return (
        <Provider store={store}>
            <HashRouter>
                <Switch>
                    <AuthRoute path="/login" component={LoginFormContainer} />
                    <AuthRoute path="/signup" component={SignupFormContainer} />
                    <Route path="/" component={App} />
                </Switch>
            </HashRouter>
        </Provider>
    );
};

export default Root;