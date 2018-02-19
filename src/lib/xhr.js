// Library module which provides the XHR

const request = require('request-promise-native');

function get_transit_options(starting_x, starting_y, ending_x, ending_y) {
    // TODO: Properly lock down the route.
    return request(
        // "http://localhost:9000/starting_x=-73.954527&starting_y=40.587243&ending_x=-73.977756&ending_y=40.687163"
        `http://localhost:9000/starting_x=${starting_x}&starting_y=${starting_y}&ending_x=${ending_x}&ending_y=${ending_y}`
    ).then(
        function(body) {
            // TODO: Catch and return errors.
            let response = JSON.parse(body);
            let transit_options = [];
            response.routes.forEach(function(r) {
                let nlegs = r.legs.length;
                let [arrival_time, departure_time] = [r.legs[0].arrival_time.value, r.legs[nlegs - 1].arrival_time.value];
                let transit_option = [];
                r.legs.forEach(function(leg) {
                    leg.steps.forEach(function(step) {
                        let step_repr = {
                            travel_mode: step.travel_mode,
                            start_location: step.start_location,
                            end_location: step.end_location,
                            duration: step.duration
                        };
                        if (step.travel_mode === "WALKING") {
                            // TODO: Define a walking icon.
                            Object.assign(step_repr, {transit_type: "WALKING", icon: null, line: null});
                        } else if (step.travel_mode === "TRANSIT") {
                            Object.assign(step_repr, {
                                line: step.transit_details.line.short_name,
                                transit_type: step.transit_details.line.vehicle.type,
                                icon: step.transit_details.line.icon,
                            });
                        }
                        transit_option.push(step_repr);
                    });
                });
                transit_options.push(transit_option)
            });
            return transit_options;
        }
    );
}

module.exports = {get_transit_options: get_transit_options};