import React, { Component } from 'react';
import BarChart from './BarChart.js'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      bucketSize: 100
    };
  }

  componentDidMount() {
    fetch("http://localhost:3000/db/getAmandaMessages", { method: 'POST' })
      .then(res => res.json())
      .then((data) => {
        console.log(data);
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <BarChart bucketSize={100} data={[5,10,1,3]} size={[500,500]} />
        </header>
      </div>
    );
  }
}

export default App;
