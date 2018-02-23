import React from "react";
import TransitBreadcrumbContainer from "../containers/TransitBreadcrumbContainer";
import { Transition } from 'react-transition-group';

class InfoPane extends React.Component {

    paint(duration, animation_state) {
        const defaultStyle = {
            transition: `opacity ${duration}ms ease-in-out, left ${duration}ms ease-in-out`,
            opacity: 0,
        };
        const transitionStyles = {
            entering: {opacity: 0, left:'22%'},
            entered: {opacity: 1, left:'20%'},
            exiting: {opaciy: 1, left:'20%'},
            exited: {opacity: 0, left:'22%'}
        };

        const breadcrumbs = this.props.route_lookup_response.map((opt, i) =>
            <TransitBreadcrumbContainer transit_option={opt} key={i} idx={i}/>
        );

        return <div className="info-pane"
                    style={{...defaultStyle, ...transitionStyles[animation_state]}}>
            <div className={"breadcrumbs-container"}>{breadcrumbs}</div>
        </div>
    }

    render() {
        const duration = 200;

        // `isin` controls the React animation state. `ispainted` controls whether or not the InfoPane is rendered.
        const isin = ((this.props.route_lookup_response_status === "READY") && (this.props.route_selected_idx === null));
        const ispainted = this.props.route_lookup_response_status === "READY";

        return (
            <Transition in={isin} timeout={duration}>
                {(animation_state) => ispainted ? this.paint(duration, animation_state) : null}
            </Transition>
        );
    }

}

export default InfoPane