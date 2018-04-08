/* REDUCERS */
const route_selection = (previousState, action) => {

    if (typeof previousState === 'undefined') {
        return {
            start_pin: {x: null, y:null},
            end_pin: {x: null, y: null},
            route_lookup_response_status: null,
            route_lookup_response: null,
            route_selected_idx: null
        };
    }

    else if (action.type === "SEND_START_PIN") {
        if (previousState.start_pin.x !== null) {
            return previousState
        } else {
            return Object.assign({}, previousState, {start_pin: {x: action.x, y: action.y}});
        }
    }

    else if (action.type === "SEND_END_PIN") {
        if (previousState.end_pin.x !== null) {
            return previousState
        } else {
            return Object.assign({}, previousState, {end_pin: {x: action.x, y: action.y}});
        }
    }

    else if (action.type === 'SEND_ROUTE_LOOKUP_RESPONSE') {
        return Object.assign({}, previousState, {route_lookup_response: action.response});
    }

    else if (action.type === 'SET_ROUTE_LOOKUP_RESPONSE_STATUS') {
        return Object.assign({}, previousState, {route_lookup_response_status: action.status});
    }

    else if (action.type === 'SET_USER_SELECTED_ROUTE') {
        if (previousState.route_selected_idx === null) {
            return Object.assign({}, previousState, {route_selected_idx: action.idx});
        } else {
            return previousState;
        }
    }

    else if (action.type === 'SEND_TRANSIT_EXPLORER_RESPONSE') {
        return Object.assign({}, previousState, {transit_explorer_response: action.response});
    }

    else if (action.type === "SET_TRANSIT_EXPLORER_RESPONSE_STATUS") {
        return Object.assign({}, previousState, {transit_explorer_response_status: action.status})
    }

    else {
        return previousState;
    }

};

export default route_selection