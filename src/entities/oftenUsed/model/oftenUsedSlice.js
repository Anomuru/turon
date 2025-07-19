import {createSlice} from "@reduxjs/toolkit";

import {
    fetchSubjectsData,
    fetchLanguagesData,
    fetchClassColorData,
    fetchClassNumberData,
    fetchClassTypeData,
    fetchCategories,
    fetchClassInput,
    fetchGroupsForSelect,
    fetchTeachersForSelect,
    fetchBranchesForSelect, fetchOperatorsData
} from "./oftenUsedThunk";

const initialState = {
    subjects: [],
    subjectsLoading: false,
    subjectsError: null,
    languages: [],
    languagesLoading: false,
    languagesError: null,
    classColor: [],
    classColorLoading: false,
    classColorError: null,
    classNumber: [],
    classNumberLoading: false,
    classNumberError: null,
    classType: [],
    classTypeLoading: false,
    classTypeError: null,
    teachers: [],
    teachersLoading: false,
    teachersError: null,
    categories: [],
    classInput: [],
    classInputLoading: false,
    classInputError: null,
    groupsLoading: false,
    groupsError: null,
    groups: [],

    branchesLoading: false,
    branchesError: null,
    branches: [],

    operators: [],
    operatorsLoading: false,
    operatorsError: null


}

const oftenUsedSlice = createSlice({
    name: "oftenUsedSlice",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(fetchSubjectsData.pending, (state) => {
                state.subjectsLoading = true
                state.subjectsError = null
            })
            .addCase(fetchSubjectsData.fulfilled, (state, action) => {
                state.subjects = action.payload
                state.subjectsLoading = false
                state.subjectsError = null
            })
            .addCase(fetchSubjectsData.rejected, (state) => {
                state.subjectsLoading = false
                state.subjectsError = "error"
            })
            .addCase(fetchLanguagesData.pending, (state) => {
                state.languagesLoading = true
                state.languagesError = null
            })
            .addCase(fetchLanguagesData.fulfilled, (state, action) => {
                state.languages = action.payload
                state.languagesLoading = false
                state.languagesError = null
            })
            .addCase(fetchLanguagesData.rejected, (state) => {
                state.languagesLoading = false
                state.languagesError = "error"
            })
            .addCase(fetchClassColorData.pending, (state) => {
                state.classColorLoading = true
                state.classColorError = null
            })
            .addCase(fetchClassColorData.fulfilled, (state, action) => {
                state.classColor = action.payload
                state.classColorLoading = false
                state.classColorError = null
            })
            .addCase(fetchClassColorData.rejected, (state) => {
                state.classColorLoading = false
                state.classColorError = "error"
            })
            .addCase(fetchClassNumberData.pending, (state) => {
                state.classNumberLoading = true
                state.classNumberError = null
            })
            .addCase(fetchClassNumberData.fulfilled, (state, action) => {
                state.classNumber = action.payload
                state.classNumberLoading = false
                state.classNumberError = null
            })
            .addCase(fetchClassNumberData.rejected, (state) => {
                state.classNumberLoading = false
                state.classNumberError = "error"
            })
            .addCase(fetchClassTypeData.pending, (state) => {
                state.classTypeLoading = true
                state.classTypeError = null
            })
            .addCase(fetchClassTypeData.fulfilled, (state, action) => {
                state.classType = action.payload
                state.classTypeLoading = false
                state.classTypeError = null
            })
            .addCase(fetchClassTypeData.rejected, (state) => {
                state.classTypeLoading = false
                state.classTypeError = "error"
            })


            .addCase(fetchCategories.pending, (state) => {
                state.classTypeLoading = true
                state.classTypeError = null
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload
                state.classTypeLoading = false
                state.classTypeError = null
            })
            .addCase(fetchCategories.rejected, (state) => {
                state.classTypeLoading = false
                state.classTypeError = "error"
            })

            .addCase(fetchClassInput.pending, (state) => {
                state.classInputLoading = true
                state.classInputError = null
            })
            .addCase(fetchClassInput.fulfilled, (state, action) => {
                state.classInput = action.payload
                state.classInputLoading = false
                state.classInputError = null
            })
            .addCase(fetchClassInput.rejected, (state) => {
                state.classInputLoading = false
                state.classInputError = "error"
            })


            .addCase(fetchGroupsForSelect.pending, (state) => {
                state.groupsLoading = true
                state.groupsError = null
            })
            .addCase(fetchGroupsForSelect.fulfilled, (state, action) => {
                state.groups = action.payload
                state.groupsLoading = false
                state.groupsError = null
            })
            .addCase(fetchGroupsForSelect.rejected, (state) => {
                state.groupsLoading = false
                state.groupsError = "error"
            })


            .addCase(fetchTeachersForSelect.pending, (state) => {
                state.teachersLoading = true
                state.teachersError = null
            })
            .addCase(fetchTeachersForSelect.fulfilled, (state, action) => {
                state.teachers = action.payload
                state.teachersLoading = false
                state.teachersError = null
            })
            .addCase(fetchTeachersForSelect.rejected, (state) => {
                state.teachersLoading = false
                state.teachersError = "error"
            })


            .addCase(fetchBranchesForSelect.pending, (state) => {
                state.branchesLoading = true
                state.branchesError = null
            })
            .addCase(fetchBranchesForSelect.fulfilled, (state, action) => {
                state.branches = action.payload
                state.branchesLoading = false
                state.branchesError = null
            })
            .addCase(fetchBranchesForSelect.rejected, (state) => {
                state.branchesLoading = false
                state.branchesError = "error"
            })

            .addCase(fetchOperatorsData.pending, (state) => {
                state.operatorsLoading = true
                state.operatorsError = null
            })
            .addCase(fetchOperatorsData.fulfilled, (state, action) => {
                state.operators = action.payload
                state.operatorsLoading = false
                state.operatorsError = null
            })
            .addCase(fetchOperatorsData.rejected, (state) => {
                state.operatorsLoading = false
                state.operatorsError = "error"
            })
})

export default oftenUsedSlice.reducer
