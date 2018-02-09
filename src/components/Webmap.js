import React from "react";
const Map = require('react-leaflet').Map;
const TileLayer = require('react-leaflet').TileLayer;

class Webmap extends React.Component {
    handleClick(e) {
        console.log(e);
    }

    render() {

        let tiles = <TileLayer
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            key={1}
        />;

        // TODO: All the other map elements!
        let map_elements = [
            tiles
        ];

        return (
            <Map zoom={11}
                 center={[40.713575, -73.967016]}
                 onClick={(e) => { this.handleClick(e); }}>
                {map_elements}
            </Map>
        )

    }
}

export default Webmap