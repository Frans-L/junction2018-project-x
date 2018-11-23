import React, { Component } from 'react';
import styled from 'styled-components';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Text>
            Edit <code>src/App.js</code> and save to reload.
          </Text>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

const Text = styled.p`
  font-size: 27px;
`;

export default App;
