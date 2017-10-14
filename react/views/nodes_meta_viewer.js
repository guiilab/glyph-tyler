import * as A from 'antd'
import React from 'react'
import ReactDOM from 'react-dom'
import * as RR from 'react-redux'
import * as Redux from '../../redux'
import { Flex, Box } from 'reflexbox'
import * as _ from 'lodash'
import ReactJson from 'react-json-view'

let mapStateToProps = (state) => {
  return { store: state }
}

let mapDispatchToProps = (dispatch) => {
  return { dispatch }
}

class NodesMetaViewerRaw extends React.Component {
  componentDidMount() {
    document.addEventListener('keydown', (event) => {
      const keyName = event.key

      if (new Set(['ArrowLeft', 'ArrowRight']).has(keyName))
        this.props.dispatch({
          type: Redux.META_VIEWER_KEY_PRESS,
          data: (keyName === 'ArrowLeft') ? -1 : 1
        })
    })
  }

  render() {
    var { metaViewer, selection } = this.props.store.view
    var nodesClicked = [...selection.nodesClicked]

    var focusNode = metaViewer.mouseover || nodesClicked.slice(-1)[0]

    return (
      <div>
        <div>{nodesClicked.map((n, i) => <span>
          {(i ? ' | ' : '')} <span style={{ color: _.get(focusNode, 'id', 'fdsfs') === n.id ? 'red' : 'black' }}>
            {i === metaViewer.currentIndex ? <u>{n.id}</u> : n.id}
          </span>
        </span>)}</div>
        <Flex>
          <Box>{nodesClicked[metaViewer.currentIndex] ?
            <ReactJson src={nodesClicked[metaViewer.currentIndex]} /> :
            null
          }</Box>
          <Box>{focusNode ?
            <ReactJson src={focusNode} theme='monokai'/> :
            null
          }</Box>
        </Flex>

      </div>
    )
  }
}

export var NodesMetaViewer = RR.connect(mapStateToProps, mapDispatchToProps)(NodesMetaViewerRaw)
