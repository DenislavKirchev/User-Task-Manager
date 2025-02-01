import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import type { Post } from "../types"

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async (userId: number) => {
  const response = await axios.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
  return response.data
})

export const updatePost = createAsyncThunk("posts/updatePost", async (post: Post) => {
  const response = await axios.put<Post>(`https://jsonplaceholder.typicode.com/posts/${post.id}`, post)
  return response.data
})

export const deletePost = createAsyncThunk("posts/deletePost", async (postId: number) => {
  await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`)
  return postId
})

interface PostsState {
  posts: Post[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: PostsState = {
  posts: [],
  status: "idle",
  error: null,
}

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.status = "succeeded"
        state.posts = action.payload
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch posts"
      })
      .addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
        const index = state.posts.findIndex((post) => post.id === action.payload.id)
        if (index !== -1) {
          state.posts[index] = action.payload
        }
      })
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<number>) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload)
      })
  },
})

export default postsSlice.reducer