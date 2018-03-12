import React from "react";


class CardButton extends React.Component {

    render() {
        let className = "card-button";
        className += this.props.active ? " active" : " inactive";

        let thumb = null;
        if (this.props.active && this.props.status === "IN_PROGRESS") {
            thumb = <img src="../static/loading.gif" className={"card-button-image"}/>
        } else {
            thumb = <img src="../static/arrow.png" className={"card-button-image"}/>
        }

        return (
            <div className={className}>
                <div className={"card-button-content"}>
                    {thumb}
                </div>
            </div>
        );
    }
}

export default CardButton