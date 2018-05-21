const get_transit_options = require('../lib/xhr').get_transit_options;
const get_transit_explorer_data = require('../lib/xhr').get_transit_explorer_data;
const is_coordinate_routable = require('../lib/geo').is_coordinate_routable;

const sendPin = (x, y) => {
    return (dispatch, getState) => {
        const [lat, lng] = [y, x];
        if (is_coordinate_routable(lat, lng)) {
            const state = getState();

            if (!state.route_selection.start_pin.x && !state.route_selection.start_pin.y) {
                dispatch(sendStartPin(x, y));
            } else {
                if (!state.route_selection.end_pin.x && !state.route_selection.end_pin.y) {
                    dispatch(sendEndPin(x, y));
                    dispatch(setRouteLookupResponseStatus("IN_PROGRESS"));
                    // For beta purposes the departure time is hard-coded to a representative weekday.
                    // TODO: choose the most recent weekday, as of the time of the request.
                    // TODO: let users specify weekday, weeknight, weekend, weekend night options (wishlist).
                    get_transit_options(state.route_selection.start_pin.x, state.route_selection.start_pin.y, x, y,
                        '2018-05-15T12:00')
                        .then((transit_options) => {
                            // TODO: Signal on the front-end if the request fails.
                            dispatch(sendRouteLookupResponse(transit_options));
                            dispatch(setRouteLookupResponseStatus("READY"));
                            dispatch(setInfoPane("breadcrumbs"));
                        });
                }
            }
        }
    }
};

const sendStartPin = (x, y) => {
    return {
        type: 'SEND_START_PIN',
        x: x,
        y: y
    }
};

const sendEndPin = (x, y) => {
    return {
        type: 'SEND_END_PIN',
        x: x,
        y: y
    }
};

const sendRouteLookupResponse = (route_lookup_response) => {
    return {
        type: 'SEND_ROUTE_LOOKUP_RESPONSE',
        response: route_lookup_response
    }
};

const setRouteLookupResponseStatus = (status) => {
    // Send a flag indicating what state the Google Maps API route lookup is in.
    return {
        type: 'SET_ROUTE_LOOKUP_RESPONSE_STATUS',
        status: status
    }
};

const setUserSelectedRoute = (idx) => {
    // Send [the index of] the path the user selected to the DB.
    return {
        type: 'SET_USER_SELECTED_ROUTE',
        idx: idx
    }
};

const setInfoPane = (screen) => {
    return {
        type: 'SET_INFO_PANE',
        screen: screen
    }
};


const sendInfoPane = (screen) => {
    // TODO: Refactor this logic into two separate screen-setters.
    return (dispatch, getState) => {
        const transit_explorer_response_status = getState().route_selection.transit_explorer_response_status;
        const route_lookup_response_status = getState().route_selection.route_lookup_response_status;

        if ((screen === "breadcrumbs") && (route_lookup_response_status === "READY")) {
            dispatch(setInfoPane(screen));
        } else if ((screen !== "breadcrumbs") && (transit_explorer_response_status === "READY")) {
            dispatch(setInfoPane(screen));
        }
    };
};

const setTransitExplorerResponseStatus = (status) => {
    return {
        type: 'SET_TRANSIT_EXPLORER_RESPONSE_STATUS',
        status: status
    }
};

const setTransitExplorerResponse = (response) => {
    return {
        type: 'SEND_TRANSIT_EXPLORER_RESPONSE',
        response: response
    }
};

const sendTransitExplorerResponse = (idx) => {
    return (dispatch, getState) => {
        // Dispatch the selection state change immediately.
        dispatch(setUserSelectedRoute(idx));
        dispatch(setTransitExplorerResponseStatus("IN_PROGRESS"));

        // Asynchronously load and report the route lookup state change.
        const r = getState().route_selection.route_lookup_response[idx];

        get_transit_explorer_data(r)
            .then(r => {
                console.log("Data being sent to the state:");
                console.log(r);
                dispatch(setTransitExplorerResponse(r));
                dispatch(setTransitExplorerResponseStatus("READY"));
            });
    }
};

module.exports = {
    sendPin: sendPin,
    sendRouteLookupResponse: sendRouteLookupResponse,
    sendTransitExplorerResponse: sendTransitExplorerResponse,
    sendInfoPane: sendInfoPane
};