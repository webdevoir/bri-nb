import React from 'react';
import HomeIndexItem from './home_index_item';

class HomeIndex extends React.Component {

    render() {
        return (
            <div>
                <h1>Homes: </h1>
                {this.props.homes.map(home => (
                    <HomeIndexItem
                        home={home}
                        key={home.id}
                    />
                ))}
            </div>
        );
    }
}

export default HomeIndex;