import React from "react";

class Webmap extends React.Component {
    render() {
        return (<div onMouseOver={this.props.onMouseOver}>{this.props.center}, {this.props.zoom}</div>);
    }
}

export default Webmap