import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, branchQuery, branchQueryId, headers, ParamUrl, useHttp} from "shared/api/base";


const renderItem = ({langId, untilAge, fromAge}) => {
    return `${fromAge ? `&age=${fromAge}-${untilAge}` : ""}${langId !== "all" ? `&language=${langId}` : ""}`
}


export const fetchNewStudentsData = createAsyncThunk(
    "newStudents/fetchNewStudentsData",
    async () => {
        const {request} = useHttp()
        return await request(`${API_URL}Students/students_list/`, "GET", null, headers())
    }
)

export const fetchOnlyNewStudentsData = createAsyncThunk(
    'newStudents/fetchOnlyNewStudentsData',
    async ({age, language, branch, offset, limit, search}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Students/new-registered-students/?${ParamUrl({
            branch,
            limit,
            offset,
            language,
            age,
            search
        })}`, "GET", null, headers())
    }
)

export const fetchStudentsByClass = createAsyncThunk(
    "newStudents/fetchStudentsByClass",
    ({branch, number}) => {
        const {request} = useHttp()
        return request(`${API_URL}Students/new-registered-students/?branch=${branch}&number=${number}`, "GET", null, headers())
    }
)

export const fetchOnlyStudyingStudentsData = createAsyncThunk(
    'newStudents/fetchOnlyStudyingStudentsData',
    async ({age, language, branch, limit, offset, search}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Students/active-students/?${ParamUrl({
            branch,
            limit,
            offset,
            language,
            age,
            search
        })}`, "GET", null, headers())
    }
)

export const fetchOnlyDeletedStudentsData = createAsyncThunk(
    'newStudents/fetchOnlyDeletedStudentsData',
    async ({age, language, branch, limit, offset, search}) => {
        const {request} = useHttp();
        return await request(`${API_URL}Students/deleted-group-students/?${ParamUrl({
            branch,
            limit,
            offset,
            language,
            age,
            search
        })}`, "GET", null, headers())
    }
)

export const fetchFilteredStudents = createAsyncThunk(
    "newStudents/fetchFilteredStudents",
    async (id) => {
        const {request} = useHttp()
        // return await request(`${API_URL}Students/api/filter_students_subject/1/`, "GET", null, headers())
        return await request(`${API_URL}Students/api/filter_students_subject/${id}/`, "GET", null, headers())
    }
)

export const fetchClassNumberList = createAsyncThunk(
    "newStudents/fetchClassNumberList",
    async ({branch}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Class/class_number_list/?branch=${branch}`, "GET", null, headers())
    }
)

export const fetchClassColors = createAsyncThunk(
    "newStudents/fetchClassColors",
    async () => {
        const {request} = useHttp()
        return await request(`${API_URL}Class/class_colors/`, "GET", null, headers())
    }
)

export const fetchSchoolStudents = createAsyncThunk(
    "newStudents/fetchSchoolStudents",
    async ({userBranchId}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Students/school_students/?branch=${userBranchId}`, "GET", null, headers())
    }
)

export const createSchoolClass = createAsyncThunk(
    "newStudents/createSchoolClass",
    async ({res}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Group/groups/create/?${branchQuery()}`, "POST", JSON.stringify(res), headers())
    }
)


export const fetchDeletedNewStudentsThunk = createAsyncThunk(
    'newStudents/fetchDeletedNewStudents',
    async ({branch, language, age, offset, limit, search}) => {
        const {request} = useHttp();
        return await request(`${API_URL}Students/deleted-from-registered/?${ParamUrl({
            branch,
            language,
            age,
            offset,
            limit,
            search
        })}`, 'GET', null, headers())
    }
)


export const fetchUpdateClassStudent = createAsyncThunk(
    'newStudents/fetchUpdateClassStudent',
    async ({branch, limit, offset, search}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Students/new-registered-students/?${ParamUrl({
            branch,
            limit,
            offset,
            // search
        })}`, "GET", null, headers())
    }
)

