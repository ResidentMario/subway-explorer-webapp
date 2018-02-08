import React from "react";

class Webmap extends React.Component {
    render() {
        return (<span>{this.props.center}, {this.props.zoom}</span>);
    }
}

export default Webmap