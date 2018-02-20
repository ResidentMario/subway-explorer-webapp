import React from "react";
import TransitBreadcrumbContainer from "../containers/TransitBreadcrumbContainer";

class InfoPane extends React.Component {

    render() {
        // Render transit breadcrumbs when a response is ready.
        if (this.props.route_lookup_response_status === "READY") {
            const breadcrumbs = this.props.route_lookup_response.map((opt, i) =>
                <TransitBreadcrumbContainer transit_option={opt} key={i} idx={i}/>
            );

            let className = "info-pane";
            className += (this.props.route_selected_idx !== null) ? " info-pane-fadeout info-pane-post-fadeout" : "";

            return (
                <div className={className}>
                    <div className={"breadcrumbs-container"}>{breadcrumbs}</div>
                </div>
            );
        }

        // Render nothing when this element is not necessary.
        else {
            return null;
        }
    }

}

export default InfoPane