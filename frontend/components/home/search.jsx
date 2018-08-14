import React from 'react';
import HomeIndex from './home_index';
import Map from './map';

class Search extends React.Component {
    constructor(props) {
        super(props);
    }

    // componentDidMount() {
    //     this.props.fetchHomes();
    // }

    render() {
        console.log("I guess this should run twice?");
        let { homes, center, updateFilter } = this.props;
        return (
            <div className="user-pane">
                <div className="left-half">
                    <HomeIndex 
                        homes={homes} 
                    />
                </div>
                <div className="right-half" >
                    {homes && 
                    <Map
                        homes={homes}
                        center={center}
                        updateFilter={updateFilter}
                    />
                    }
                </div>
            </div>
        );
    }

}

export default Search;