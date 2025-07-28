import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import {useDispatch} from "react-redux";

// check-next-lesson-flow
export const fetchGroupProfile = createAsyncThunk(
    "groupProfileSlice/fetchGroupProfile",
    ({id, group_type}) => {
        const {request} = useHttp()
        return request(`${API_URL}Group/groups/profile/${id}/`, "GET", null, headers())
    }
)

export const fetchGroupProfileTimeTable = createAsyncThunk(
    "groupProfileSlice/fetchGroupProfileTimeTable",
    ({group_id}) => {
        const {request} = useHttp()
        return request(`${API_URL}TimeTable/GrouptimeTableList/${group_id}`, "GET", null, headers())
    }
)

export const changeGroupProfile = createAsyncThunk(
    "groupProfileSlice/changeGroupProfile",
    ({data, group_type, status, id}) => {
        const {request} = useHttp()
        return request(`${API_URL}Group/groups/profile/${id}/`, "PATCH", JSON.stringify({
            ...data,
            group_type,
            status
        }), headers())
    }
)

export const deleteGroupProfile = createAsyncThunk(
    "groupProfileSlice/deleteGroupProfile",
    ({id, res}) => {
        const {request} = useHttp()
        return request(`${API_URL}Group/groups/delete/${id}/`, "POST", JSON.stringify(res), headers())
    }
)

export const fetchFilteredTeachers = createAsyncThunk(
    "groupProfileSlice/fetchFilteredTeachers",
    ({branch_id, subject_id}) => {
        const {request} = useHttp()
        return request(`${API_URL}Teachers/teachers-for-subject/${branch_id}/${subject_id}/`, "GET", null, headers())
    }
)

export const fetchReasons = createAsyncThunk(
    "groupProfileSlice/fetchReasons",
    () => {
        const {request} = useHttp()
        return request(`${API_URL}Group/group_reason/`, "GET", null, headers())
    }
)

export const fetchFilteredStudents = createAsyncThunk(
    "groupProfileSlice/fetchFilteredStudents",
    ({branch_id, subject_id}) => {
        const {request} = useHttp()
        return request(`${API_URL}Students/students_for_subject/${branch_id}/${subject_id}/`, "GET", null, headers())
    }
)

export const fetchFilteredStudentsAndTeachers = createAsyncThunk(
    "groupProfileSlice/fetchFilteredStudentsAndTeachers",
    ({branch_id, subject_id, res}) => {
        const {request} = useHttp()
        return request(`${API_URL}Group/filtered_teachers_students/${branch_id}/${subject_id}/`, "POST", JSON.stringify(res), headers())
    }
)

export const fetchFilteredGroups = createAsyncThunk(
    "groupProfileSlice/fetchFilteredGroups",
    ({id, group_id}) => {
        const {request} = useHttp()
        return request(`${API_URL}Group/groups_for_teacher/${id}/${group_id}/`, "GET", null, headers())
    }
)

export const moveGroup = createAsyncThunk(
    "groupProfileSlice/moveGroup",
    ({id, res}) => {
        const {request} = useHttp()
        return request(`${API_URL}Group/groups/move-to-group/${id}/`, "POST", JSON.stringify(res), headers())
    }
)

export const fetchWeekDays = createAsyncThunk(
    "groupProfileSlice/fetchWeekDays",
    () => {
        const {request} = useHttp()
        return request(`${API_URL}TimeTable/week_days/`, "GET", null, headers())
    }
)

export const changeWeekDays = createAsyncThunk(
    "groupProfileSlice/changeWeekDays",
    ({id, res}) => {
        const {request} = useHttp()
        return request(`${API_URL}TimeTable/GrouptimeTableUpdate/${id}/`, "PATCH", JSON.stringify(res), headers())
    }
)

export const createWeekDays = createAsyncThunk(
    "groupProfileSlice/changeWeekDays",
    ({id, res}) => {
        const {request} = useHttp()
        return request(`${API_URL}TimeTable/GrouptimeTableList/${id}/`, "POST", JSON.stringify(res), headers())
    }
)

export const deleteWeekDays = createAsyncThunk(
    "groupProfileSlice/deleteWeekDays",
    ({id}) => {
        const {request} = useHttp()
        return request(`${API_URL}TimeTable/time_table_delete/${id}/`, "DELETE", null, headers())
    }
)
// filtered_students_for_class_time_table/

export const filteredStudents = createAsyncThunk(
    "groupProfileSlice/filteredStudents",
    ({userBranchId, group_id, res}) => {
        const {request} = useHttp()
        return request(`${API_URL}Group/filtered_students_for_class_time_table/?branch=${userBranchId}&group=${group_id}`, "POST", JSON.stringify(res), headers())
    }
)

export const moveToClass = createAsyncThunk(
    "groupProfileSlice/moveToClass",
    ({userBranchId, id, res}) => {
        const dispatch = useDispatch()
        const {request} = useHttp()
        return request(`${API_URL}Group/filtered_students_move_to_class/?branch=${userBranchId}&group=${id}`, "POST", JSON.stringify(res), headers())
            .then((res) =>{
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: res.msg
                }))
            })
    }
)

export const getGroupStudyYears = createAsyncThunk(
    "groupProfileSlice/getGroupStudyYears",
    ({id}) => {
        const {request} = useHttp()
        return request(`${API_URL}Attendance/attendance_year_list/${id}/`, "GET", null, headers())
    }
)

export const getGroupStudyMonth = createAsyncThunk(
    "groupProfileSlice/getGroupStudyMonth",
    ({id, res}) => {
        const {request} = useHttp()
        return request(`${API_URL}Attendance/attendance_year_list/${id}/`, "POST", JSON.stringify({year: res}), headers())
    }
)

export const getGroupDebtStudents = createAsyncThunk(
    "groupProfileSlice/getGroupDebtStudents",
    ({id, res}) => {
        const {request} = useHttp()
        return request(`${API_URL}Attendance/attendance_year_list_all/${id}/`, "POST", JSON.stringify(res), headers())
    }
)


// export const getSchoolAttendance = createAsyncThunk(
//     "groupProfileSlice/getSchoolAttendance",
//     (id) => {
//         const {request} = useHttp()
//         return request(`${API_URL}Attendance/to_attend_school/${id}/`)
//     }
// )
