import React, { Component } from 'react';
import BarChart from './BarChart.js';
import Sentiment from 'sentiment';
import _ from 'lodash';
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
    fetch("http://localhost:3000/db/getAmandaMessages")
      .then(res => res.json())
      .then((data) => {
        console.log(data);
        let sentiment = new Sentiment();
        let David = { 
          score: 0,
          comparative: 0,
          words: {
            positive: {},
            negative: {}
          }
        }
        let Amanda = {
          score: 0,
          comparative: 0,
          words: {
            positive: {},
            negative: {}
          }
        }
        for(let index in data) {
          const sent = sentiment.analyze(data[index].text);
          console.log(sent);
          if(data[index].is_from_me === 1) {
            for(let bad in sent.negative) {
              const word = sent.negative[bad];
              if(_.has(David.words.negative, word)) {
                David.words.negative[word] += 1
              } else {
                David.words.negative[word] = 1
              }
            }
            for(let bad in sent.positive) {
              const word = sent.positive[bad];
              if(_.has(David.words.positive, word)) {
                David.words.positive[word] += 1
              } else {
                David.words.positive[word] = 1
              }
            }
            David.score += sent.score;
            David.comparative += sent.comparative;
          } else {
            for(let bad in sent.negative) {
              const word = sent.negative[bad];
              if(_.has(Amanda.words.negative, word)) {
                Amanda.words.negative[word] += 1
              } else {
                Amanda.words.negative[word] = 1
              }
            }
            for(let bad in sent.positive) {
              const word = sent.positive[bad];
              if(_.has(Amanda.words.positive, word)) {
                Amanda.words.positive[word] += 1
              } else {
                Amanda.words.positive[word] = 1
              }
            }
            Amanda.score += sent.score;
            Amanda.comparative += sent.comparative
          }
          // fetch("http://localhost:3000/db/postSentimentScore", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ROWID: data[index].ROWID, sentiment: sent.comparative }) })
          //   .then(res => res.json())
          //   .then((result) => {

          //   })
        }
        console.log(David);
        console.log(Amanda);
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
