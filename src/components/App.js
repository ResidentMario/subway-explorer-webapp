import React from 'react';
import WebmapContainer from "../containers/WebmapContainer";
import SidebarContainer from "../containers/SidebarContainer";

class App extends React.Component {
    render() {
        return ([<WebmapContainer key={0}/>, <SidebarContainer key={1}/>])
    }
}

export default App