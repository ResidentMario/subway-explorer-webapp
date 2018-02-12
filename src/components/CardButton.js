import React from "react";


class CardButton extends React.Component {

    render() {
        let className = "card-button";
        className += this.props.active ? " active" : " inactive";
        className += (this.props.active && this.props.clicky) ? " clicky" : "";

        return (
            <div className={className}>
                <div className={"card-button-content"}>
                    <img src="../static/arrow.png" className={"card-button-image"}/>
                </div>
            </div>
        );
    }
}

export default CardButton