const get_transit_options = require('../lib/xhr').get_transit_options;

const sendPin = (x, y) => {
    return (dispatch, getState) => {
        const state = getState();

        if (!state.route_selection.start_pin.x && !state.route_selection.start_pin.y) {
            dispatch(sendStartPin(x, y));
        } else {
            if (!state.route_selection.end_pin.x && !state.route_selection.end_pin.y) {
                dispatch(sendEndPin(x, y));
                dispatch(setRouteLookupResponseStatus("IN_PROGRESS"));
                get_transit_options(state.route_selection.start_pin.x, state.route_selection.start_pin.y, x, y)
                    .then((transit_options) => {
                        // TODO: Signal on the front-end if the request fails.
                        dispatch(sendRouteLookupResponse(transit_options));
                        dispatch(setRouteLookupResponseStatus("READY"));
                    });
            }
        }
    };
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

const setRouteTimingsLookupResponse = (response) => {
    // Send the result of the what-are-my-travel times query against the Subway Explorer API to the DB.
    return {
        type: 'SET_ROUTE_TIMINGS_LOOKUP_RESPONSE',
        response: response
    }
};

const setRouteTimingsLookupResponseStatus = (status) => {
    // Send a flag indicating whether the Subway Explorer API route lookup succeeded or failed.
    return {
        type: 'SET_ROUTE_LOOKUP_RESPONSE_STATUS',
        status: status
    }
};

const reset = () => {
    // Reset the application to the original state.
    return {
        type: 'RESET'
    }
};

const setInfoPane = (screen) => {
    return {
        type: 'SET_INFO_PANE',
        screen: screen
    }
};

module.exports = {
    sendPin: sendPin,
    sendRouteLookupResponse: sendRouteLookupResponse,
    setUserSelectedRoute: setUserSelectedRoute,
    setRouteTimingsLookupResponse: setRouteTimingsLookupResponse,
    setRouteTimingsLookupResponseStatus: setRouteTimingsLookupResponseStatus,
    reset: reset,
    setInfoPane: setInfoPane
};