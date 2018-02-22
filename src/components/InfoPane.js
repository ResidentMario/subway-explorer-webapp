import React from "react";
import TransitBreadcrumbContainer from "../containers/TransitBreadcrumbContainer";
import { Transition } from 'react-transition-group';
// import InfoPaneTransition from "./InfoPaneTransition";

class InfoPane extends React.Component {

    render() {
        // Render transit breadcrumbs when a response is ready.
        const duration = 200;
        return (
            <Transition in={this.props.route_lookup_response_status === "READY"} timeout={duration}>
                {(animation_state) => {
                    if (this.props.route_lookup_response_status !== "READY") {
                        return null;
                    } else {
                        const breadcrumbs = this.props.route_lookup_response.map((opt, i) =>
                            <TransitBreadcrumbContainer transit_option={opt} key={i} idx={i}/>
                        );

                        const defaultStyle = {
                            transition: `opacity ${duration}ms ease-in-out, left ${duration}ms ease-in-out`,
                            opacity: 0,
                        };

                        const transitionStyles = {
                            entering: {opacity: 0, left:'22%'},
                            entered: {opacity: 1, left:'20%'}
                        };

                        return <div className="info-pane"
                                    style={{...defaultStyle, ...transitionStyles[animation_state]}}>
                            <div className={"breadcrumbs-container"}>{breadcrumbs}</div>
                        </div>
                    }
                }}
            </Transition>
        );
    }

}

export default InfoPane