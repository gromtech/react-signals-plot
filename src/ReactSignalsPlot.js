import React from 'react';
import dimensions from 'react-dimensions';
import * as d3 from 'd3';

import './ReactSignalsPlot.scss';

class ReactSignalsPlot extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: props.data,
      labels: props.labels || {},
      margin: props.margin || {
        top: 20,
        right: 50,
        bottom: 30,
        left: 50
      }
    };
  }

  componentDidMount() {
    if (this.container) {
      const { clientHeight, clientWidth } = this.container;
      this.setState({
        height: clientHeight,
        width: clientWidth
      }, () => {
        this.refreshChart();
      });
    }
    this.refreshChart();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      height: nextProps.containerHeight,
      width: nextProps.containerWidth,
      data: nextProps.data
    }, () => {
      this.refreshChart();
    });
  }

  getSvgHeight() {
    const { height, margin } = this.state;
    return height - margin.top - margin.bottom;
  }

  getSvgWidth() {
    const { width, margin } = this.state;
    return width - margin.left - margin.right;
  }

  getExtent(data, field) {
    let min = null;
    let max = null;
    data.forEach((line) => {
      line.values.forEach((value) => {
        const fieldValue = value[field];
        if ((min === null) || (fieldValue < min)) {
          min = fieldValue;
        }
        if ((max === null) || (fieldValue > max)) {
          max = fieldValue;
        }
      });
    });
    return [min, max];
  }

  createAxisBottom(g, scaleLinear) {
    const width = this.getSvgWidth();
    const height = this.getSvgHeight();

    g.append("g")
      .attr("class", "axis axis--x grid")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(scaleLinear).tickSize(-height))
      .append("text")
      .style("text-anchor","end")
      .attr("x", width - 5)
      .attr("dy", "-0.5em")
      .attr("fill", "#000")
      .text(this.state.labels.x);
  }

  createAxisLeft(g, scaleLinear) {
    const width = this.getSvgWidth();
    g.append("g")
      .attr("class", "axis axis--y grid")
      .call(d3.axisLeft(scaleLinear).tickSize(-width))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("x", - 5)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text(this.state.labels.y);
  }

  refreshChart() {
    if (this.state.height && this.state.width) {
      this.refreshLineChart();
    }
  }

  refreshLineChart() {
    const node = this.node;
    const svg = d3.select(node);
    const margin = this.state.margin;
    svg.selectAll("*").remove();

    const width = this.getSvgWidth();
    const height = this.getSvgHeight();
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    const z = d3.scaleOrdinal(d3.schemeCategory10);

    const line = d3.line()
      .x(d => x(d.x))
      .y(d => y(d.y));

    const data = this.props.data;

    x.domain(this.getExtent(data, 'x'));
    y.domain(this.getExtent(data, 'y'));
    z.domain(data.map(series => series.id ));

    this.createAxisBottom(g, x);
    this.createAxisLeft(g, y);

    const series = g.selectAll(".series")
      .data(data)
      .enter().append("g")
      .attr("class", "series");

    series.append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr('stroke-width', '0.1em')
      .attr("d", d => line(d.values))
      .style("stroke", d => z(d.id));
  }

  renderSvg() {
    let svg = null;
    const { width, height } = this.state;
    if ((width > 0) && (height > 0)) {
      svg = (
        <svg
          ref={ node => this.node = node }
          width={ this.state.width }
          height={ this.state.height }
        >
        </svg>
      );
    }
    return svg;
  }

  render() {
    return (
      <div
        style={ this.props.style }
        ref={ c => this.container = c }
      >
        { this.renderSvg() }
      </div>
    );
  }
}

export default dimensions()(ReactSignalsPlot);
