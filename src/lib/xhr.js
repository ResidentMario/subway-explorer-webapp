// Library module which provides the XHR
const request = require('request-promise-native');
const moment = require('moment');
const GMAPS_PROXY_SERVICE_URI = process.env.GMAPS_PROXY_SERVICE_URI;
const SUBWAY_EXPLORER_SERVICE_URI = process.env.SUBWAY_EXPLORER_SERVICE_URI;

function get_transit_options(starting_x, starting_y, ending_x, ending_y) {
    // Given a set of start and end coordinates, query the Google Maps Proxy Service and return a list of possible
    // transit routes between those two points.
    // TODO: add timestamp parameter (currently the routing is done as-of-now).

    const uri = `http://${GMAPS_PROXY_SERVICE_URI}/starting_x=${starting_x}&starting_y=${starting_y}&ending_x=${ending_x}&ending_y=${ending_y}`;

    return request({
            resolveWithFullResponse: true,
            uri: uri
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
                            Object.assign(step_repr,
                                {transit_type: "WALKING", icon: "../static/icon-walking.png", line: null});
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

                // Every train in the MTA system is either northbound or southbound, even on routes or segments of
                // routes where the train is actually travelling more in the east-west direction. Hack alert: for now
                // we determine the heading naively and hope for the best.
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
    // Helper function which queries the Subway Explorer station locator code path.
    return request(
        `http://${SUBWAY_EXPLORER_SERVICE_URI}/locate-stations/json?line=${line}&x=${x}&y=${y}&heading=${heading}&time=${time}`
    ).then(body => JSON.parse(body));
}

function _request_route_info(line, start, end, timestamps) {
    // Helper function which queries the Subway Explorer API route look-up code path.
    return request(
        `http://${SUBWAY_EXPLORER_SERVICE_URI}/poll-travel-times/json?line=${line}&start=${start}&end=${end}&timestamps=${timestamps}`
    ).then(body => JSON.parse(body));
}

function chain_promise(promise, line, start_station, end_station) {
    // Helper function for chaining transit route XHR Promise objects.

    return promise.then(previous_r => {

        let timestamps = previous_r.times[previous_r.times.length - 1].map(response => {
            let station_seq = response.results;
            let next_time = +station_seq[station_seq.length - 1].latest_information_time;
            return moment.unix(next_time).utcOffset(-5).format('YYYY-MM-DDTHH:mm')
        });
        timestamps = timestamps.join("|");

        return _request_route_info(line, start_station.stop_id, end_station.stop_id, timestamps).then(next_r => {

            let next_r_stations = previous_r.stations;
            next_r_stations.push({start: start_station, end: end_station});
            let next_r_times = previous_r.times;
            next_r_times.push(next_r);

            return {
                stations: next_r_stations,
                times: next_r_times
            };
        });
    });
}

function get_transit_explorer_data(route) {
    // Generate the transit option data payload for the given route, with the input route being any one of the options
    // returned by the get_transit_options method.

    // First, find all of the legs in the inputted route which are via mass transit. Look up their corresponding start
    // and end stations and batch the resulting promises.
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

    // Suppose we have a trip containing a single leg. Then we may request API data independently and asynchronously.
    // Suppose we have a trip containing multiple legs. Then the arrival time for each train on each previous leg will
    // inform the arrival time of each train on the leg immediately thereafter. This is a dependency chain.
    xhr = Promise.all(xhr).then(stations => {

        // Create the first request manually.
        const first_transit_leg_idx = transit_segment_leg_idxs[0];
        const leg = route[transit_segment_leg_idxs[0]];
        const start_station = stations[0][0];
        const end_station = stations[0][1];

        const s = {
            start: start_station.stop_id,
            end: end_station.stop_id,
            line: leg.line,
            // TODO: Set actual initial timestamps.
            timestamps: "2018-02-20T06:00|2018-02-20T07:00|2018-02-20T08:00|2018-02-20T09:00|2018-02-20T10:00"
        };
        let chained_promise = _request_route_info(s.line, s.start, s.end, s.timestamps).then(r => {
            return {
                stations: [{start: start_station, end: end_station}],
                times: [r]
            };
        });

        transit_segment_leg_idxs.slice(1).map((leg_idx, station_idx) => {
            // Increment by 1 due to the use of the slice as input.
            const station_slice_idx = station_idx + 1;

            const leg = route[leg_idx];
            const line = leg.line;
            const start_station = stations[station_slice_idx][0];
            const end_station = stations[station_slice_idx][1];

            chained_promise = chain_promise(chained_promise, line, start_station, end_station);
        });

        return chained_promise;
    });

    // TODO: concatenate the station and timing data into one object and return that.
    xhr = xhr.then(payload => {
        let i = null;
        let j = 0;
        let result = [];
        for (i in [...Array(route.length).keys()]) {

            if (transit_segment_leg_idxs.includes(+i)) {

                let start = payload.stations[j].start;
                start = {
                    x: start['stop_lon'], y: start['stop_lat'], stop_name: start['stop_name'], stop_id: start['stop_id']
                };
                let end = payload.stations[j].end;
                end = {
                    x: end['stop_lon'], y: end['stop_lat'], stop_name: end['stop_name'], stop_id: end['stop_id']
                };
                result.push({
                    travel_mode: "TRANSIT",
                    travel_status: payload.times[j].status,
                    travel_segments: payload.times[j].results,
                    start: start,
                    end: end
                });
                j += 1;
            } else {
                result.push({
                    travel_mode: "WALKING",
                    travel_status: "OK",
                    start: {x: route[i].start_location.lng, y: route[i].start_location.lat},
                    end: {x: route[i].end_location.lng, y: route[i].end_location.lat},
                })
            }
        }


        // Flatten the separate station and times data into one struct.
        return result;
    });

    return xhr;
}

module.exports = {
    get_transit_options: get_transit_options,
    get_transit_explorer_data: get_transit_explorer_data
};