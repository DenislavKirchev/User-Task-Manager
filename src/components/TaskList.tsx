import React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Table, Switch, Input, Select, Pagination } from "antd"
import type { AppDispatch, RootState } from "../store"
import { fetchTasks, updateTask } from "../store/tasksSlice"
import type { Task } from "../types"

const { Search } = Input
const { Option } = Select

const TaskList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { tasks, status, error } = useSelector((state: RootState) => state.tasks)
  const users = useSelector((state: RootState) => state.users.users)

  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [filterStatus, setFilterStatus] = useState<boolean | null>(null)
  const [filterTitle, setFilterTitle] = useState("")
  const [filterUser, setFilterUser] = useState<number | null>(null)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks())
    }
  }, [status, dispatch])

  useEffect(() => {
    let filtered = [...tasks]

    if (filterStatus !== null) {
      filtered = filtered.filter((task) => task.completed === filterStatus)
    }

    if (filterTitle) {
      filtered = filtered.filter((task) => task.title.toLowerCase().includes(filterTitle.toLowerCase()))
    }

    if (filterUser !== null) {
      filtered = filtered.filter((task) => task.userId === filterUser)
    }

    setFilteredTasks(filtered)
    setCurrentPage(1)
  }, [tasks, filterStatus, filterTitle, filterUser])

  const handleStatusChange = (checked: boolean, task: Task) => {
    dispatch(updateTask({ ...task, completed: checked }))
  }

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "User",
      dataIndex: "userId",
      key: "userId",
      render: (userId: number) => {
        const user = users.find((u) => u.id === userId)
        return user ? user.name : "Unknown"
      },
    },
    {
      title: "Status",
      dataIndex: "completed",
      key: "completed",
      render: (completed: boolean, task: Task) => (
        <Switch checked={completed} onChange={(checked) => handleStatusChange(checked, task)} />
      ),
    },
  ]

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "failed") {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Filter by title"
          onSearch={(value) => setFilterTitle(value)}
          style={{ width: 200, marginRight: 16 }}
        />
        <Select
          style={{ width: 200, marginRight: 16 }}
          placeholder="Filter by status"
          allowClear
          onChange={(value: boolean | null) => setFilterStatus(value)}
        >
          <Option value={true}>Completed</Option>
          <Option value={false}>Not Completed</Option>
        </Select>
        <Select
          style={{ width: 200 }}
          placeholder="Filter by user"
          allowClear
          onChange={(value: number | null) => setFilterUser(value)}
        >
          {users.map((user) => (
            <Option key={user.id} value={user.id}>
              {user.name}
            </Option>
          ))}
        </Select>
      </div>
      <Table
        columns={columns}
        dataSource={filteredTasks.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        rowKey="id"
        pagination={false}
      />
      <Pagination
        current={currentPage}
        total={filteredTasks.length}
        pageSize={pageSize}
        onChange={setCurrentPage}
        style={{ marginTop: 16, textAlign: "right" }}
      />
    </div>
  )
}

export default TaskList;