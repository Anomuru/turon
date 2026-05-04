import { createSlice } from "@reduxjs/toolkit";
import {
    fetchEducationQualityOverview,
    fetchEducationQualityStatistics,
    fetchTermsList,
} from "../thunk/educationQualityThunk";
import { fetchClassSubjects, getClassesForClassTypes } from "../../../class/model/thunk/classThunk";
import { fetchTeachersData } from "../../../teachers/model/teacherThunk";

const initialState = {
    loading: false,
    error: null,
    overview: null,
    statistics: null,
    termInfo: null,
    chartData: null,
    terms: [],
    subjects: [],
    classes: [],
    teachers: [],
    selectedTerm: null,
    selectedSubject: null,
    selectedClass: null,
    selectedTeacher: null,
};

const educationQualitySlice = createSlice({
    name: "educationQuality",
    initialState,
    reducers: {
        setSelectedTerm: (state, action) => {
            state.selectedTerm = action.payload;
        },
        setSelectedSubject: (state, action) => {
            state.selectedSubject = action.payload;
            state.selectedClass = null;
            state.selectedTeacher = null;
        },
        setSelectedClass: (state, action) => {
            state.selectedClass = action.payload;
        },
        setSelectedTeacher: (state, action) => {
            state.selectedTeacher = action.payload;
        },
        clearFilters: (state) => {
            state.selectedSubject = null;
            state.selectedClass = null;
            state.selectedTeacher = null;
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Fetch Overview
            .addCase(fetchEducationQualityOverview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEducationQualityOverview.fulfilled, (state, action) => {
                state.loading = false;
                state.overview = action.payload;
            })
            .addCase(fetchEducationQualityOverview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch Statistics
            .addCase(fetchEducationQualityStatistics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEducationQualityStatistics.fulfilled, (state, action) => {
                state.loading = false;
                state.statistics = action.payload;
                state.termInfo = action.payload.term;
                state.chartData = action.payload.charts?.[0] || null;
            })
            .addCase(fetchEducationQualityStatistics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch Terms
            .addCase(fetchTermsList.fulfilled, (state, action) => {
                state.terms = action.payload;
                if (action.payload.length > 0 && !state.selectedTerm) {
                    state.selectedTerm = action.payload[0].id;
                }
            })

            // Fetch Subjects (from class entity)
            .addCase(fetchClassSubjects.fulfilled, (state, action) => {
                state.subjects = action.payload;
            })

            // Fetch Classes (from class entity)
            .addCase(getClassesForClassTypes.fulfilled, (state, action) => {
                state.classes = action.payload;
            })

            // Fetch Teachers (from teachers entity)
            .addCase(fetchTeachersData.fulfilled, (state, action) => {
                state.teachers = action.payload.results || action.payload;
            });
    },
});

export const {
    setSelectedTerm,
    setSelectedSubject,
    setSelectedClass,
    setSelectedTeacher,
    clearFilters,
    resetState,
} = educationQualitySlice.actions;

export default educationQualitySlice.reducer;
