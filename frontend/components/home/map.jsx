import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import MarkerManager from '../../util/marker_manger';

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.addHome = this.addHome.bind(this);
    }

    componentDidMount() {
        // this.props.show == "true" ? this.props.fetchHome(this.props.homeId) : this.props.fetchHomes();
        const map = ReactDOM.findDOMNode(this.refs.map);

        const options = {
            center: this.props.center,
            zoom: 13
        };

        this.map = new google.maps.Map(map, options);
        this.MarkerManager = new MarkerManager(this.map);
        this.MarkerManager.updateMarkers(this.props.homes);
        this.listenForMove();

        this.props.homes.forEach(home => this.addHome(home));

    }

    componentWillReceiveProps() {
        this.props.homes.forEach(this.addHome);
    }

    componentDidUpdate() {
        this.MarkerManager.updateMarkers(this.props.homes);
    }

    addHome(home) {
        const pos = new google.maps.LatLng(home.latitude, home.longitude);

        const marker = new google.maps.Marker({
            position: pos,
            map: this.map
        });

        marker.addListener('click', () => {
            this.props.history.push(`/homes/${home.id}`);
        });
    }

    listenForMove() {
        google.maps.event.addListener(this.map, 'idle', () => {
            const bounds = this.map.getBounds();

            if(this.props.show != "true"){
                this.props.updateFilter("bounds", bounds);
            }

            console.log('center',
                bounds.getCenter().lat(),
                bounds.getCenter().lng());
            console.log("north east",
                bounds.getNorthEast().lat(),
                bounds.getNorthEast().lng());
            console.log("south west",
                bounds.getSouthWest().lat(),
                bounds.getSouthWest().lng());
        });
    }

    render() {
        if (!this.props.homes.length > 1) return null;
        return (
            <div>
                <div ref="map" id='map-container' ref="map"/>
            </div>
        );
    }
}

export default withRouter(Map);