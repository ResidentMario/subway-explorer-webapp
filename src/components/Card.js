import React from "react";
import CardContent from "./CardContent";
import CardButton from "./CardButton";

class Card extends React.Component {

    render() {
        const className = this.props.active ? "card active" : "card inactive";

        return (
            <div className={className} onClick={this.props.onClick}>
                <div className={"highlight"}/>
                <div className={"card-body"}>
                    <CardContent textContent={this.props.textContent}/>
                    <CardButton active={this.props.active} status={this.props.status} icon={this.props.icon} />
                </div>
            </div>
        );
    }
}

export default Card