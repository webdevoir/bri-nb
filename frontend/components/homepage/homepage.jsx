import React from 'react';
import { withRouter } from 'react-router';

class Homepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search_content: ""
        };
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {



        return (
            <div className="-page">
                <div className="home-searchbar">
                    <div className="search-slogan">
                        <h1>Book unique homes and</h1>
                        <h1>experiences all over the world.</h1>
                    </div>
                    <div className="search-container">
                        <input type="text" placeholder="Try 'Homes in Tokyo'" />
                    </div>
                </div>
            </div>
        );
    }
}

export default Homepage;