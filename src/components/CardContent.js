import React from "react";


class CardContent extends React.Component {

    render() {
        return (
            <div className={"card-body"}>
                <div className={"card-content"}>
                    {this.props.textContent}
                </div>
            </div>
        );
    }
}

export default CardContent