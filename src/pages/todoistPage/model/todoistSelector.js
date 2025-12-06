export const getTasks = (state) =>
   state.todoistSlice?.data
export const getTaskLoading = (state) =>
   state.todoistSlice?.loading
export const getTaskError = (state) =>
   state.todoistSlice?.error