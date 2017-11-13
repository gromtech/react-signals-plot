import React from 'react';
import PropTypes from 'prop-types';
import dimensions from 'react-dimensions';
import * as d3 from 'd3';
import DataSource from './DataSource';
import TouchablePanel from './TouchablePanel';

import './ReactSignalsPlot.scss';

function getExtent(datasources) {
  let extent = null;
  if (Array.isArray(datasources)) {
    datasources.forEach((line) => {
      const lineExtent = line.ds.getExtent();
      if (!extent) {
        extent = lineExtent;
      } else {
        if (lineExtent.x[0] < extent.x[0]) {
          extent.x[0] = lineExtent.x[0];
        }
        if (lineExtent.x[1] > extent.x[1]) {
          extent.x[1] = lineExtent.x[1];
        }
        if (lineExtent.y[0] < extent.y[0]) {
          extent.y[0] = lineExtent.y[0];
        }
        if (lineExtent.y[1] > extent.y[1]) {
          extent.y[1] = lineExtent.y[1];
        }
      }
    });
  }
  return extent;
}

class ReactSignalsPlot extends React.Component {
  constructor(props) {
    super(props);
    const datasources = this.prepareData(props.data);
    this.state = {
      data: datasources,
      extent: getExtent(datasources),
      labels: props.labels,
      margin: props.margin,
      height: props.containerHeight,
      width: props.containerWidth,
    };
    this.style = Object.assign({ position: 'relative' }, props.style);
  }

  prepareData(data, samplesLimit) {
    let prepared = [];
    if (Array.isArray(data)) {
      prepared = data.map((item) => {
        const datasource = new DataSource(item.values, samplesLimit || this.props.samplesLimit);
        return {
          id: item.id,
          ds: datasource
        };
      });
    }
    return prepared;
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.data !== nextProps.data)) {
      const datasources = this.prepareData(nextProps.data, this.props.samplesLimit);
      this.setState({
        data: datasources,
        extent: getExtent(datasources)
      }, () => {
        this.refreshChart();
      });
    } else {
      this.setState({
        height: nextProps.containerHeight,
        width: nextProps.containerWidth
      }, () => {
        this.refreshChart();
      });
    }
  }

  getSvgHeight() {
    const { height, margin } = this.state;
    return height - margin.top - margin.bottom;
  }

  getSvgWidth() {
    const { width, margin } = this.state;
    return width - margin.left - margin.right;
  }

  createAxisBottom(g, scaleLinear) {
    const width = this.getSvgWidth();
    const height = this.getSvgHeight();

    g.append('g')
      .attr('class', 'axis axis--x grid')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(scaleLinear).tickSize(-height))
      .append('text')
      .style('text-anchor', 'end')
      .attr('x', width - 5)
      .attr('dy', '-0.5em')
      .attr('fill', '#000')
      .text(this.state.labels.x);
  }

  createAxisLeft(g, scaleLinear) {
    const width = this.getSvgWidth();
    g.append('g')
      .attr('class', 'axis axis--y grid')
      .call(d3.axisLeft(scaleLinear).tickSize(-width))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 5)
      .attr('x', -5)
      .attr('dy', '0.71em')
      .attr('fill', '#000')
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
    svg.selectAll('*').remove();

    const width = this.getSvgWidth();
    const height = this.getSvgHeight();
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    const z = d3.scaleOrdinal(d3.schemeCategory10);

    const line = d3.line()
      .x(d => x(d.x))
      .y(d => y(d.y));

    const data = this.state.data;
    const extent = this.state.extent;
    x.domain(extent.x);
    y.domain(extent.y);
    z.domain(data.map(series => series.id));

    this.createAxisBottom(g, x);
    this.createAxisLeft(g, y);

    const series = g.selectAll('.series')
      .data(data)
      .enter().append('g')
      .attr('class', 'series');

    series.append('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke-width', '0.1em')
      .attr('d', d => line(d.ds.getData(extent.x[0], extent.x[1])))
      .style('stroke', d => z(d.id));
  }

  renderSvg() {
    let svg = null;
    const { width, height } = this.state;
    if ((width > 0) && (height > 0)) {
      svg = (
        <svg
          ref={ (node) => { this.node = node; } }
          width={ this.state.width }
          height={ this.state.height }
        />
      );
    }
    return svg;
  }

  setContainer(container) {
    if (!this.container) {
      this.container = container;
      const { clientHeight, clientWidth } = container;
      this.setState({
        height: clientHeight,
        width: clientWidth
      }, () => {
        this.refreshChart();
      });
    }
  }

  onChartMove(shift) {
    const extent = this.state.extent;
    if (extent && shift) {
      const dx = (extent.x[1] - extent.x[0]) * shift.x;
      const dy = (extent.y[1] - extent.y[0]) * shift.y;
      this.setState({
        extent: {
          x: [extent.x[0] - dx, extent.x[1] - dx],
          y: [extent.y[0] - dy, extent.y[1] - dy]
        }
      }, () => this.refreshChart());
    }
  }

  getZoomExtent(zoom) {
    const extent = this.state.extent;
    let xLen = extent.x[1] - extent.x[0];
    let yLen = extent.y[1] - extent.y[0];
    const x0 = (zoom.x * xLen) + extent.x[0];
    const y0 = (zoom.y * yLen) + extent.y[0];
    xLen *= zoom.value;
    yLen *= zoom.value;

    const x1 = x0 - (xLen * zoom.x);
    const x2 = x1 + xLen;
    const y1 = y0 - (yLen * zoom.y);
    const y2 = y1 + yLen;
    return {
      x: [x1, x2],
      y: [y1, y2]
    };
  }

  onChartZoom(zoom) {
    const extent = this.state.extent;
    if (extent && zoom) {
      this.setState({
        extent: this.getZoomExtent(zoom)
      }, () => this.refreshChart());
    }
  }

  getTouchablePanel() {
    let panel = null;
    if (this.props.interactive) {
      const margin = this.state.margin;
      const style = {
        position: 'absolute',
        top: margin.top,
        right: margin.right,
        bottom: margin.bottom,
        left: margin.left
      };
      panel = (
        <TouchablePanel
          style={ style }
          onMove={ shift => this.onChartMove(shift) }
          onZoom={ zoom => this.onChartZoom(zoom) }
        />
      );
    }
    return panel;
  }

  render() {
    return (
      <div
        style={ this.style }
        ref={ c => this.setContainer(c) }
      >
        { this.renderSvg() }
        { this.getTouchablePanel() }
      </div>
    );
  }
}

ReactSignalsPlot.propTypes = {
  data: PropTypes.array,
  samplesLimit: PropTypes.number,
  labels: PropTypes.object,
  margin: PropTypes.object,
  style: PropTypes.object,
  containerHeight: PropTypes.number,
  containerWidth: PropTypes.number,
  interactive: PropTypes.bool
};

ReactSignalsPlot.defaultProps = {
  data: [],
  samplesLimit: 100,
  style: null,
  labels: {},
  margin: {
    top: 20,
    right: 50,
    bottom: 30,
    left: 50
  },
  containerHeight: 0,
  containerWidth: 0,
  interactive: false
};

export default dimensions()(ReactSignalsPlot);
