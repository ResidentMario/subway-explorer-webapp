import React from "react";
import CardContent from "./CardContent";
import CardButton from "./CardButton";

class Card extends React.Component {

    render() {
        const className = this.props.active ? "card active" : "card inactive";

        return (
            <div className={className}>
                <div className={"highlight"}/>
                <div className={"card-body"}>
                    <CardContent textContent={this.props.textContent}/>
                    <CardButton active={this.props.active} clicky={this.props.clicky} />
                </div>
            </div>
        );
    }
}

export default Card