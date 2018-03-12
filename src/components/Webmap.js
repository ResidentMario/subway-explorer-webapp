import React from "react";
const Map = require('react-leaflet').Map;
const TileLayer = require('react-leaflet').TileLayer;
const Marker = require('react-leaflet').Marker;
import { Transition } from 'react-transition-group';

class Webmap extends React.Component {

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

        // Build the hider element.
        const defaultStyle = {
            transition: `opacity ${duration}ms ease-in-out`,
            opacity: 0,
        };
        const transitionStyles = {
            entering: {opacity: 0},
            entered: {opacity: 1}
        };
        const isin = (this.props.route_lookup_response_status === "READY");
        const ispainted = (this.props.route_lookup_response_status === "READY");
        const duration = 200;
        let hider = <Transition in={isin} timeout={duration}>
            {(animation_state) => ispainted ? <div className="hider" style={{...defaultStyle, ...transitionStyles[animation_state]}}/> : null}
        </Transition>;

        return [<Map zoom={11}
                 center={[40.713575, -73.967016]}
                 onClick={this.props.onClick}>
                {map_elements}
        </Map>, hider];
    }
}

export default Webmap