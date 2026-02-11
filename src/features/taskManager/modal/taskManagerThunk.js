import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";
import {formatDate} from "shared/ui/formDate/formDate";


export const fetchTaskManager = createAsyncThunk(
    "taskManagerSlice/fetchTaskManager",
    async ({date , taskType,branch}) => {
        const {request} = useHttp()

        const today = new Date()

        const formatedDate = formatDate(today)
        if (date === formatedDate) {
            return await request(`${API_URL}Lead/${taskType === "completed" ? "lead_list_completed" : "lead_list/"}?date=${date}&branch_id=${branch}`, "GET", null, headers())
        }
        return await request(`${API_URL}Lead/lead_list_completed/?date=${date}&branch_id=${branch}`, "GET", null, headers())
    }
)


export const fetchBranch = createAsyncThunk(
    "taskManagerSlice/fetchBranch",
    async () => {
        const {request} = useHttp()
        return await request(`${API_URL}Branch/branch_list/`, "GET", null, headers())
    }
)

export const fetchAdminTaskManager = createAsyncThunk(
    "taskManagerSlice/fetchAdminTaskManager",
    async ({operator_id, date, branch, taskType}) => {
        const {request} = useHttp()
        const today = new Date()

        const formatedDate = formatDate(today)


        if (date === formatedDate) {
            return await request(
                `${API_URL}Lead/${taskType === "completed" ? "lead_list_completed" : "lead_list/"}?date=${date}&branch_id=${branch}${operator_id === "all" ? "" : `&operator_id=${operator_id}`}`,
                "GET", null, headers())
        }

        return await request(
            `${API_URL}Lead/lead_list_completed/?date=${date}&branch_id=${branch}${operator_id === "all" ? "" : `&operator_id=${operator_id}`}`,
            "GET", null, headers())

    }
)

