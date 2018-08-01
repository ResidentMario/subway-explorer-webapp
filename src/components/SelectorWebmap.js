import React from "react";
const Map = require('react-leaflet').Map;
const TileLayer = require('react-leaflet').TileLayer;
const Marker = require('react-leaflet').Marker;
const unclickable_geometries = require('../lib/geo').unclickable_geometries;
const clickable_geometries = require('../lib/geo').clickable_geometries;
const Polygon = require('react-leaflet').Polygon;
const Icon = require('leaflet').Icon;
// import Leaflet from 'leaflet';


const start_icon = new Icon({
    iconUrl: '../../static/start-pin.png',
    // shadowUrl: require('../public/marker-shadow.png'),
    iconSize:     [32, 60], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [0, 60], // point of the icon which will correspond to marker's location
    // shadowAnchor: [4, 62],  // the same for the shadow
    // popupAnchor:  [-3, -76]// point from which the popup should open relative to the iconAnchor
});

// const start_icon = new Leaflet.Icon({
//     iconUrl: '../../static/start-pin.png',
//     // shadowUrl: require('../public/marker-shadow.png'),
//     iconSize:     [32, 60], // size of the icon
//     // shadowSize:   [50, 64], // size of the shadow
//     iconAnchor:   [0, 60], // point of the icon which will correspond to marker's location
//     // shadowAnchor: [4, 62],  // the same for the shadow
//     // popupAnchor:  [-3, -76]// point from which the popup should open relative to the iconAnchor
// });


class SelectorWebmap extends React.Component {

    render() {

        // Add the basic tile layer.
        let tiles = <TileLayer
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            key={1}
        />;

        let map_elements = [
            tiles
        ];

        // Add the boundaries.
        map_elements.push(<Polygon positions={unclickable_geometries} stroke={false} color={'transparent'} className={'forbidden-geometry'}/>);
        map_elements.push(<Polygon positions={clickable_geometries} color={'black'} weight={1} fillOpacity={0}/>);

        // Add pins.
        if (this.props.start_pin.x) {
            map_elements.push(
                <Marker
                    position={[this.props.start_pin.y, this.props.start_pin.x]}
                    key={2}
                    icon={new Icon({iconUrl: '../../static/start-pin.png', iconSize: [32, 60], iconAnchor: [0, 60]})}
                />)
        }
        if (this.props.end_pin.x) {
            map_elements.push(
                <Marker
                    position={[this.props.end_pin.y, this.props.end_pin.x]}
                    key={3}
                    icon={new Icon({iconUrl: '../../static/end-pin.png', iconSize: [32, 60], iconAnchor: [0, 60]})}
                />)
        }

        return <div className="selector-webmap"><Map zoom={11} center={[40.713575, -73.807016]} onClick={this.props.onClick}>{map_elements}</Map></div>
    }
}

export default SelectorWebmap