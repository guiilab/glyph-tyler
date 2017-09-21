import { Layout, Menu, Breadcrumb, Icon } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom'
const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

let mapStateToProps = (state) => {
  return _.assign({})
}

let mapDispatchToProps = (dispatch) => {
  return { dispatch }
}

export class App extends React.Component {
  render() {
    return <div>hello</div>
  }
}
