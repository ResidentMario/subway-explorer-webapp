// Library module which provides the XHR
const request = require('request-promise-native');
const GMAPS_PROXY_SERVICE_URI = process.env.GMAPS_PROXY_SERVICE_URI;
const SUBWAY_EXPLORER_SERVICE_URI = process.env.SUBWAY_EXPLORER_SERVICE_URI;

function get_transit_options(starting_x, starting_y, ending_x, ending_y) {
    // TODO: Properly lock down the route.
    return request(
        `http://${GMAPS_PROXY_SERVICE_URI}/starting_x=${starting_x}&starting_y=${starting_y}&ending_x=${ending_x}&ending_y=${ending_y}`
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

function _request_station_info(line, x, y, heading, time) {
    return request(
        `http://${SUBWAY_EXPLORER_SERVICE_URI}/locate-stations/json?line=${line}&x=${x}&y=${y}&heading=${heading}&time=${time}`
    ).then(body => JSON.parse(body));
}

function get_transit_explorer_data(route) {
    const heading = route.starting_y < route.ending_y ? "N" : "S";
    const transit_segments = route.filter((leg) => leg.line !== null).map(leg => {
        // TODO: Unroll this into a dict directly.
        const [st, en] = [leg.start_location, leg.end_location];
        const [starting_x, starting_y, ending_x, ending_y] = [st.lat, st.lng, en.lat, en.lng];
        return {
            starting_x: starting_x,
            starting_y: starting_y,
            ending_x: ending_x,
            ending_y: ending_y,
            line: leg.line
        }
    });
    const station_information_queries = [];
    transit_segments.forEach((s) => {
        station_information_queries.push(...[
            // TODO: Use a live time.
            _request_station_info(s.line, s.starting_x, s.starting_y, heading, '2018-01-18T14:00'),
            _request_station_info(s.line, s.ending_x, s.ending_y, '2018-01-18T14:00')
        ]);
    });
    return Promise.all(transit_segments).then(() => {
        console.log(station_information_queries);
        // TODO: Feed the stations here into the Explorer API to get back data.
        return {a: 'b'};
    });
}

module.exports = {
    get_transit_options: get_transit_options,
    get_transit_explorer_data: get_transit_explorer_data
};