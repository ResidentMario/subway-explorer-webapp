import React from "react";
const Map = require('react-leaflet').Map;
const TileLayer = require('react-leaflet').TileLayer;

class Webmap extends React.Component {

    render() {

        let tiles = <TileLayer
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            key={1}
        />;

        let map_elements = [
            tiles
        ];

        return (
            <Map zoom={11}
                 center={[40.713575, -73.967016]}
                 onClick={this.props.onClick}>
                {map_elements}
            </Map>
        )

    }
}

export default Webmap