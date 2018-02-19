import React from "react";
import Card from "./Card"


class Sidebar extends React.Component {

    render() {

        let cards = [];

        // Route selection mode.
        if (this.props.route_selected_idx === null) {
            let active_card = null;
            if (this.props.start_pin.x && this.props.start_pin.y && this.props.end_pin.x && this.props.end_pin.y) {
                active_card = 3;
            } else if (this.props.start_pin.x && this.props.start_pin.y) {
                active_card = 2;
            } else {
                active_card = 1;
            }

            let status = this.props.route_lookup_response_status;

            cards = cards.concat([
                <Card active={active_card === 1} clicky={false}
                      textContent={"Drop a starting pin where your commute begins."} key={1}/>,
                <Card active={active_card === 2} clicky={false}
                      textContent={"Drop a stopping pin where your commute ends."} key={2}/>,
                <Card active={active_card === 3} clicky={false} status={status}
                      textContent={"Select your train line."} key={3}/>
            ]);

        }

        // Route observation mode.
        else {
            cards = cards.concat([
                <Card active={false} clicky={false}
                      textContent={"View webmap."} key={1}/>,
                <Card active={false} clicky={false}
                      textContent={"View polylines."} key={2}/>
            ]);
        }

        // Should we attach the CSS transitional animation?
        let className = "sidebar";
        className += (this.props.route_selected_idx !== null) ? " sidebar-transition-in" : "";

        return (
            <div className={className}>
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