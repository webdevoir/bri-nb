import React from 'react';
import ReactDOM from 'react-dom';
import MarkerManager from '../../util/marker_manger';

// just a normal react component class :)
class Map extends React.Component {
    constructor(props) {
        super(props);
        this.addHome = this.addHome.bind(this);
    }

    componentDidMount() {
        const map = ReactDOM.findDOMNode(this.refs.map);

        const options = {
            center: this.props.center,
            zoom: 13
        };

        this.map = new google.maps.Map(map, options);
        this.MarkerManager = new MarkerManager(this.map);
        this.listenForMove();

        this.props.homes.forEach(home => this.addHome(home));
        console.log(this.props.homes);
    }

    addHome(home) {
        const pos = new google.maps.latlng(home.latitude, home.longitude);

        const marker = new google.maps.Marker({
            position: pos,
            map: this.map
        });

        marker.addListener('click', () => {
            alert(`clicked on: ${home.name}`);
        });
    }

    listenForMove() {
        google.maps.event.addListener(this.map, 'idle', () => {
            const bounds = this.map.getBounds();
            alert('map has moved, check console to see updated bounds');

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
        return (
            <div>
                <span>MAP DEMO</span>
                <div ref="map" id='map-container' ref="map"/>
                </div>
        );
    }
}

export default Map;