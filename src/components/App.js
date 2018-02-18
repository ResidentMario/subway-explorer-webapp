import React from 'react';
import WebmapContainer from "../containers/WebmapContainer";
import SidebarContainer from "../containers/SidebarContainer";
import InfoPaneContainer from "../containers/InfoPaneContainer";

class App extends React.Component {
    render() {
        return ([<WebmapContainer key={0}/>, <SidebarContainer key={1}/>, <InfoPaneContainer key={2}/>])
    }
}

export default App