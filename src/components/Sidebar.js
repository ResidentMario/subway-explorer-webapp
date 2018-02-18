import React from "react";
const Map = require('react-leaflet').Map;
const TileLayer = require('react-leaflet').TileLayer;
const Marker = require('react-leaflet').Marker;
import Card from "./Card"


class Sidebar extends React.Component {

    render() {

        let active_card = null;
        if (this.props.start_pin.x && this.props.start_pin.y && this.props.end_pin.x && this.props.end_pin.y) {
            active_card = 3;
        } else if (this.props.start_pin.x && this.props.start_pin.y) {
            active_card = 2;
        } else {
            active_card = 1;
        }

        let status = this.props.route_lookup_response_status;

        let cards = [
            <Card active={active_card === 1} clicky={false}
                  textContent={"Drop a starting pin where your commute begins."} key={1}/>,
            <Card active={active_card === 2} clicky={false}
                  textContent={"Drop a stopping pin where your commute ends."} key={2}/>,
            <Card active={active_card === 3} clicky={false} status={status}
                  textContent={"Select your train line."} key={3}/>
        ];

        return (
            <div className={"sidebar"}>
                <div className={"sidebar-header"}>
                    {/* TODO: Find a non-deprecated way of horizontally aligning this. :) */}
                    <center>
                        <img className={"logo"} src="../static/subway-explorer-logo.png"/>
                    </center>
                </div>
                {cards}
            </div>);
    }
}

export default Sidebar