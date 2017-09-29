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
    var margin = 20

    var svg = d3.select('svg')
      .attr('width', width)
      .attr('height', height)

    var g = svg.append('g').classed('d3-points', true)

    var nodes = this.props.store.view.dataset.nodes
    var links = this.props.store.view.dataset.links

    var incomingMap = {}

    links.forEach((l) => {
      l.target = l.target_id
      l.source = l.source_id

      if (!incomingMap[l.target]) incomingMap[l.target] = []

      incomingMap[l.target].push(l.source)
    })

    console.log(incomingMap)

    links = links.filter((l) => {
      var source = l.source

      while (true) {
        if (incomingMap[source].length > 1)
          break

        source = incomingMap[source][0]
      }

      l.source = source

      if (incomingMap[l.target].length === 1)
        return false

      return true
    })

    var scales = {
      x: d3.scaleLinear().domain(d3.extent(nodes.map((d) => d.distance_start))).range([margin, width - margin]),
      y: d3.scaleLinear().domain(d3.extent(nodes.map((d) => parseInt(d.id)))).range([margin, height - margin]),
      z: d3.scaleLinear().domain(d3.extent(nodes.map((d) => d.user_ids.length))).range([3, 20])
    }

    var link = g.selectAll('.d3-link')
                    .data(links)

    link = link.enter().append('line')
        .classed('d3-link', true)

    link
      .attr('stroke-width', l => Math.sqrt(l.weight))
      .attr('stroke', 'black')
      .attr('opacity', 0.1)


    var point = g.selectAll('.d3-point')
                    .data(nodes)

    point = point.enter().append('circle')
        .classed('d3-point', true)

    point
        // .attr('cx', (d) => scales.x(d.distance_start) )
        // .attr('cy', (d) => scales.y(parseInt(d.id)) )
        .attr('r', (d) => Math.sqrt(d.visits))
        .attr('opacity', 0.25)
        .attr('fill', (d) => {
          return ({
            start: 'red',
            mid: 'blue',
            end: 'green'
          })[d.state_type] || 'black'
        })

    var x = (x) => x < margin ? margin : Math.min(width - 4*margin, x)
    var y = (y) => y < margin ? margin : Math.min(height - margin, y)

    var simulation = d3.forceSimulation(nodes)
            .force('charge', d3.forceManyBody())
            .force('link', d3.forceLink(links).id((d) => d.id).distance(Math.min(width, height)/10).strength(1))
            .force('collision', d3.forceCollide().radius((d) => {
              return (['start', 'end'].indexOf(d.state_type) > -1) ? Math.min(width, height)/4 : 5
            }).strength(1))
            .on('tick', () => {
              point
                .each((d) => {
                    if (d.state_type === 'start') {
                      d.fx = margin
                      d.fy = (height - margin) / 2
                    } else {
                      if (d.state_type === 'end') {
                        d.fx = width - margin
                      } else {
                        d.x = x(d.x)
                      }

                      d.y = y(d.y)
                    }
                  })

              link.each(l => {
                var scale = 100.0/Math.sqrt(Math.pow(l.source.x - l.target.x, 2) + Math.pow(l.source.y - l.target.y, 2) + 1)

                // if (l.source.x && l.source.y && l.target.x && l.target.y && !scale)
                //   console.log(l.source.x, l.source.y, l.target.x, l.target.y, scale)

                if (l.source.label) {
                  l.target.x = l.source.x + scale*(l.target.x - l.source.x)
                  l.target.y = l.source.y + scale*(l.target.y - l.source.y)
                }

                if(l.target.label) {
                  l.source.x = l.target.x + scale*(l.source.x - l.target.x)
                  l.source.y = l.target.y + scale*(l.source.y - l.target.y)
                }

                // console.log(l)
              })

              link.attr('x1', (d) => d.source.x )
                  .attr('x2', (d) => d.target.x )
                  .attr('y1', (d) => d.source.y )
                  .attr('y2', (d) => d.target.y )

              point
                .attr('cx', (d) => d.x)
                .attr('cy', (d) => d.y)
            })

    point.call(d3.drag()
      .on('start', (d) => {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d3.event.x
        d.fy = d3.event.y
      })
      .on('drag', (d) => {
        d.fx = d3.event.x
        d.fy = d3.event.y
      })
      .on('end', (d) => {
        if (!d3.event.active) simulation.alphaTarget(0)
        d.fx = d3.event.x
        d.fy = d3.event.y
      })
    )
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
