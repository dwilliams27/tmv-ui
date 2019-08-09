import React, { Component } from 'react';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { select } from 'd3-selection';

class BarChart extends Component {
  constructor(props) {
    super(props);
  }

  createBarChart = () => {
    console.log("run")
    let pdata = this.props.data;
    const node = this.node
    let dataMax = 0
    for(let i in pdata) {
      if(pdata[i].value > dataMax) {
        dataMax = pdata[i].val;
      }
    }
    const yScale = scaleLinear()
        .domain([0, dataMax])
        .range([0, this.props.size[1]])
    select(node)
        .selectAll('rect')
        .data(this.props.data)
        .enter()
        .append('rect')
    
    select(node)
        .selectAll('rect')
        .data(this.props.data)
        .exit()
        .remove()
    
    select(node)
        .selectAll('rect')
        .data(this.props.data)
        .style('fill', '#fe9922')
        .attr('x', (d,i) => i*5)
        .attr('y', d => {
          return this.props.size[1] - yScale(d.val)
        })
        .attr('height', d => yScale(d.val))
        .attr('width', 5)
  }

  componentDidMount() {
    this.createBarChart();
  }

  componentDidUpdate() {
    this.createBarChart();
  }

  render() {
    return <svg ref={node => this.node = node}
      width={500} height={500}>
    </svg>
  }
}

export default BarChart;