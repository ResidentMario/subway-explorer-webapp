const setStartPin = (x, y) => {
    // Send the start point pin to the store.
    return {
        type: 'SET_START_PIN',
        x: x,
        y: y
    }
};

const setEndPin = (x, y) => {
    // Send the endpoint pin to the store.
    return {
        type: 'SET_END_PIN',
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

const storeRouteLookupResponse = (response) => {
    // Send the result of the what-are-my-stations query against the Google Maps API to the DB.
    return {
        type: 'STORE_ROUTE_LOOKUP_RESPONSE',
        response: response
    }
};

const setRouteLookupResponseStatus = (status) => {
    // Send a flag indicating whether the Google Maps API route lookup succeeded or failed.
    return {
        type: 'SET_ROUTE_LOOKUP_RESPONSE_STATUS',
        status: status
    }
};

const setSelectedRoute = (idx) => {
    // Send [the index of] the path the user selected to the DB.
    return {
        type: 'SET_SELECTED_ROUTE',
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
    setStartPin: setStartPin,
    setEndPin: setEndPin,
    confirmRouteLookup: confirmRouteLookup,
    storeRouteLookupResponse: storeRouteLookupResponse,
    setRouteLookupResponseStatus: setRouteLookupResponseStatus,
    setSelectedRoute: setSelectedRoute,
    setRouteTimingsLookupResponse: setRouteTimingsLookupResponse,
    setRouteTimingsLookupResponseStatus: setRouteTimingsLookupResponseStatus,
    setPage: setPage,
    reset: reset
};