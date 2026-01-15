export const getTasks = (state) =>
   state.todoistSlice?.tasks

export const getTaskLoading = (state) =>
   state.todoistSlice?.taskLoading

export const getTaskProfile = (state) =>
   state.todoistSlice?.taskProfile

export const getTaskProfileLoading = (state) =>
   state.todoistSlice?.profileLoading

export const getTaskTags = (state) =>
   state.todoistSlice?.tags

export const getTaskTagsLoading = (state) =>
   state.todoistSlice?.tagLoading

export const getTaskRecurringTypes = (state) =>
   state.todoistSlice?.recurringTypes

export const getTaskStatusList = (state) =>
   state.todoistSlice?.statusList

export const getTaskCategoryList = (state) =>
   state.todoistSlice?.categoryList

export const getTaskNotificationsList = (state) =>
   state.todoistSlice?.notifications

export const getTaskNotificationLoading = (state) =>
   state.todoistSlice?.notificationLoading

export const getTaskError = (state) =>
   state.todoistSlice?.error