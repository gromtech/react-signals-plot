import React from 'react';
import PropTypes from 'prop-types';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import * as d3Shape from 'd3-shape';
import _ from 'underscore';
import DataSource from './DataSource';
import TouchablePanel from './TouchablePanel';
import SignalsLegend from './SignalsLegend';
import DefaultZoomer from './zoomers/DefaultZoomer';

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
    this.nonvisibleSignals = {};
    const extent = getExtent(datasources);
    this.state = {
      data: datasources,
      extent: extent,
      defaultExtent: extent,
      labels: props.labels,
      margin: props.margin,
      legend: this.getLegend(datasources),
      zoomByRect: props.zoomByRect
    };
    this.style = Object.assign({ position: 'relative' }, props.style);

    this.onResize = _.debounce(() => {
      if (this.container) {
        this.setState({
          height: this.container.clientHeight,
          width: this.container.clientWidth
        }, () => {
          this.refreshChart();
        });
      }
    }, 200);

    this.zoomer = new DefaultZoomer();
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
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
      const { clientHeight, clientWidth } = this.container || {};
      const extent = getExtent(datasources);
      this.setState({
        data: datasources,
        extent: extent,
        defaultExtent: extent,
        legend: this.getLegend(datasources),
        height: clientHeight,
        width: clientWidth,
        zoomByRect: nextProps.zoomByRect
      }, () => {
        this.refreshChart();
      });
    } else if (this.props.samplesLimit !== nextProps.samplesLimit) {
      this.setState({
        data: this.prepareData(this.props.data, nextProps.samplesLimit),
        zoomByRect: nextProps.zoomByRect
      }, () => this.refreshChart());
    } else {
      this.setState({
        zoomByRect: nextProps.zoomByRect
      });
    }
  }

  getLegend(data) {
    const legend = [];
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        legend.push({
          name: item.id,
          color: schemeCategory10[index % 10],
          visible: !this.nonvisibleSignals[item.id]
        });
      });
    }
    return legend;
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
      .call(axisBottom(scaleLinear).tickSize(-height))
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
      .call(axisLeft(scaleLinear).tickSize(-width))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 5)
      .attr('x', -5)
      .attr('dy', '0.71em')
      .attr('fill', '#000')
      .text(this.state.labels.y);
  }

  refreshChart() {
    if (this.state.height && this.state.width && this.state.extent) {
      this.refreshLineChart();
    }
  }

  refreshLineChart() {
    const node = this.node;
    const svg = select(node);
    const margin = this.state.margin;
    svg.selectAll('*').remove();

    const width = this.getSvgWidth();
    const height = this.getSvgHeight();
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = scaleLinear().range([0, width]);
    const y = scaleLinear().range([height, 0]);
    const z = scaleOrdinal(schemeCategory10);

    const line = d3Shape.line()
      .x(d => x(d.x))
      .y(d => y(d.y));

    const data = this.state.data.map((series) => {
      if (!this.nonvisibleSignals[series.id]) {
        return series;
      }
      return {
        id: series.id,
        ds: {
          getData: () => []
        }
      };
    });

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

  onChartZoom(params) {
    const extent = this.state.extent;
    if (extent && params) {
      let newExtent;
      if (params.reset) {
        newExtent = this.state.defaultExtent;
      } else {
        newExtent = this.zoomer.getExtent(this.state.extent, params);
      }
      this.setState({
        extent: newExtent
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
          zoomByRect={ this.state.zoomByRect }
          style={ style }
          onMove={ shift => this.onChartMove(shift) }
          onZoom={ params => this.onChartZoom(params) }
        />
      );
    }
    return panel;
  }

  onLegendItemClick(item) {
    this.nonvisibleSignals[item.name] = !this.nonvisibleSignals[item.name];
    this.setState({
      legend: this.getLegend(this.state.data)
    }, () => this.refreshChart());
  }

  renderLegend() {
    let legend = null;
    if (this.props.showLegend) {
      legend = (
        <SignalsLegend
          signals={ this.state.legend }
          onItemClick={ item => this.onLegendItemClick(item) }
        />
      );
    }
    return legend;
  }

  render() {
    return (
      <div
        style={ this.style }
        ref={ c => this.setContainer(c) }
      >
        { this.renderSvg() }
        { this.getTouchablePanel() }
        { this.renderLegend() }
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
  interactive: PropTypes.bool,
  showLegend: PropTypes.bool,
  zoomByRect: PropTypes.bool
};

ReactSignalsPlot.defaultProps = {
  data: [],
  samplesLimit: 100,
  style: null,
  labels: {},
  margin: {
    top: 20,
    right: 50,
    bottom: 40,
    left: 50
  },
  interactive: false,
  showLegend: true,
  zoomByRect: false
};

export default ReactSignalsPlot;
