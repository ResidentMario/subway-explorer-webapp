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
                <CardContainer active={active_card === 1}
                      textContent={"Drop a starting pin where your commute begins."} key={1}/>,
                <CardContainer active={active_card === 2}
                      textContent={"Drop a stopping pin where your commute ends."} key={2}/>,
                <CardContainer active={active_card === 3} status={status}
                      textContent={"Select your train line."} key={3}/>
            ]);

        }

        // Route observation mode.
        else {
            cards = cards.concat([
                <CardContainer active={true} activated={true} screen={null}
                      textContent={"View webmap."} key={1}/>,
                <CardContainer active={true} activated={false} screen={"arrivals"}
                      textContent={"View arrivals."} key={2}/>
            ]);
        }

        return cards;
    }

    render() {

        const cards = this.make_cards();
        const duration = 200;
        const isin = this.props.route_selected_idx !== null;
        const defaultStyle = {
            transition: `left ${duration}ms ease-in-out`,
            left: 0,
        };
        const transitionStyles = {
            entering: {left: '-20%'},
            entered: {left: '0%'}
        };

        return (
            <Transition in={this.props.route_selected_idx !== null} timeout={duration}>
                {(animation_state) => (
                    <div className={"sidebar"} style={{...defaultStyle, ...transitionStyles[animation_state]}}>
                        <div className={"sidebar-header"}>
                            {/* TODO: Find a non-deprecated way of horizontally aligning this. :) */}
                            <center>
                                <img className={"logo"} src="../static/subway-explorer-logo.png"/>
                            </center>
                        </div>
                        {cards}
                    </div>
                )}
            </Transition>
        )
    }
}

export default Sidebar