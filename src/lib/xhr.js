// Library module which provides the XHR
const request = require('request-promise-native');
const GMAPS_PROXY_SERVICE_URI = process.env.GMAPS_PROXY_SERVICE_URI;
const SUBWAY_EXPLORER_SERVICE_URI = process.env.SUBWAY_EXPLORER_SERVICE_URI;

function get_transit_options(starting_x, starting_y, ending_x, ending_y) {
    const uri = `http://${GMAPS_PROXY_SERVICE_URI}/starting_x=${starting_x}&starting_y=${starting_y}&ending_x=${ending_x}&ending_y=${ending_y}`;

    return request({
            resolveWithFullResponse: true,
            uri: `http://${GMAPS_PROXY_SERVICE_URI}/starting_x=${starting_x}&starting_y=${starting_y}&ending_x=${ending_x}&ending_y=${ending_y}`
    }).then(
        function(response) {
            console.log(`Station data request succeeded with status code ${response.statusCode}`);
            let result = JSON.parse(response.body);
            let transit_options = [];
            result.routes.forEach(function(r) {
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
    ).catch(err => console.error(`Station data request failed with status code ${err.statusCode}`));
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
    // TODO: Determine working timestamps for the DB.

    const transit_segment_leg_idxs = route.map((leg, idx) => leg.travel_mode === "WALKING" ? false : idx).filter(v => v);

    // Look up and assign station information.
    let xhr = transit_segment_leg_idxs.map((leg_idx) => {
        let leg = route[leg_idx];
        const s = {
            starting_x: leg.start_location.lng,
            starting_y: leg.start_location.lat,
            ending_x: leg.end_location.lng,
            ending_y: leg.end_location.lat,
            line: leg.line
        };

        return Promise.all([
            _request_station_info(s.line, s.starting_x, s.starting_y, route.heading,
                '2018-01-18T14:00'),
            _request_station_info(s.line, s.ending_x, s.ending_y, route.heading,
                '2018-01-18T14:00')
        ]);
    });

    // TODO: Reimplement this logic.
    // Suppose we have a trip containing a single leg. Then we may request API data independently and asynchronously.
    // Suppose we have a trip containing multiple legs. Then the arrival time for each train on each previous leg will
    // inform the arrival time of each train on the leg immediately thereafter. This is a dependency chain. It requires
    // promise chaining, which this current implementation doesn't handle.
    xhr = Promise.all(xhr).then(stations => {
        const requests = transit_segment_leg_idxs.map((leg_idx, station_idx) => {
            const leg = route[leg_idx];
            const start_station = stations[station_idx][0];
            const end_station = stations[station_idx][1];
            const s = {
                start: start_station.stop_id,
                end: end_station.stop_id,
                line: leg.line,
                timestamps: "2018-02-20T06:00"
            };
            return _request_route_info(s.line, s.start, s.end, s.timestamps).then(r => {
                return {
                    stations: {start: stations[station_idx][0], end: stations[station_idx][1]},
                    times: r
                };
            });
        });

        return Promise.all(requests);
    });

    // TODO: concatenate the station and timing data into one object and return that.
    return xhr.then(payload => {
        return payload;
    });
}

module.exports = {
    get_transit_options: get_transit_options,
    get_transit_explorer_data: get_transit_explorer_data
};