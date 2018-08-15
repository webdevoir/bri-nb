import React from 'react';
import { withRouter } from 'react-router';

class Homepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search_content: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.history.push('/search');
        // this.props.search(this.state)
        //     .then(data => this.props.history.push(`/search/${data.id}`));
    }

    update(field) {
        return (e) => {
            this.setState({ [field]: e.target.value });
        };
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
                        <form onSubmit={this.handleSubmit}>
                            <input 
                                type="text" 
                                placeholder="Try 'Homes in Tokyo'" 
                                onChange={this.update("search_content")}
                            />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Homepage);