const sendPin = (x, y) => {
    return {
        type: 'SEND_PIN',
        x: x,
        y: y
    }
};

const confirmRouteLookup = () => {
    // Send a flag indicating that the user has confirmed their start and end pins to the database.
    return {
        type: 'CONFIRM_LOOKUP'
    }
};

const storeRouteLookupResponse = () => {
    // Send the result of the what-are-my-stations query against the Google Maps API to the DB.
    return {
        type: 'STORE_ROUTE_LOOKUP_RESPONSE'
    }
};

// TODO: Names and structures subject to change.
const setRouteLookupResponseStatus = () => {
    // Send a flag indicating whether the Google Maps API route lookup succeeded or failed.
    return {
        type: 'SET_ROUTE_LOOKUP_RESPONSE_STATUS'
    }
};

const setUserSelectedRoutingOption = (idx) => {
    // Send [the index of] the path the user selected to the DB.
    return {
        type: 'SET_USER_SELECTED_ROUTING_OPTION',
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

const setPage = (page) => {
    // Send the page the application is on.
    return {
        type: 'SET_PAGE',
        page: page
    }
};

const reset = () => {
    // Reset the application to the original state.
    return {
        type: 'RESET'
    }
};

module.exports = {
    sendPin: sendPin,
    confirmRouteLookup: confirmRouteLookup,
    storeRouteLookupResponse: storeRouteLookupResponse,
    setRouteLookupResponseStatus: setRouteLookupResponseStatus,
    setSelectedRoute: setUserSelectedRoutingOption,
    setRouteTimingsLookupResponse: setRouteTimingsLookupResponse,
    setRouteTimingsLookupResponseStatus: setRouteTimingsLookupResponseStatus,
    setPage: setPage,
    reset: reset
};