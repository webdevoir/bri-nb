import React from 'react';
import ReactDOM from 'react-dom';

import Root from './components/root';
import configureStore from './store/store';
import { fetchHomes } from './actions/home_actions';

document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    let store;

    if (window.currentUser) {
        const { currentUser } = window;
        const { id } = currentUser;
        const preloadedState = { 
            entities: {
                users: { [id]: currentUser }
            },
            session: { id }
        };
        store = configureStore(preloadedState);
        window.store=store;
        // Clean up after ourselves so we don't accidentally use the
        // global currentUser instead of the one in the store
        delete window.currentUser;
    } else {
        store = configureStore();
    }

    window.dispatch = store.dispatch;
    window.getState = store.dispatch;
    window.fetchHomes = fetchHomes;
    
    ReactDOM.render(<Root store={ store }/>, root);
});