const webmap = (state, action) => {
    if (typeof state === 'undefined') {
        return {start_pin: undefined, stop_pin: undefined, init: true}
    }

    else if (action.type === 'SET_START_PIN') {
        return {x: state.start_pin.x, y: state.start_pin.y}
        // let nstate = Object.assign(...state, );
        // nstate.start_pin = {x: state.start_pin.x, y: state.start_pin.y};
        // return nstate;
    }

    else if (action.type === 'SET_STOP_PIN') {
        return {x: state.stop_pin.x, y: state.stop_pin.y}
    }

};

export default webmap