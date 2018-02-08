import React from 'react';
import Webmap from "./Webmap";
// import Footer from './Footer'
// import AddTodo from '../containers/AddTodo'
// import VisibleTodoList from '../containers/VisibleTodoList'

class App extends React.Component {
    render() {
        return <Webmap center={[0, 0]} zoom={5} onClick={() => console.log('click')}/>
    }
}

// const App = (onClick) => (
//     <div onClick={onClick}>
//         Hello World!
//     </div>
// );

export default App