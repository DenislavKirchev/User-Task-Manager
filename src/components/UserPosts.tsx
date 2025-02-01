import React from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { List, Card, Button, Modal, Form, Input, message } from "antd"
import type { AppDispatch, RootState } from "../store"
import { fetchPosts, updatePost, deletePost } from "../store/postsSlice"
import type { Post } from "../types"

const { confirm } = Modal

const UserPosts: React.FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const { posts, status, error } = useSelector((state: RootState) => state.posts)
  const user = useSelector((state: RootState) => state.users.users.find((u) => u.id === Number(userId)))

  useEffect(() => {
    if (userId) {
      dispatch(fetchPosts(Number(userId)))
    }
  }, [userId, dispatch])

  const handleUpdatePost = (post: Post) => {
    dispatch(updatePost(post))
      .unwrap()
      .then(() => {
        message.success("Post updated successfully")
      })
      .catch(() => {
        message.error("Failed to update post")
      })
  }

  const handleDeletePost = (postId: number) => {
    confirm({
      title: "Are you sure you want to delete this post?",
      onOk() {
        dispatch(deletePost(postId))
          .unwrap()
          .then(() => {
            message.success("Post deleted successfully")
          })
          .catch(() => {
            message.error("Failed to delete post")
          })
      },
    })
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "failed") {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      {user && (
        <Card title={`Posts by ${user.name}`} style={{ marginBottom: 16 }}>
          <p>Email: {user.email}</p>
          <p>Username: {user.username}</p>
        </Card>
      )}
      <List
        dataSource={posts}
        renderItem={(post) => (
          <List.Item>
            <Card
              title={post.title}
              extra={
                <Button danger onClick={() => handleDeletePost(post.id)}>
                  Delete
                </Button>
              }
              style={{ width: "100%" }}
            >
              <Form initialValues={post} onFinish={handleUpdatePost} layout="vertical">
                <Form.Item name="id" hidden>
                  <Input />
                </Form.Item>
                <Form.Item name="userId" hidden>
                  <Input />
                </Form.Item>
                <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please input the title!" }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="body" label="Body" rules={[{ required: true, message: "Please input the body!" }]}>
                  <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Update
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </List.Item>
        )}
      />
    </div>
  )
}

export default UserPosts;