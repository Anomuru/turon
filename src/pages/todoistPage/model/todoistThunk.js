import { createAsyncThunk } from "@reduxjs/toolkit";
import { useHttp, API_URL, headers, ParamUrl } from "shared/api/base";

export const fetchTasks = createAsyncThunk(
   "todoistSlice/fetchTasks",
   ({ status, creator, executor, reviewer, created_at, deadline, deadline_after, deadline_before, tags, category }) => {
      const { request } = useHttp()
      return request(`${API_URL}Tasks/missions/?${ParamUrl({
         status,
         creator,
         executor,
         reviewer,
         created_at,
         deadline,
         deadline_after,
         deadline_before,
         tags,
         category
      })}`, "GET", null, headers())
   }
)

export const fetchTaskProfile = createAsyncThunk(
   "todoistSlice/fetchTaskProfile",
   ({ id }) => {
      const { request } = useHttp()
      return request(`${API_URL}Tasks/missions/${id}/`, "GET", null, headers())
   }
)

export const fetchTaskTags = createAsyncThunk(
   "todoistSlice/fetchTaskTags",
   () => {
      const { request } = useHttp()
      return request(`${API_URL}Tasks/tags/`, "GET", null, headers())
   }
)

export const fetchTaskNotifications = createAsyncThunk(
   "todoistSlice/fetchTaskNotifications",
   ({ role, user_id }) => {
      const { request } = useHttp()
      return request(`${API_URL}Tasks/notifications/?role=${role}&user_id=${user_id}`, "GET", null, headers())
   }
)


