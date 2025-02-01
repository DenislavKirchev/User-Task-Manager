import React from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { List, Collapse, Button, Form, Input, message } from "antd"
import type { AppDispatch, RootState } from "../store"
import { fetchUsers, updateUser } from "../store/usersSlice"
import type { User } from "../types"

const { Panel } = Collapse

const UserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { users, status, error } = useSelector((state: RootState) => state.users)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers())
    }
  }, [status, dispatch])

  const onFinish = (values: User) => {
    dispatch(updateUser(values))
      .unwrap()
      .then(() => {
        message.success("User updated successfully")
      })
      .catch(() => {
        message.error("Failed to update user")
      })
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "failed") {
    return <div>Error: {error}</div>
  }

  return (
    <List
      dataSource={users}
      renderItem={(user) => (
        <List.Item>
          <Collapse style={{ width: "100%" }}>
            <Panel header={`${user.name} (${user.username})`} key={user.id}>
              <Form name={`user-${user.id}`} initialValues={user} onFinish={onFinish} layout="vertical">
                <Form.Item name="id" hidden>
                  <Input />
                </Form.Item>
                <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please input the name!" }]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[{ required: true, message: "Please input the username!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Please input the email!" },
                    { type: "email", message: "Please enter a valid email!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={["address", "street"]}
                  label="Street"
                  rules={[{ required: true, message: "Please input the street!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={["address", "suite"]}
                  label="Suite"
                  rules={[{ required: true, message: "Please input the suite!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={["address", "city"]}
                  label="City"
                  rules={[{ required: true, message: "Please input the city!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                  <Button htmlType="reset" style={{ marginLeft: 8 }}>
                    Cancel
                  </Button>
                  <Link to={`/user/${user.id}/posts`} style={{ marginLeft: 8 }}>
                    <Button>See posts</Button>
                  </Link>
                </Form.Item>
              </Form>
            </Panel>
          </Collapse>
        </List.Item>
      )}
    />
  )
}

export default UserList
