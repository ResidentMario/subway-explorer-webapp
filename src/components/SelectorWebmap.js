import React from "react";
const Map = require('react-leaflet').Map;
const TileLayer = require('react-leaflet').TileLayer;
const Marker = require('react-leaflet').Marker;

class SelectorWebmap extends React.Component {

    render() {

        // Build the map.
        let tiles = <TileLayer
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            key={1}
        />;

        let map_elements = [
            tiles
        ];

        if (this.props.start_pin.x) {
            map_elements.push(<Marker position={[this.props.start_pin.y, this.props.start_pin.x]} key={2}/>)
        }
        if (this.props.end_pin.x) {
            map_elements.push(<Marker position={[this.props.end_pin.y, this.props.end_pin.x]} key={3}/>)
        }

        return <div className="selector-webmap"><Map zoom={11} center={[40.713575, -73.967016]} onClick={this.props.onClick}>{map_elements}</Map></div>
    }
}

export default SelectorWebmap