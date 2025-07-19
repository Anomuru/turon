import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, branchQuery, branchQueryId, headers, useHttp} from "shared/api/base";




export const fetchNewStudentsData = createAsyncThunk(
    "studentsSlice/fetchNewStudentsData",
     async () =>{
        const {request} = useHttp()
         return await request(`${API_URL}Students/students_list/`, "GET" , null , headers())
     }
)

export const fetchOnlyNewStudentsData = createAsyncThunk(
    'studentsSlice/fetchOnlyNewStudentsData',
    async ({subjId, fromAge, untilAge, langId, userBranchId}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Students/new-registered-students/?subject=${subjId}&age=${fromAge}-${untilAge}&language=${langId}&branch=${branchQueryId()}`, "GET", null, headers())
    }
)

export const fetchStudentsByClass = createAsyncThunk(
    "studentsSlice/fetchStudentsByClass",
    ({branch, number}) => {
        const {request} = useHttp()
        return request(`${API_URL}Students/new-registered-students/?branch=${branch}&number=${number}`, "GET", null, headers())
    }
)

export const fetchOnlyStudyingStudentsData = createAsyncThunk(
    'studentsSlice/fetchOnlyStudyingStudentsData',
    async ({subjId, fromAge, untilAge, langId,userBranchId}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Students/active-students/?subject=${subjId}&age=${fromAge}-${untilAge}&language=${langId}&branch=${branchQueryId()}`, "GET", null, headers())
    }
)

export const fetchOnlyDeletedStudentsData = createAsyncThunk(
    'studentsSlice/fetchOnlyDeletedStudentsData',
    async ({id}) => {
        const {request} = useHttp();
        return await request(`${API_URL}Students/deleted-group-students/?branch=${id}`, "GET", null, headers())
    }
)

export const fetchFilteredStudents = createAsyncThunk(
    "studentsSlice/fetchFilteredStudents",
    async (id) => {
        const {request} = useHttp()
        // return await request(`${API_URL}Students/api/filter_students_subject/1/`, "GET", null, headers())
        return await request(`${API_URL}Students/api/filter_students_subject/${id}/`, "GET", null, headers())
    }
)

export const fetchClassNumberList = createAsyncThunk(
    "studentsSlice/fetchClassNumberList",
    async ({branch}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Class/class_number_list/?branch=${branch}`, "GET", null, headers())
    }
)

export const fetchClassColors = createAsyncThunk(
    "studentsSlice/fetchClassColors",
    async () => {
        const {request} = useHttp()
        return await request(`${API_URL}Class/class_colors/`, "GET", null, headers())
    }
)

export const fetchSchoolStudents = createAsyncThunk(
    "studentsSlice/fetchSchoolStudents",
    async ({userBranchId}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Students/school_students/?branch=${userBranchId}`, "GET", null, headers())
    }
)

export const createSchoolClass = createAsyncThunk(
    "studentsSlice/createSchoolClass",
    async ({res}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Group/groups/create/?${branchQuery()}`, "POST", JSON.stringify(res), headers())
    }
)


export const fetchDeletedNewStudentsThunk = createAsyncThunk(
    'studentsSlice/fetchDeletedNewStudents',
    async (branchId) => {
        const {request} = useHttp();
        return await request(`${API_URL}Students/deleted-from-registered/?branch=${branchId}`, 'GET', null, headers())
    }
)

