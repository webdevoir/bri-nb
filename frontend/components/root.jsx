import React from 'react';
import App from './app';
import { Provider } from 'react-redux';
import { Switch, Route, HashRouter } from 'react-router-dom';
import LoginFormContainer from './session_form/login_form_container';
import SignupFormContainer from './session_form/signup_form_container';
import SearchContainer from './home/search_container';
import NavContainer from './nav/nav_container';
import { AuthRoute, ProtectedRoute } from '../util/route_util';

const Root = ({ store }) => {
    
    return (
        <Provider store={store}>
            <HashRouter>
                <App />
            </HashRouter>
        </Provider>
    );
};

export default Root;