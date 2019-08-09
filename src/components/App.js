import React, { Component } from 'react';
import BarChart from './BarChart.js';
import Sentiment from 'sentiment';
import Graph from './Graph.js'
import _ from 'lodash';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dtot: [],
      dpos: [],
      dneg: [],
      atot: [],
      apos: [],
      aneg: [],
      dtoto: [],
      atoto: [],
      dposo: [],
      aposo: [],
      dnego: [],
      anego: [],
      dreact: [],
      areact: [],
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
          },
          reactions: {
            liked: 0,
            loved: 0,
            laughed: 0,
            emphasized: 0,
            questioned: 0,
            disliked: 0
          }
        }
        let Amanda = {
          score: 0,
          comparative: 0,
          words: {
            positive: {},
            negative: {}
          },
          reactions: {
            liked: 0,
            loved: 0,
            laughed: 0,
            emphasized: 0,
            questioned: 0,
            disliked: 0
          }
        }
        for(let index in data) {
          if(data[index].is_from_me === 1) {
            if(data[index].text.startsWith("Liked ")) {
              David.reactions.liked += 1
              continue;
            } else if(data[index].text.startsWith("Laughed at ")) {
              David.reactions.laughed += 1
              continue;
            } else if(data[index].text.startsWith("Disliked ")) {
              David.reactions.disliked += 1
              continue;
            } else if(data[index].text.startsWith("Emphasized ")) {
              David.reactions.emphasized += 1
              continue;
            } else if(data[index].text.startsWith("Questioned ")) {
              David.reactions.questioned += 1
              continue;
            } else if(data[index].text.startsWith("Loved ")) {
              David.reactions.loved += 1
              continue;
            }
            const sent = sentiment.analyze(data[index].text);

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
            if(data[index].text.startsWith("Liked ")) {
              Amanda.reactions.liked += 1
              continue
            } else if(data[index].text.startsWith("Laughed at ")) {
              Amanda.reactions.laughed += 1
              continue
            } else if(data[index].text.startsWith("Disliked ")) {
              Amanda.reactions.disliked += 1
              continue
            } else if(data[index].text.startsWith("Emphasized ")) {
              Amanda.reactions.emphasized += 1
              continue
            } else if(data[index].text.startsWith("Questioned ")) {
              Amanda.reactions.questioned += 1
              continue
            } else if(data[index].text.startsWith("Loved ")) {
              Amanda.reactions.loved += 1
              continue
            }
            const sent = sentiment.analyze(data[index].text);
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
        let dpos = [];
        let dneg = [];
        let apos = [];
        let aneg = [];
        let dtot = [];
        let atot = [];
        let dreact = [];
        let areact = [];
        for(let react in David.reactions) {
          dreact.push({ name: react, val: David.reactions[react]})
        }
        for(let react in Amanda.reactions) {
          areact.push({ name: react, val: Amanda.reactions[react]})
        }
        for(let pos in David.words.positive) {
          dpos.push({ name: pos, val: David.words.positive[pos]})
          dtot.push({ name: pos, val: David.words.positive[pos]})
        }
        for(let neg in David.words.negative) {
          dneg.push({ name: neg, val: David.words.negative[neg]})
          dtot.push({ name: neg, val: David.words.negative[neg]})
        }
        for(let pos in Amanda.words.positive) {
          apos.push({ name: pos, val: Amanda.words.positive[pos]})
          atot.push({ name: pos, val: Amanda.words.positive[pos]})
        }
        for(let neg in Amanda.words.negative) {
          aneg.push({ name: neg, val: Amanda.words.negative[neg]})
          atot.push({ name: neg, val: Amanda.words.negative[neg]})
        }
        dpos.sort(function(a, b) {
          return b.val - a.val;
        });
        dneg.sort(function(a, b) {
          return b.val - a.val;
        });
        apos.sort(function(a, b) {
          return b.val - a.val;
        });
        aneg.sort(function(a, b) {
          return b.val - a.val;
        });
        dtot.sort(function(a, b) {
          return b.val - a.val;
        });
        atot.sort(function(a, b) {
          return b.val - a.val;
        });
        let dnoT = [];
        let removeOverlap = (li1, li2) => {
          let list1 = li1.slice(0);
          let list2 = li2.slice(0);
          let overlap = true;
          let count = 0
          let count2 = 0
          while(overlap) {
            overlap = false
            count = 0
            for(let i = 0; i < 15; i += 1) {
              for(let i2 = 0; i2 < 15; i2 += 1) {
                if(list1[i].name === list2[i2].name) {
                  overlap = true
                  list1.splice(i, 1);
                  list2.splice(i2, 1);
                  i -= 1;
                  break;
                }
              }
            }
          }
          return {
            l1: list1,
            l2: list2
          }
        }
        let toto = removeOverlap(dtot, atot);
        let poso = removeOverlap(dpos, apos);
        let nego = removeOverlap(dneg, aneg);
        console.log(David);
        console.log(Amanda);
        this.setState({
          dtot: dtot.splice(0, 15),
          dpos: dpos.splice(0, 15),
          dneg: dneg.splice(0, 15),
          atot: atot.splice(0, 15),
          apos: apos.splice(0, 15),
          aneg: aneg.splice(0, 15),
          dtoto: toto.l1.splice(0, 15),
          atoto: toto.l2.splice(0, 15),
          dposo: poso.l1.splice(0, 15),
          aposo: poso.l1.splice(0, 15),
          dnego: nego.l1.splice(0, 15),
          anego: nego.l1.splice(0, 15),
          areact: areact,
          dreact: dreact
        })
        // console.log(dpos);
        // console.log(dneg);
        // console.log(atot);
        // console.log(apos);
        // console.log(aneg);
        // console.log(David);
        // console.log(Amanda);
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Graph bucketSize={100} data={this.state.dreact} size={[500,500]} xlabel={'David reactions'} />
          <Graph bucketSize={100} data={this.state.areact} size={[500,500]} xlabel={'Amanda reactions'} />
          <Graph bucketSize={100} data={this.state.dtot} size={[500,500]} xlabel={'David all pos/neg words'} />
          <Graph bucketSize={100} data={this.state.atot} size={[500,500]} xlabel={'Amanda all pos/neg words'} />
          <Graph bucketSize={100} data={this.state.atoto} size={[500,500]} xlabel={'Amanda all pos/neg words (Top 15 no overlap)'} />
          <Graph bucketSize={100} data={this.state.dtoto} size={[500,500]} xlabel={'David all pos/neg words (Top 15 no overlap)'} />
          <Graph bucketSize={100} data={this.state.dpos} size={[500,500]} xlabel={'David positive words'} />
          <Graph bucketSize={100} data={this.state.apos} size={[500,500]} xlabel={'Amanda positive words'} />
          <Graph bucketSize={100} data={this.state.dposo} size={[500,500]} xlabel={'David positive words (Top 15 no overlap)'} />
          <Graph bucketSize={100} data={this.state.aposo} size={[500,500]} xlabel={'Amanda positive words (Top 15 no overlap)'} />
          <Graph bucketSize={100} data={this.state.dneg} size={[500,500]} xlabel={'David negative words'} />
          <Graph bucketSize={100} data={this.state.aneg} size={[500,500]} xlabel={'Amanda negative words'} />
          <Graph bucketSize={100} data={this.state.dnego} size={[500,500]} xlabel={'David negative words (Top 15 no overlap)'} />
          <Graph bucketSize={100} data={this.state.anego} size={[500,500]} xlabel={'Amanda negative words (Top 15 no overlap'} />
        </header>
      </div>
    );
  }
}

export default App;
