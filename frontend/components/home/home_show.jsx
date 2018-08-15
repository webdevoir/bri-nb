 import React from 'react';
 import Map from './map';
 import {withRouter} from 'react-router';

 class HomeShow extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchHome(this.props.homeId);
    }

    render() {
        if (!this.props.home) return null;
        let { home, homeId, fetchHome } = this.props;
        const center = { lat: 37.76962, lng: -122.42205 };

        return (
            <div>
                <div className="big-photo">
                </div>
                <div className="home-show-content">
                    <div className="home-show-left">
                        <div className="home-show-details">
                            <div className="home-show-title">
                                {home.name}
                            </div>
                            <div className="home-show-city">
                                {home.city}
                            </div>
                            <div className="home-show-info">
                                <div>
                                    <span><i className="fas fa-users fa-xs"></i></span>
                                    <span> {home.max_guests} guests</span>
                                </div>
                                <div>
                                    <span><i className="fas fa-door-open fa-xs"></i></span>
                                    <span>{home.num_rooms} rooms</span>
                                </div>
                                <div>
                                    <span><i className="fas fa-bed fa-xs"></i></span>
                                    <span>{home.num_beds} beds</span>
                                </div>
                                <div>
                                    <span><i className="fas fa-bath fa-xs"></i></span>
                                    <span>{home.num_baths} baths</span>
                                </div>
                            </div>
                            <div className="home-show-description">
                                {home.description}
                            </div>
                        </div>
                    </div>
                    <div className="home-show-right">
                        This is the right side of the show page
                    </div>
                </div>
                <Map
                    show="true"
                    homes={[home]}
                    center={center}
                    homeId={homeId}
                    fetchHome={fetchHome}
                />
            </div>
        );
    }
 }

 export default HomeShow;