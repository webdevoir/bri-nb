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
                                <div className="text">
                                    {home.description}
                                </div>
                                <div className="read-more">
                                    <span>Read more about the space </span>
                                    &nbsp;
                                    <i className="fas fa-angle-down"></i>
                                </div>
                                <div className="contact-host">
                                    <span>Contact host</span>
                                </div>
                            </div>
                        </div>
                        <div className="amenities-container">

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
                            <form>
                                <div className="date-container">
                                    <div className="date-label">
                                        <div>
                                            <span>Dates</span>
                                        </div>
                                    </div>
                                    <div className="calendar-input">
                                        <input type="date" />
                                        <input type="date" />
                                    </div>
                                </div>
                                <div className="guest-container">
                                    <div className="guest-label">
                                        <div>
                                            <span>Guests</span>
                                        </div>
                                    </div>
                                    <div className="guest-input">
                                        <select>
                                            <option>1 Guest</option>
                                            <option>2 Guests</option>
                                            <option>3 Guests</option>
                                            <option>4 Guests</option>
                                            <option>5 Guests</option>
                                            <option>6 Guests</option>
                                            <option>7 Guests</option>
                                            <option>8 Guests</option>
                                            <option>9 Guests</option>
                                            <option>10 Guests</option>
                                            <option>11 Guests</option>
                                            <option>12 Guests</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="button-container">
                                    <button type="submit">Book</button>
                                </div>
                            </form>
                            <div className="additional-info">
                                <span className="notice">You won't be charged yet</span>
                                <span className="disclaimer-1">This home is on people’s minds.</span>
                                <span className="disclaimer-2">It’s been viewed 500+ times in the past week.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
 }

 export default HomeShow;