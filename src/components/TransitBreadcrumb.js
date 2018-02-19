import React from "react";

class TransitBreadcrumb extends React.Component {

    render() {
        let icons = this.props.transit_option.map(step => {
            if (step.travel_mode === "WALKING") {
                return "../static/icon-walking.png"
            } else {
                return step.icon;
            }
        });
        let total_travel_time = this.props.transit_option.map(step => step.duration.value).reduce((a, b) => a + b, 0);

        return <div className={"transit-breadcrumb"} onClick={this.props.onClick}>
            <div className={"transit-breadcrumb-breakdown"}>
                {icons.map(uri => <img src={uri} className="transit-breadcrumb-line-indicator-icon"/>)}
            </div>
            <div className={"transit-breadcrumb-time"}>{Math.round(total_travel_time / 60)} mins</div>
        </div>
    }

}

export default TransitBreadcrumb