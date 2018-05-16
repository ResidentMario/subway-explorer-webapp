import React from "react";
const Map = require('react-leaflet').Map;
const Polyline = require('react-leaflet').Polyline;
const TileLayer = require('react-leaflet').TileLayer;
let polyline = require('@mapbox/polyline');
// import { Transition } from 'react-transition-group';

class ViewerWebmap extends React.Component {

    render() {

        // Build the map.
        let tiles = <TileLayer
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            key={1}
        />;

        console.log(this.props);
        let polylines = this.props.transit_explorer_response
            .map(leg => polyline.decode(leg.polyline))
            .map(latLngList => <Polyline positions={latLngList}/>);

        let map_elements = [tiles, ...polylines];

        return [<Map zoom={11}
                     center={[40.713575, -73.967016]}>
            {map_elements}
        </Map>];
    }
}

export default ViewerWebmap