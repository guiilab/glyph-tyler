import * as A from 'antd'
import React from 'react'
import ReactDOM from 'react-dom'
import * as RR from 'react-redux'
import * as Redux from '../../redux'
import { Flex, Box } from 'reflexbox'
import * as d3 from 'd3'
import * as _ from 'lodash'

let mapStateToProps = (state) => {
  return { store: state }
}

let mapDispatchToProps = (dispatch) => {
  return { dispatch }
}

class StatesVisRaw extends React.Component {
  componentDidMount() {
    var width = this.divElement.clientWidth
    var height = this.props.store.app.visHeight/2

    var svg = d3.select('svg')
      .attr('width', width)
      .attr('height', height)

    var g = svg.append('g').classed('d3-points', true)

    var nodes = this.props.store.view.dataset.nodes

    console.log(width)

    var scales = {
      x: d3.scaleLinear().domain(d3.extent(nodes.map((d) => d.distance_start))).range([0, width]),
      y: d3.scaleLinear().domain(d3.extent(nodes.map((d) => parseInt(d.id)))).range([0, height]),
      z: d3.scaleLinear().domain(d3.extent(nodes.map((d) => d.user_ids.length))).range([1, 10])
    }

    var point = g.selectAll('.d3-point')
                    .data(nodes, (d) => d.id)

    // ENTER
    var point = point.enter().append('circle', (d) => d.id)
        .classed('d3-point', true)

    // UPDATE
    point.attr('cx', (d) => scales.x(d.distance_start) )
        .attr('cy', (d) => scales.y(parseInt(d.id)) )
        .attr('r', (d) => scales.z(d.user_ids.length) )

    // EXIT
    point.exit()
        .remove()
  }

  render() {
    return (
      <div ref={ (divElement) => this.divElement = divElement}>
        <svg/>
      </div>
    )
  }
}

export var StatesVis = RR.connect(mapStateToProps, mapDispatchToProps)(StatesVisRaw)
