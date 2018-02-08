const modify_pins = (previousState, action) => {
    if (typeof previousState === 'undefined') {
        return {starting_pin: {x: null, y:null}};
    }

    else if (action.type === 'SET_START_PIN') {
        return {starting_pin: {x: action.x, y: action.y}}
    }

    else if (action.type === 'SET_STOP_PIN') {
        return {starting_pin: {x: action.x, y: action.y}}
    }

    else {
        return previousState;
    }

};

export default modify_pins