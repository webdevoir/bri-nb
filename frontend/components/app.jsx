import React from 'react';
import GreetingContainer from './greeting/greeting_container';

const App = ({ children }) => (
    <div>
        <h1>bri-nb</h1>
        <GreetingContainer />
        {children}
    </div>
);

export default App;