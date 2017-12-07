import * as A from 'antd'
import React from 'react'
import ReactDOM from 'react-dom'
import * as RR from 'react-redux'
import * as Redux from '../../redux'
import { Flex, Box } from 'reflexbox'
import * as d3 from 'd3'
import * as _ from 'lodash'
import ReactJson from 'react-json-view'

let mapStateToProps = (state) => {
  return { store: state }
}

let mapDispatchToProps = (dispatch) => {
  return { dispatch }
}

class TrajectoriesVisRaw extends React.Component {
  componentDidMount() {
    var width = this.divElement.clientWidth
    var height = this.props.store.app.visHeight/2
    var margin = 20

    var svg = d3.select('#trajectory')
      .attr('width', width)
      .attr('height', height)

    var g = svg.append('g').classed('d3-trajectories', true)

    var nodes = this.props.store.view.dataset.trajectories
    var links = this.props.store.view.dataset.traj_similarity || this.props.store.view.dataset.user_similarity

    var link = g.selectAll('.d3-link')
                    .data(links)

    link = link.enter().append('line')
        .classed('d3-link', true)

    link
      .attr('stroke-width', l => 0)


    var point = g.selectAll('.d3-point')
                    .data(nodes)

    point = point.enter().append('circle')
        .classed('d3-point', true)

    point
        .attr('r', (d) => 3*Math.sqrt(d.user_ids.length))
        .attr('opacity', 0.5)
        .attr('stroke-width', 1)
        .attr('stroke', 'black')
        .attr('fill', 'blue')

    var x = (x) => x < 3*margin ? 3*margin : Math.min(width - 3*margin, x)
    var y = (y) => y < 2*margin ? 2*margin : Math.min(height - 2*margin, y)

    var maxSimilarity = _.max(links.map(l => l.similarity))
    var d = d3.scalePow(3).domain([0, maxSimilarity]).range([height/3, 1])

    var simulation = d3.forceSimulation(nodes)
            .force('charge', d3.forceManyBody().strength(-30))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('link',
              d3.forceLink(links).id(l => l.index)
              .distance(l => d(l.similarity))
              .strength(1)
              .iterations(10)
            )
            .force('collide', d3.forceCollide(d => {
              var r = 3*Math.sqrt(d.user_ids.length)
              return (r > 9) ? r : 1
            }).iterations(10))
            .on('tick', () => {
              point
               .attr('cx', d => d.x)
               .attr('cy', d => d.y)
            })

    // point.call(d3.drag()
    //   .on('start', (d) => {
    //     if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    //     d.fx = d3.event.x
    //     d.fy = d3.event.y
    //   })
    //   .on('drag', (d) => {
    //     d.fx = d3.event.x
    //     d.fy = d3.event.y
    //   })
    //   .on('end', (d) => {
    //     if (!d3.event.active) simulation.alphaTarget(0)
    //     d.fx = d3.event.x
    //     d.fy = d3.event.y
    //   })
    // )

    point
      .on('mouseover', (t) => { this._onTrajectorySelection(t, true, false) })
      .on('mouseout', (t) => { this._onTrajectorySelection(t, false, false) })
      .on('click', (t) => { this._onTrajectorySelection(t, true, true) })
      .on('dblclick', (t) => { this._onTrajectorySelection(t, false, true) })

    this.point = point
    this.link = link
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.store.view.updateTime !== nextProps.store.view.updateTime) {
      setTimeout(() => this._redrawHighlights(nextProps), 200)
    }
  }

  _onTrajectorySelection(trajectory, isOn, isClicked) {
    this.props.dispatch({
      type: Redux.SELECT_TRAJECTORY,
      data: { trajectory, isOn, isClicked }
    })
  }

  _redrawHighlights(props) {
    var props = props || this.props

    if (!this.point || !this.link)
      return

    var selection = props.store.view.selection

    this.point
      .transition().duration(1000).ease(d3.easePoly.exponent(2))
      .attr('r', (d) => {
        return _.intersection(d.user_ids.map(id => id + ''), _.keys(selection.users)).length === 0 && selection.nodes.size > 0 ?
          0 :
          3*Math.sqrt(d.user_ids.length)
      })
      .attr('fill', (d) => {
        return (selection.trajectories[d.trajectory] || selection.trajectoriesClicked[d.trajectory]) ? 'yellow' : 'blue'
      })
  }

  render() {
    return (
      <div ref={ (divElement) => this.divElement = divElement}>
        <svg id='trajectory'>
        </svg>
      </div>
    )
  }
}

export var TrajectoriesVis = RR.connect(mapStateToProps, mapDispatchToProps)(TrajectoriesVisRaw)
