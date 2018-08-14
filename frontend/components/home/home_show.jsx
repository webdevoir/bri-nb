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
        let { home, homeId, fetchHome } = this.props;
        let homes = { [homeId]: home };
        const center = { lat: 37.76962, lng: -122.42205 };

        return (
            <div>
                <div> HELLOOOO</div>
                <Map
                    show="true"
                    homes={homes}
                    center={center}
                    homeId={homeId}
                    fetchHome={fetchHome}
                />
            </div>
        );
    }
 }

 export default HomeShow;