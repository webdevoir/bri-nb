import React from 'react';
import App from './app';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, HashRouter } from 'react-router-dom';

const Root = ({ store }) => (
    <Provider store={store}>
        <HashRouter>
            <Route path="/" component={App} />
        </HashRouter>
    </Provider>
);

export default Root;