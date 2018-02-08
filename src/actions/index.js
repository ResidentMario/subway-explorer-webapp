let beginning = {};
let end = {};

export const setStartPin = (x, y) => {
    return {
        type: 'SET_START_PIN',
        x: x,
        y: y
    }
};

export const setEndPin = (x, y) => {
    return {
        type: 'SET_END_PIN',
        x: x,
        y: y
    }
};