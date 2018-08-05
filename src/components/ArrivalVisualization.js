// TODO: this code needs a heavy refactor for readability!

import React from "react";
const d3 = require('d3');
require('d3-scale');

class ArrivalVisualization extends React.Component {

    build_vizdata(data) {

        // Stop sequence time offsets.
        function time_offsets(leg) {
            return leg.travel_segments.map(segment => {
                if (segment.length > 0) {
                    let first = segment[0];
                    let start_time = first['minimum_time'] ?
                        first['minimum_time'] + 60 : first['latest_information_time'];
                    return segment.map(stop => {
                        let time = stop['minimum_time'] ?
                            stop['minimum_time'] + 60 : stop['latest_information_time'];
                        return time - start_time;
                    });
                } else {
                    return [];
                }
            });
        }

        // Get the majority-vote station sort order (excludes tweener stations).
        function station_sort_order(leg) {
            // Build transition counts.
            let trans = new Map();
            leg.travel_segments.forEach(segment => {
                if (segment.length > 0) {
                    segment.slice(0, segment.length - 1).forEach((station, idx) => {
                        let [stop_id, next_stop_id] = [station.stop_id, segment[idx + 1].stop_id];
                        if (!trans.has(stop_id)) {
                            let counts = new Map(); counts.set(next_stop_id, 1);
                            trans.set(stop_id, counts);
                        } else {
                            let counts = trans.get(stop_id);

                            if (counts.has(next_stop_id)) {
                                counts.set(next_stop_id, counts.get(next_stop_id) + 1);
                            } else {
                                counts.set(next_stop_id, 1);
                            }
                        }
                    })
                }
            });

            // Collapse to the majority votes.
            let next_station_highest_proba = new Map();
            for (let [stop_id, count] of trans.entries()) {
                let [stop_id_max_proba, n_max_proba] = [null, 0];
                for (let [stop_id, n] of count.entries()) {
                    if (n > n_max_proba) { stop_id_max_proba = stop_id; n_max_proba = n; }
                }
                next_station_highest_proba.set(stop_id, stop_id_max_proba);
            }

            // Find the first non-empty station list, and get the first station.
            let n = 0;
            while (leg.travel_segments[n].length === 0) { n += 1 }
            let first_stop_id = leg.travel_segments[n][0].stop_id;

            // Chain from the first station.
            let stop_id_chain = [first_stop_id];
            let latest_stop_id = first_stop_id;

            while (next_station_highest_proba.has(latest_stop_id)) {
                latest_stop_id = next_station_highest_proba.get(latest_stop_id);
                stop_id_chain.push(latest_stop_id);
            }

            return stop_id_chain;
        }

        function transform_leg(leg) {

            // Filter out stops not included in the final sequence.
            let relevant_stops = [];
            let relevant_time_offsets = [];
            let sorted_stations = station_sort_order(leg);
            let offsets = time_offsets(leg);

            leg.travel_segments.forEach((stop_sequence, sequence_idx) => {
                let is_included = stop_sequence.map(stop => sorted_stations.includes(stop.stop_id));
                relevant_stops.push(
                    stop_sequence
                        .map((stop, idx) => Object.assign(stop, { offset_seconds: offsets[sequence_idx][idx] }))
                        .filter((_, idx) => is_included[idx])
                );
            });

            return Object.assign(leg, {travel_segments: relevant_stops, stop_order: sorted_stations});

        }

        function transform(data) {
            // Apply legwise transformations.
            data = data.map(leg => {
                if (leg.travel_mode === "WALKING") { return leg; } else { return transform_leg(leg); }
            });

            // Apply tripwise transformations.
            let running_offsets = Array(data[0].travel_segment_user_arrival_times.length).fill(0);
            data.forEach(leg => {
                if (leg.travel_mode === "WALKING") {
                    leg.offset_seconds = running_offsets;
                    running_offsets = running_offsets.map(v => v + +leg.duration.value);
                } else {
                    leg.travel_segments = leg.travel_segments.map((segment, i) => {
                        let ret = segment.map(stop => Object.assign(stop, {offset_seconds: stop.offset_seconds + running_offsets[i]}));
                        running_offsets[i] = segment[segment.length - 1].offset_seconds;
                        return ret;
                    });
                }
            });

            return data;
        }

        return transform(data);

    };

    buidViz(vizdata) {
        ////////////
        // LAYOUT //
        ////////////
        // Constants and functions that used to lay out the plot boundaries.

        function get_y_edges(data, y_min, y_max) {
            // Given the data and the overall plot extent, calculates a list of y-boundaries for each leg
            // in the journey represented by the dataset.
            let n_legs = data.length;
            let ret = [];

            let lens = data.map(segment => ((segment.travel_mode === "WALKING") ? 1 : segment.stop_order.length));
            let tot = lens.reduce((a, b) => a + b);
            let sizes = lens.map(len => len / tot * (y_max - y_min));
            sizes.reduce((a, b, i) => ret[i] = a + b, 0);
            ret = ret.map((v, i) => {
                if (i === 0) { return [y_min, y_min + v]; }
                else { return [y_min + ret[i - 1], y_min + v]; }
            });
            return ret;
        }

        function get_x_max(data) {
            // Given the data, calculates the maximum time offset (distance from 0 in seconds) reached by the
            // represented journeys. This corresponds with the right edge of the time scale of the graph.
            let last_mile = data[data.length - 1];
            if (last_mile.travel_mode === "WALKING") {
                return Math.max(...last_mile.offset_seconds) + +last_mile.duration.value;
            } else {
                return Math.max(...last_mile.travel_segments.map(segments => segments[segments.length - 1].offset_seconds));
            }
        }

        let [viz_pad_x, viz_pad_y] = [40, 40];
        let label_text_length_padding = 60;
        let station_label_font_size = 8;
        let x_max = get_x_max(vizdata);
        let tick_spacer_left = 8;
        let tick_spacer_right = 8;
        let time_scale = d3.scaleLinear()
            .domain([0, x_max])
            .range([viz_pad_x + label_text_length_padding + tick_spacer_left + 5 + tick_spacer_right, 600 - viz_pad_x]);

        //////////////
        // PAINTERS //
        //////////////
        // These functions paint individual elements on the visualization.

        function paint_transit_leg(leg, y_start, y_end) {
            // Paints a transit leg. Some of this code is duplicated by `paint_walking_leg`.
            // TODO: refactor to reduce code duplication.

            let n_stops = leg.stop_order.length;

            let station_position_scale = d3.scaleLinear()
                .domain([0, n_stops - 1])
                .range([y_start, y_end]);

            d3.select(".svg-content-responsive")
                .append("g")
                .classed("stop-label-container", true)
                .selectAll("text")
                .data(leg.stop_order)
                .enter()
                .append("text")
                .attr("x", viz_pad_x + label_text_length_padding)
                .attr("y", function(_, i) {
                    return station_position_scale(i)
                })
                .attr("class", (d, i) => ((i === 0) || (i === n_stops - 1)) ? "endpoint-text" : "midpoint-text")
                .classed("stop-label", true)
                .text((d, i) => {
                    if (i === 0) {
                        return leg.start.stop_name
                    } else if (i === (n_stops - 1)) {
                        return leg.end.stop_name
                    } else {
                        return d
                    }
                })
                .attr("font-size", Math.max(Math.round(d3.select(".svg-content-responsive").node().getBoundingClientRect().width * 0.006), 6))
                .attr("text-anchor", "end");

            d3.select(".svg-content-responsive")
                .append("g")
                .classed("stop-label-tick-container", true)
                .selectAll("text")
                .data(leg.stop_order)
                .enter()
                .append("text")
                .classed("stop-label-tick", true)
                .attr("x", viz_pad_x + label_text_length_padding + tick_spacer_left)
                // y copied from text label positioning code.
                .attr("y", function(_, i) { return station_position_scale(i) })
                .text("—");

            let interstation_distance = station_position_scale(1) - station_position_scale(0);

            // Create the vertical tripline segments.
            leg.travel_segments.forEach(segments => {
                d3.select(".svg-content-responsive")
                    .append("g")
                    .classed("tripline-container", true)
                    .selectAll("line")
                    .data(segments.slice(0, segments.length - 1))
                    .enter()
                    .append("line")
                    .attr("x1", (current_stop, i) => time_scale(segments[i + 1].offset_seconds))
                    .attr("y1", d => station_position_scale(leg.stop_order.indexOf(d.stop_id)) - station_label_font_size / 2)
                    .attr("x2", (current_stop, i) => time_scale(segments[i + 1].offset_seconds))
                    .attr("y2", d => station_position_scale(leg.stop_order.indexOf(d.stop_id)) - station_label_font_size / 2 + interstation_distance)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                    .attr("vector-effect", "non-scaling-stroke");
            });

            // Create the horizontal tripline segments.
            leg.travel_segments.forEach(segments => {
                d3.select(".svg-content-responsive")
                    .append("g")
                    .classed("tripline-container", true)
                    .selectAll("line")
                    .data(segments.slice(0, segments.length - 1))
                    .enter()
                    .append("line")
                    .attr("x1", (current_stop, i) => time_scale(segments[i].offset_seconds))
                    .attr("y1", d => station_position_scale(leg.stop_order.indexOf(d.stop_id)) - station_label_font_size / 2)
                    .attr("x2", (current_stop, i) => time_scale(segments[i + 1].offset_seconds))
                    .attr("y2", d => station_position_scale(leg.stop_order.indexOf(d.stop_id)) - station_label_font_size / 2)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                    .attr("vector-effect", "non-scaling-stroke");
            });

        }

        function paint_walking_leg(leg, y_start, y_end, origin=false, destination=false) {
            // Paints a walking leg. Some of this code is duplicated by `paint_transit_leg`.
            // TODO: refactor to reduce code duplication.

            if (origin || destination) {
                d3.select(".svg-content-responsive")
                    .append("g")
                    .classed("endpoint-text", true)
                    .classed("stop-label", true)
                    .append("text")
                    .attr("x", viz_pad_x + label_text_length_padding)
                    // y copied from text label positioning code.
                    .attr("y", _ => origin? y_start : y_end)
                    .attr("text-anchor", "end")
                    .attr("font-size", Math.max(Math.round(d3.select(".svg-content-responsive").node().getBoundingClientRect().width * 0.006), 6))
                    .text(_ => origin ? "Origin" : "Destination");

                d3.select(".svg-content-responsive")
                    .append("g")
                    .classed("stop-label-tick-container", true)
                    .append("text")
                    .classed("stop-label-tick", true)
                    .attr("x", viz_pad_x + label_text_length_padding + tick_spacer_left)
                    // y copied from text label positioning code.
                    .attr("y", _ => origin? y_start : y_end)
                    .text("—")
            }

            leg.offset_seconds.forEach(offset => {
                let width = time_scale(offset + +leg.duration.value) - time_scale(offset);
                let height = y_end - y_start;

                // Paint the vertical segment.
                d3.select(".svg-content-responsive")
                    .append("g")
                    .classed("tripline-container", true)
                    .append("line")
                    .attr("x1", time_scale(offset))
                    .attr("x2", time_scale(offset) + Math.max(width, 1))
                    .attr("y1", y_start - station_label_font_size / 2)
                    .attr("y2", y_start - station_label_font_size / 2)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                    .attr("vector-effect", "non-scaling-stroke");

                // Paint the horizontal segment.
                d3.select(".svg-content-responsive")
                    .append("g")
                    .classed("tripline-container", true)
                    .append("line")
                    .attr("x1", time_scale(offset) + Math.max(width, 1))
                    .attr("x2", time_scale(offset) + Math.max(width, 1))
                    .attr("y1", y_start - station_label_font_size / 2)
                    .attr("y2", y_start - station_label_font_size / 2 + height)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                    .attr("vector-effect", "non-scaling-stroke");
                
            });
        }

        function paint_time_axis(data) {
            let time_tick_range = [...Array(Math.round(x_max / (60 * 5))).keys()].map(v => v * 60 * 5);

            d3.select(".svg-content-responsive")
                .append("g")
                .classed("time-label-container", true)
                .selectAll("text")
                .data(time_tick_range)
                .enter()
                .append("text")
                .attr("y", 400 - viz_pad_y + station_label_font_size / 2)
                .attr("x", range_point => time_scale(range_point))
                .text(d => d / 60)
                .classed("time-tick-label", true)
                .attr("font-size", Math.max(Math.round(d3.select(".svg-content-responsive").node().getBoundingClientRect().width * 0.005), 6))
        }

        function paint_needles(data) {
            let last_mile = data[data.length - 1];
            let d = null;
            if (last_mile.travel_mode === "WALKING") {
                d = last_mile.offset_seconds.map(v => v + +last_mile.duration.value);
            } else {
                d = last_mile.travel_segments.map(segments => segments[segments.length - 1].offset_seconds);
            }

            // Drop needles.
            d3.select(".svg-content-responsive")
                .append("g")
                .classed("needle-container", true)
                .selectAll("line")
                .data(d)
                .enter()
                .append("line")
                .attr("x1", offset => time_scale(offset))
                .attr("x2", offset => time_scale(offset))
                .attr("y1", viz_pad_y - station_label_font_size / 2 + 400 - 2 * viz_pad_y - 20)
                .attr("y2", viz_pad_y - station_label_font_size / 2 + 400 - 2 * viz_pad_y)
                .classed("needle", true)
                .attr("stroke", "steelblue")
                .attr("stroke-width", 3)
                .attr("vector-effect", "non-scaling-stroke");
        }

        /////////////
        // RUNTIME //
        /////////////
        // This loop actually paints the scene.

        let subplot_y_edges = get_y_edges(vizdata, viz_pad_y, 400 - viz_pad_y);

        paint_time_axis(vizdata);

        vizdata.forEach((leg, leg_idx) => {
            let [y_start, y_end] = subplot_y_edges[leg_idx];
            let [first, last] = [(leg_idx === 0), (leg_idx === vizdata.length - 1)];
            (leg.travel_mode === "WALKING") ?
                paint_walking_leg(leg, y_start, y_end, (leg_idx === 0), (leg_idx === vizdata.length - 1)) :
                paint_transit_leg(leg, y_start, y_end);
        });

        paint_needles(vizdata);

    }

    componentDidMount() {
        const vizdata = this.build_vizdata(this.props.transit_explorer_response);
        this.buidViz(vizdata);
    }

    render() {

        return <div id='viz-frame'>
            <div id='viz'>
                <svg preserveAspectRatio="xMinYMin meet" viewBox="0 0 600 400" className="svg-content-responsive"
                     ref={node => this.node = node}/>
           </div>
        </div>

    }
}

export default ArrivalVisualization