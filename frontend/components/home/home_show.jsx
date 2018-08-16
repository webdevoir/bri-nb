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
                            <div className="quick-info">
                                <div className="name-city-left">
                                    <div className="home-show-title">
                                        {home.name}
                                    </div>
                                    <div className="home-show-city">
                                        {home.city}
                                    </div>
                                </div>
                                <div className="host-photo-container">
                                    <div className="host-photo">
                                    
                                    </div>
                                </div>
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
                        <div className="home-show-map">
                            <Map
                                show="true"
                                homes={[home]}
                                center={center}
                                homeId={homeId}
                                fetchHome={fetchHome}
                            />
                        </div>
                    </div>
                    <div className="home-show-right">
                        <div className="reservation-container">
                            <div className="price-container">
                                <div className="price">
                                    <div className="value">
                                        ${home.price}
                                    </div>
                                    <div className="word">
                                        &nbsp; per night
                                    </div>
                                </div>
                                <div className="stars">
                                    <i className="fas fa-star fa-xs"></i>
                                    <i className="fas fa-star fa-xs"></i>
                                    <i className="fas fa-star fa-xs"></i>
                                    <i className="fas fa-star fa-xs"></i>
                                    <i className="fas fa-star fa-xs"></i>
                                    <div className="review-count">
                                        &nbsp; 217
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
 }

 export default HomeShow;