import React from 'react';
import HomeIndexItem from './home_index_item';
import { withRouter } from 'react-router';

class HomeIndex extends React.Component {

    render() {
        let { homes } = this.props;
        return (
            <div>
                <h1 className="home-number"> {homes.length} homes </h1>
                <ul className="home-index-container">
                    {homes.map(home => (
                        <HomeIndexItem
                            key={home.id}
                            home={home}
                        />
                    ))}
                </ul>
            </div>
        );
    }
}

export default withRouter(HomeIndex);