import * as A from 'antd'
import React from 'react'
import ReactDOM from 'react-dom'
import * as RR from 'react-redux'
import * as Redux from '../../redux'
import { Flex, Box } from 'reflexbox'
import { data } from '../misc'
// import data from '../../data/dota_nov/all_player_proximity_stats.json'
import * as _ from 'lodash'
import { StatesVis, TrajectoriesVis, NodesMetaViewer } from './'
import { ReactHeight } from 'react-height'

let mapStateToProps = (state) => {
  return { store: state }
}

let mapDispatchToProps = (dispatch) => {
  return { dispatch }
}

class AppRaw extends React.Component {
  componentDidMount() {
    this.props.dispatch({
      type: Redux.LOAD_DATA_SET,
      data: data
    })
  }

  render() {
    var store = this.props.store

    return (
      <A.Layout>
        <A.Layout.Header>header</A.Layout.Header>
        <A.Layout>
          <A.Layout.Sider width={500} style={{ backgroundColor: 'white' }}>
            <A.Card style={{ margin: '10px' }}>
              Dataset Info
            </A.Card>
            <A.Card><NodesMetaViewer/></A.Card>
            <A.Collapse style={{ margin: '10px' }}>
              <A.Collapse.Panel header={'Saved views'}>
              <div>
                <A.Button type='dashed' size='small'>View 15</A.Button>
                <A.Button type='dashed' size='small'>View 12</A.Button>
                <A.Button type='primary' size='small'>View 13</A.Button>
                <A.Button type='dashed' size='small'>View 4</A.Button>
                <A.Button type='dashed' size='small'>View 11</A.Button>
                <A.Button type='dashed' size='small'>View 10</A.Button>
              </div>
              </A.Collapse.Panel>
            </A.Collapse>
            <A.Collapse bordered={false} accordion>
              <A.Collapse.Panel key={'1'} header={'states definition'}>
                <A.Table size={'small'} pagination={false} showHeader={false} columns={[
                  { dataIndex: 'state', render: txt => <A.Checkbox>{txt}</A.Checkbox> },
                  { dataIndex: 'value', width: '200px', render: v => <A.Slider defaultValue={v} /> },
                  { dataIndex: 'isFixed', render: b => <A.Checkbox>{b ? 'fixed' : 'not fixed'}</A.Checkbox> }
                ]} dataSource={[
                  { state: 'a', value: 4 },
                  { state: 'b', value: 82, isFixed: true },
                  { state: 'c', value: 14 }
                ]} />
              </A.Collapse.Panel>
              <A.Collapse.Panel key={'2'} header={'animation'}>
                <div>something</div>
              </A.Collapse.Panel>
              <A.Collapse.Panel key={'3'} header={'players'}>
                <A.Tree
                  checkable
                >
                  <A.Tree.TreeNode title='team 1' key='t1'>
                    <A.Tree.TreeNode title='player 1' key='1' />
                    <A.Tree.TreeNode title='player 2' key='2' />
                    <A.Tree.TreeNode title='player 3' key='3' />
                  </A.Tree.TreeNode>
                  <A.Tree.TreeNode title='team 2' key='t2'>
                    <A.Tree.TreeNode title='player 4' key='4' />
                    <A.Tree.TreeNode title='player 5' key='5' />
                    <A.Tree.TreeNode title='player 6' key='6' />
                  </A.Tree.TreeNode>
                </A.Tree>
              </A.Collapse.Panel>
              <A.Collapse.Panel key={'4'} header={'view settings'}>
                <div>something</div>
              </A.Collapse.Panel>
            </A.Collapse>
          </A.Layout.Sider>
          <A.Layout.Content>
            <ReactHeight onHeightReady={(h) => this.props.dispatch({
              type: Redux.UPDATE_APP_KEY,
              data: { key: 'visHeight', value: h }
            })}>
              <div style={{ height: '45vh', width:'100%' }}>
                {(!_.isEmpty(store.view.dataset) && store.app.visHeight) ? <StatesVis /> : null}
              </div>
              <div style={{ height: '45vh', width:'100%' }}>
                {(!_.isEmpty(store.view.dataset) && store.app.visHeight) ? <TrajectoriesVis /> : null}
              </div>
            </ReactHeight>
          </A.Layout.Content>
        </A.Layout>
      </A.Layout>
    )
  }
}

export var App = RR.connect(mapStateToProps, mapDispatchToProps)(AppRaw)
