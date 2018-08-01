import React from "react";
import CardContainer from "../containers/CardContainer"
import { Transition } from 'react-transition-group';


class Sidebar extends React.Component {

    make_cards() {
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

            const status = this.props.route_lookup_response_status;

            cards = cards.concat([
                <CardContainer
                    active={active_card === 1}
                    textContent={"Welcome to the Subway Explorer! To get started, click on the map to drop a pin where your commute begins."}
                    key={1}
                    icon={"../static/start-pin-head.png"}
                />,
                <CardContainer
                    active={active_card === 2}
                    textContent={"Now click on the map to drop a pin where your commute ends."}
                    key={2}
                    icon={"../static/end-pin-head.png"}
                />,
                <CardContainer
                    active={active_card === 3}
                    status={status}
                    textContent={"Now select your train line."}
                    key={3}
                    icon={"../static/q-train-logo.png"}
                />
            ]);

        }

        // Route observation mode.
        else {
            const status = this.props.transit_explorer_response_status;

            cards = cards.concat([
                <CardContainer
                    active={true}
                    activated={true}
                    status={status}
                    screen={"webmap"}
                    textContent={"Click here to view the route map."}
                    icon={"../static/map.png"}
                    key={1}/>,
                <CardContainer
                    active={true}
                    activated={false}
                    screen={"arrivals"}
                    status={status}
                    icon={"../static/timeline.png"}
                    textContent={"Click here to view past arrivals."}
                    key={2}/>
            ]);
        }

        return cards;
    }

    render() {

        const cards = this.make_cards();
        const duration = 200;
        const isin = this.props.route_selected_idx !== null;
        const defaultStyle = {
            transition: `opacity ${duration}ms ease-in-out`,
            opacity: 1,
        };
        const transitionStyles = {
            entering: {opacity: 0},
            entered: {opacity: 1}
        };

        return (
            <Transition in={this.props.route_selected_idx !== null} timeout={duration}>
                {(animation_state) => (
                    <div className={"sidebar"} style={{...defaultStyle, ...transitionStyles[animation_state]}}>
                        <div className={"sidebar-header"}>
                            {/* TODO: Find a non-deprecated way of horizontally aligning this. :) */}
                            <center>
                                <img className={"logo"} src="../static/subway-explorer-logo-new.png"/>
                            </center>
                        </div>
                        {(animation_state) === "entered" || (animation_state) === "exited" ? cards : null}
                    </div>
                )}
            </Transition>
        )
    }
}

export default Sidebar