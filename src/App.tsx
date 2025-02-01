import React from "react"
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"
import { Layout, Menu } from "antd"
import UserList from "./components/UserList"
import UserPosts from "./components/UserPosts"
import TaskList from "./components/TaskList"

const { Header, Content } = Layout

const App: React.FC = () => {
  return (
    <Router>
      <Layout className="layout" style={{ minHeight: "100vh" }}>
        <Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
              <Link to="/">Users</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/tasks">Tasks</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px", marginTop: 64 }}>
          <Routes>
            <Route path="/" element={<UserList />} />
            <Route path="/user/:userId/posts" element={<UserPosts />} />
            <Route path="/tasks" element={<TaskList />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  )
}

export default App

