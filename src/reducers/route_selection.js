const route_selection = (previousState, action) => {

    if (typeof previousState === 'undefined') {
        return {
            start_pin: {x: null, y:null},
            end_pin: {x: null, y: null},
            route_lookup_confirmed: false,
            route_lookup_response_status: null,
            route_lookup_response: null,
            route_selected_idx: null
        };
    }

    else if (action.type === 'SET_START_PIN') {
        return Object.assign({}, previousState, {start_pin: {x: action.x, y: action.y}});
    }

    else if (action.type === 'SET_STOP_PIN') {
        return Object.assign({}, previousState, {stop_pin: {x: action.x, y: action.y}});
    }

    else if (action.type === 'CONFIRM_LOOKUP') {
        return Object.assign({}, previousState, {route_lookup_confirmed: true})
    }

    else if (action.type === 'STORE_ROUTE_LOOKUP_RESPONSE') {
        // TODO: Implement the Google Maps API query.
        let response = null;
        return Object.assign({}, previousState, {route_lookup_response: response})
    }

    else if (action.type === 'SET_USER_SELECTED_ROUTING_OPTION') {
        // TODO: Figure out how to transition from selecting a route to the Subway Explorer lookup and past that.
        // Needs a separate reducer.
        return Object.assign({}, previousState, {route_selected_idx: action.idx})
    }

    else {
        return previousState;
    }

};

export default route_selection