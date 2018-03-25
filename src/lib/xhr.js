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

                // TODO: Correctly determine the train heading, according to MTA rules.
                const [start_lat, end_lat] = [
                    r.legs[0].start_location.lat,
                    r.legs[r.legs.length - 1].end_location.lat
                ];
                transit_option.heading = (start_lat < end_lat) ? "N" : "S";
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

function _request_route_info(line, start, end, timestamps) {
    return request(
        `http://${SUBWAY_EXPLORER_SERVICE_URI}/poll-travel-times/json?line=${line}&start=${start}&end=${end}&timestamps=${timestamps}`
    ).then(body => JSON.parse(body));
}

function get_transit_explorer_data(route) {
    const transit_segment_keys = route.map((leg, idx) => leg.travel_mode === "WALKING" ? false : idx).filter(v => v);

    // Look up and assign station information.
    let p = transit_segment_keys.map((key) => {
        const leg = route[key];
        const s = {
            starting_x: leg.start_location.lng,
            starting_y: leg.start_location.lat,
            ending_x: leg.end_location.lng,
            ending_y: leg.end_location.lat,
            line: leg.line
        };

        // TODO: Find an idempotent way of performing these data operations!
        
        // TODO: debug doubled-up station assignment.
        let a = _request_station_info(s.line, s.starting_x, s.starting_y, route.heading, '2018-01-18T14:00').then(r => {
            leg.start_station = r;
        });
        let b = _request_station_info(s.line, s.ending_x, s.ending_y, route.heading, '2018-01-18T14:00').then(r => {
            leg.end_station = r;
        });
        return Promise.all([a, b]).then(() => route);
    });

    // TODO: Determine working timestamps for the DB.
    // Look up and assign subway explorer routing information.
    let p2 = Promise.all(p).then(route => {
        console.log(route);

        return transit_segment_keys.map((key) => {
            // TODO: Continue building this out.
            const leg = route[key];
            console.log(leg);
            console.log(leg.start_station);
            const s = {
                start: leg.start_station.stop_id,
                end: leg.end_station.stop_id,
                line: leg.line,
                timestamps: "2018-02-20T06:00"
            };
            return _request_route_info(s.line, s.start, s.end, s.timestamps).then(r => leg.data = r);
        });
    });

    return Promise.all(p2).then(() => route);
}

module.exports = {
    get_transit_options: get_transit_options,
    get_transit_explorer_data: get_transit_explorer_data
};