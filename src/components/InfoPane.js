import React from "react";
import TransitBreadcrumbContainer from "../containers/TransitBreadcrumbContainer";
import { Transition } from 'react-transition-group';
import ViewerWebmap from "../components/ViewerWebmap";
import ArrivalVisualization from "../components/ArrivalVisualization";

class InfoPane extends React.Component {

    paint(duration, animation_state) {
        const defaultStyle = {
            transition: `opacity ${duration}ms ease-in-out, left ${duration}ms ease-in-out`
        };
        const transitionStyles = {
            entering: {opacity: 0, left:'22%'},
            entered: {opacity: 1, left:'20%'},
            exiting: {opaciy: 1, left:'20%'},
            exited: {opacity: 0, left:'22%'}
        };

        let inner = null;
        if (this.props.screen === "breadcrumbs") {
            const breadcrumbs = this.props.route_lookup_response.map((opt, i) => {
                return <TransitBreadcrumbContainer transit_option={opt} key={i} idx={i}/>
            });

            if (breadcrumbs.length > 0) {
                inner = <div className={"breadcrumbs-container"}>{breadcrumbs}</div>;
            } else {
                inner = <div className={"breadcrumbs-container"}>
                    No valid transit options found ¯\_(ツ)_/¯. <a href=".">Try another route.</a>
                </div>
            }
        } else if (this.props.screen === "webmap") {
            inner = <div className={"webmap-infopane-container"}>
                {<ViewerWebmap transit_explorer_response={this.props.transit_explorer_response}/>}
                </div>;
        } else if (this.props.screen === "arrivals") {
            inner = <div className={"arrivals-infopane-container"}>
                {<ArrivalVisualization transit_explorer_response={this.props.transit_explorer_response}/>}
                </div>;
        }

        return <div className="info-pane"
                    style={{...defaultStyle, ...transitionStyles[animation_state]}}>
            {inner}
        </div>
    }

    render() {
        const duration = 200;

        // `isin` controls the React animation state. `ispainted` controls whether or not the InfoPane is rendered.
        const isin = (this.props.screen === "breadcrumbs" || this.props.screen === "webmap"
            || this.props.screen === "arrivals");
        const ispainted = this.props.route_lookup_response_status === "READY";

        return (
            <Transition in={isin} timeout={duration} unmountOnExit={true}>
                {(animation_state) => {
                    if (ispainted) {
                        return this.paint(duration, animation_state);
                    } else {
                        return null;
                    }
                }}
            </Transition>
        );
    }

}

export default InfoPane