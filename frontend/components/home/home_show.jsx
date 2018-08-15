 import React from 'react';
 import Map from './map';

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
                <div> HELLOOOO</div>
                <div className="big-photo">
                    The big photo will go here
                </div>
                <div className="home-show-content">
                    <div className="home-show-left">
                        This is the left side of the show page
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