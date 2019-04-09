import React, { Component } from 'react';
import Search from './components/search/search'
import './App.sass';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Search/>
      </div>
    );
  }
}

export default App;
