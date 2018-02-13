let maps = require('@google/maps');

/* SUBROUTINES */
// TODO: Place these in a separate file.
// TODO: Introduce a mechanism for reading the API key from ENVIRONMENT_VARS.
function fetch_transit_directions(starting_x, starting_y, ending_x, ending_y) {
    let client = maps.createClient({key: "INSERT_KEY_HERE"});
    client.directions(
        {'origin': [starting_y, starting_x], 'destination': [ending_y, ending_x],
            'mode': 'transit', 'transit_mode': 'subway'},
        function(err, response) {
            return response;
        }
    );
}

function get_transit_options(starting_x, starting_y, ending_x, ending_y) {
    const response = fetch_transit_directions(starting_x, starting_y, ending_x, ending_y);

    if (response.status !== "200") { return {status: "ERROR"} }

    let transit_options = [];
    response.json.routes.forEach(function(r) {
        let nlegs = r.length;
        let [arrival_time, departure_time] = [r.legs[0].arrival_time.value, r.legs[nlegs - 1].arrival_time.value];
        let transit_option = [];
        r.legs.forEach(function(leg) {
            leg.steps.forEach(function(step) {
                let step_repr = {travel_mode: step.travel_mode};
                if (step.travel_mode === "WALKING") {
                    return step_repr
                } else if (step.travel_mode === "TRANSIT") {
                    let transit_details = {
                        end_stop: step.transit_details.arrival_stop.location,
                        start_stop: step.transit_details.departure_stop.location,
                        line: step.transit_details.line.short_name,
                        transit_type: step.transit_details.line.vehicle.type,
                        icon: step.transit_details.line.icon
                    };
                }
            });
        });
    });
}

/* REDUCERS */
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

    else if (action.type === "SEND_PIN") {
        if (previousState.start_pin.x !== null && previousState.end_pin.x !== null) {
            // We have already dropped our pins, so ignore.
            return previousState
        }
        else if (previousState.start_pin.x !== null) {
            // This is the end pin. Store it in the state, then perform the Google Maps API lookup and push that to the
            // front-end.
            // TODO: GMaps API Lookup
            get_transit_options(previousState.start_pin.y, previousState.start_pin.x, action.y, action.x);
            return Object.assign({}, previousState, {end_pin: {x: action.x, y: action.y}, route_lookup_confirmed: true});
        }
        else {
            // This is the start pin. Store it in the state.
            return Object.assign({}, previousState, {start_pin: {x: action.x, y: action.y}});
        }
    }

    else if (action.type === 'STORE_ROUTE_LOOKUP_RESPONSE') {
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