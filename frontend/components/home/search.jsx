import React from 'react';

// import FilterForm from './filter_form';
import HomeIndex from './home_index';
import Map from './map';

class Search extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){

        let { homes } = this.props;
        console.log(this.props.homes);
        
        return (
            <div className="user-pane">
                <div className="left-half" >
                    <h5 > Click Map to Add Home! </h5>
                    <Map
                        homes={homes}
                        center={{ lat: 37.7758, lng: -122.435 }}
                    // updateFilter={updateFilter}
                    />
                </div>
                <div className="right-half">
                    {/* <FilterForm updateFilter={updateFilter} /> */}
                    <HomeIndex homes={homes} />
                </div>
            </div>
        );
    }

}

export default Search;