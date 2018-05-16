import React from 'react';
import SelectorWebmapContainer from "../containers/SelectorWebmapContainer";
import SidebarContainer from "../containers/SidebarContainer";
import InfoPaneContainer from "../containers/InfoPaneContainer";

class App extends React.Component {
    render() {
        return ([<SelectorWebmapContainer key={0}/>, <SidebarContainer key={1}/>, <InfoPaneContainer key={2}/>])
    }
}

export default App