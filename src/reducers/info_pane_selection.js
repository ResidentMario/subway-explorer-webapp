const info_pane_selection = (previousState, action) => {

    if (typeof previousState === 'undefined') { return { screen: null }; }
    else if (action.type === "SET_INFO_PANE") { return Object.assign({}, previousState, {screen: action.screen}); }
    else { return previousState; }

};

export default info_pane_selection