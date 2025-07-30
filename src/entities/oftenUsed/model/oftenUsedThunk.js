import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";

export const fetchSubjectsData = createAsyncThunk(
    'oftenUsedSlice/fetchSubjectsData',
    () => {
        const {request} = useHttp()
        return request(`${API_URL}Subjects/subject/`, "GET", null, headers())
    }
)

export const fetchLanguagesData = createAsyncThunk(
    'oftenUsedSlice/fetchLanguagesData',
    () => {
        const {request} = useHttp()
        return request(`${API_URL}Language/language/`, "GET", null, headers())
    }
)

export const fetchClassColorData = createAsyncThunk(
    "oftenUsedSlice/fetchClassColorData",
    () => {
        const {request} = useHttp()
        return request(`${API_URL}Class/class_colors/`, "GET", null, headers())
    }
)

export const fetchClassNumberData = createAsyncThunk(
    "oftenUsedSlice/fetchClassNumberData",
    ({branch}) => {
        const {request} = useHttp()
        return request(`${API_URL}Class/class_number_list/?branch=${branch}`, "GET", null, headers())
    }
)

export const fetchClassTypeData = createAsyncThunk(
    "oftenUsedSlice/fetchClassTypeData",
    ({branch}) => {
        const {request} = useHttp()
        return request(`${API_URL}Class/class_types/?branch=${branch}`, "GET", null, headers())
    }
)


export const fetchCategories = createAsyncThunk(
    "oftenUsedSlice/fetchCategories",
    (id) => {
        const {request} = useHttp()
        return request(`${API_URL}Teachers/salary-types/?branch=${id}`, "GET", null, headers())
    }
)

export const fetchClassInput = createAsyncThunk(
    "oftenUsedSlice/fetchHoverClass",
    () => {
        const {request} = useHttp()
        return request(`${API_URL}SchoolTimeTable/hours-list-type/`, "GET", null, headers())
    }
)

export const fetchGroupsForSelect = createAsyncThunk(
    "oftenUsedSlice/fetchGroupsForSelect",
    (id) => {
        console.log(id , "id")
        const {request} = useHttp()
        return request(`${API_URL}Group/add/class/filtered/?branch=${id}`, "GET", null, headers())
    }
)

export const fetchTeachersForSelect = createAsyncThunk(
    "oftenUsedSlice/fetchTeachersForSelect",
    (id) => {
        const {request} = useHttp()
        return request(`${API_URL}Group/create/class/teachers/?branch=${id}`, "GET", null, headers())
    }
)

export const fetchBranchesForSelect = createAsyncThunk(
    "oftenUsedSlice/fetchBranchesForSelect",
    (id) => {
        const {request} = useHttp()
        return request(`${API_URL}Branch/branch_filtered/`, "GET", null)
    }
)

export const fetchOperatorsData = createAsyncThunk(
    "oftenUsedSlice/fetchOperatorsData",
    (id) => {
        const {request} = useHttp()
        return request(`${API_URL}Lead/operators/?branch_id=${id}`, "GET", null)
    }
)

// Lead/operators/