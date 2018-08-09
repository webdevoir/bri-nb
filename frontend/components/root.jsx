import React from 'react';
import App from './app';
import { Provider } from 'react-redux';
import { Switch, Router, Route, IndexRoute, HashRouter } from 'react-router-dom';
import SessionFormContainer from './session_form/session_form_container';

const Root = ({ store }) => (
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route path="/" component={App}/>
            </Switch>
        </HashRouter>
    </Provider>
);

export default Root;