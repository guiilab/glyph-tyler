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
        .attr('r', (d) => 1 + d.user_ids.length)
        .attr('opacity', 0.25)
        .attr('fill', 'black')

    var x = (x) => x < 3*margin ? 3*margin : Math.min(width - 3*margin, x)
    var y = (y) => y < 2*margin ? 2*margin : Math.min(height - 2*margin, y)

    var maxSimilarity = _.max(links.map(l => l.similarity))
    var d = d3.scaleLinear().domain([0, maxSimilarity]).range([height/3, 1])

    var simulation = d3.forceSimulation(nodes)
            .force('charge', d3.forceManyBody())
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('link',
              d3.forceLink(links).id(l => l.index)
              .distance(l => d(l.similarity))
              .strength(1)
            )
            .force('collide', d3.forceCollide(d => 1 + d.user_ids.length).iterations(2))
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
      .on('mouseover', (node) => { })
      .on('mouseout', (node) => { })
      .on('click', (node) => { })
      .on('dblclick', (node) => { })

    link
      .on('mouseover', (l) => { })
      .on('mouseout', (l) => { })
      .on('click', (l) => { })
      .on('dblclick', (l) => { })

    this.point = point
    this.link = link
  }

  _onNodesSelection(nodes, isOn, isClicked) {
    this.props.dispatch({
      type: Redux.SELECT_NODES,
      data: { nodes, isOn, isClicked }
    })

    setTimeout(this._redrawHighlights.bind(this), 200)
  }

  _redrawHighlights() {
    var selection = this.props.store.view.selection

    this.point
      .attr('r', (d) => {
        if (selection.nodes.size === 0) return 1 + Math.sqrt(d.visits)

        return selection.pathNodes.has(d.id) ? 1 + Math.sqrt(d.visits) : 0
      })
      .attr('stroke-width', (d) => {
        return (selection.nodes.has(d.id) || selection.pathNodes.has(d.id)) ? 2 : 0
      })
      .attr('stroke', (d) => {
        return selection.nodes.has(d.id) ? 'yellow' : (
          selection.pathNodes.has(d.id) ? 'purple' : 'black'
        )
      })
      .attr('opacity', (d) => {
        if (selection.nodes.size === 0) return 0.25

        return (selection.pathNodes.has(d.id))
          ? 1 : 0.025
      })

    this.link
      .attr('opacity', (l) => {
        if (selection.nodes.size === 0) return 0.1

        return (selection.pathNodes.has(l.source.id) && selection.pathNodes.has(l.target.id))
          ? 0.5 : 0.025
      })
      .attr('stroke-width', (l) => {
        if (
          selection.users.length > 0 && _.chain(selection.users).intersection(l.target.user_ids).intersection(l.source.user_ids).uniq().value().length === 0
        ) return 0

        if (selection.nodes.size === 0) return 3 + Math.sqrt(l.weight)

        return (selection.pathNodes.has(l.source.id) && selection.pathNodes.has(l.target.id))
          ? 3 + Math.sqrt(l.weight) : 0
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
