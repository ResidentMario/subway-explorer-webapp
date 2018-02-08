import React from 'react';
import Webmap from "./Webmap";
import WebmapContainer from "../containers/webmap-container";
// import Footer from './Footer'
// import AddTodo from '../containers/AddTodo'
// import VisibleTodoList from '../containers/VisibleTodoList'

class App extends React.Component {
    render() {
        return <WebmapContainer />
    }
}

// const App = (onClick) => (
//     <div onClick={onClick}>
//         Hello World!
//     </div>
// );

export default App