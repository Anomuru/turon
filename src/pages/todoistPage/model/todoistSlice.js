import { createSlice } from "@reduxjs/toolkit";
import { fetchTasks } from "./todoistThunk";

const initialState = {
   data: [],
   loading: false,
   error: null
}

const todoistSlice = createSlice({
   name: "todoistSlice",
   initialState,
   reducers: {
      addTask: (state, action) => {
         state.data = [action.payload, ...state.data]
      },
      updateTask: (state, action) => {
         state.data = state.data.map(item => {
            if (item.id === action.payload.id) return action.payload
            else return item
         })
         state.loading = false
      },
      deleteTask: (state, action) => {
         state.data = state.data.filter(item => item.id !== action.payload)
         state.loading = false
      }
   },
   extraReducers: builder =>
      builder
         .addCase(fetchTasks.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchTasks.fulfilled, (state, action) => {
            state.loading = false
            state.data = action.payload
            state.error = null
         })
         .addCase(fetchTasks.rejected, (state) => {
            state.loading = false
            state.error = "Xatolik yuz berdi"
         })
})


export const { reducer: todoistReducer } = todoistSlice
export const {
   addTask,
   updateTask,
   deleteTask
} = todoistSlice.actions

