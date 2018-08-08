import React from 'react';
import ReactDOM from 'react-dom';

import * as ApiUtil from './util/session_api_util';

window.login = ApiUtil.login;
window.logout = ApiUtil.logout;
window.signup = ApiUtil.signup;
window.user = { user: { email: 'brian@brian.com', password: '123456', first_name: 'brian', last_name: 'jeong' } };
window.user2 = { user: { email: 'jeong@jeong.com', password: '123456', first_name: 'brian', last_name: 'brian' } };

document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    ReactDOM.render(<h1>Welcome to Bri-nb</h1>, root);
});