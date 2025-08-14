import {createSlice} from "@reduxjs/toolkit";
import {
    fetchFilteredStudentsAndTeachers,
    fetchGroupProfileTimeTable,
    changeGroupProfile,
    fetchGroupProfile,
    fetchReasons,
    fetchFilteredStudents,
    fetchFilteredTeachers,
    fetchFilteredGroups,
    fetchWeekDays,
    createWeekDays,
    moveGroup,
    filteredStudents,
    getGroupStudyYears,
    getGroupStudyMonth,
    getGroupDebtStudents
} from "./groupProfileThunk";

const initialState = {
    data: null,
    groupAttendance: [],
    nextLessonData: null,
    filteredTeachers: null,
    filteredStudents: null,
    filteredGroups: null,
    timeTable: null,
    weekDays: null,
    selectedWeekDay: null,
    reasons: null,
    studyYears: [],
    studyMonths: [],
    debtStudents: [],
    loading: false,
    studentsLoading: false,
    error: null
}

const groupProfileSlice = createSlice({
    name: "groupProfileSlice",
    initialState,
    reducers: {
        getNextLesson: (state, action) => {
            state.nextLessonData = action.payload
        },
        changeDebtStudent: (state, action) => {
            state.debtStudents = state.debtStudents.map(item => {
                if (item.id === action.payload.id) {
                    return {
                        remaining_debt: action.payload.res.remaining_debt,
                        total_debt: action.payload.res.total_debt,
                        attendance_id: item?.attendance_id,
                        charity: item?.charity,
                        discount: item?.discount,
                        id: item?.id,
                        name: item?.name,
                        payment: item?.payment,
                        reason: item?.reason,
                        surname: item?.surname,
                    }
                } else return item
            })
        },
        deleteDebtStudent: (state, action) => {
            state.debtStudents = state.debtStudents.filter(item => item.id !== action.payload)
        },
        onMoveToGroup: (state, action) => {
            state.data.students = state.data.students.filter(item =>
                !action.payload.includes(item.id)
            );
        }
    },
    extraReducers: builder =>
        builder
            .addCase(fetchGroupProfile.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchGroupProfile.fulfilled, (state, action) => {
                state.data = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(fetchGroupProfile.rejected, (state, action) => {
                state.loading = false
                state.error = "error"
            })
            .addCase(changeGroupProfile.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(changeGroupProfile.fulfilled, (state, action) => {
                state.data = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(changeGroupProfile.rejected, (state, action) => {
                state.loading = false
                state.error = "error"
            })
            .addCase(moveGroup.pending, state => {
                state.loading = true
                state.error = "error"
            })
            .addCase(moveGroup.fulfilled, (state, action) => {
                state.data = action.payload.data
                state.error = action.payload.errors
                state.loading = false
            })
            .addCase(moveGroup.rejected, (state, action) => {
                state.loading = false
                state.error = "error"
            })
            .addCase(filteredStudents.pending, state => {
                // state.loading = true
                // state.error = "error"
            })
            .addCase(filteredStudents.fulfilled, (state, action) => {
                state.filteredStudents = action.payload.students
                // state.error = action.payload.errors
                // state.loading = false
            })
            .addCase(filteredStudents.rejected, (state, action) => {
                // state.loading = false
                // state.error = "error"
            })
            // .addCase(fetchFilteredTeachers.pending, state => {
            //     // state.loading = true
            //     // state.error = null
            // })
            // .addCase(fetchFilteredTeachers.fulfilled, (state, action) => {
            //     state.filteredTeachers = action.payload
            //     // state.loading = false
            //     // state.error = null
            // })
            // .addCase(fetchFilteredTeachers.rejected, (state, action) => {
            //     // state.loading = false
            //     // state.error = "error"
            // })
            // .addCase(fetchFilteredStudents.pending, state => {
            //     // state.loading = true
            //     // state.error = null
            // })
            // .addCase(fetchFilteredStudents.fulfilled, (state, action) => {
            //     state.filteredStudents = action.payload
            //     // state.loading = false
            //     // state.error = null
            // })
            // .addCase(fetchFilteredStudents.rejected, (state, action) => {
            //     // state.loading = false
            //     // state.error = "error"
            // })
            .addCase(fetchReasons.pending, state => {
                // state.loading = true
                // state.error = null
            })
            .addCase(fetchReasons.fulfilled, (state, action) => {
                state.reasons = action.payload
                // state.loading = false
                // state.error = null
            })
            .addCase(fetchReasons.rejected, (state, action) => {
                // state.loading = false
                // state.error = "error"
            })
            .addCase(fetchGroupProfileTimeTable.pending, state => {
                // state.loading = true
                // state.error = null
            })
            .addCase(fetchGroupProfileTimeTable.fulfilled, (state, action) => {
                state.timeTable = action.payload
                // state.loading = false
                // state.error = null
            })
            .addCase(fetchGroupProfileTimeTable.rejected, (state, action) => {
                // state.loading = false
                // state.error = "error"
            })
            .addCase(fetchFilteredStudentsAndTeachers.pending, state => {
                // state.loading = true
                // state.error = null
            })
            .addCase(fetchFilteredStudentsAndTeachers.fulfilled, (state, action) => {
                state.filteredTeachers = action.payload.teachers
                state.filteredStudents = action.payload.students
                // state.loading = false
                // state.error = null
            })
            .addCase(fetchFilteredStudentsAndTeachers.rejected, (state, action) => {
                // state.loading = false
                // state.error = "error"
            })
            .addCase(fetchFilteredGroups.pending, state => {
                // state.loading = true
                // state.error = null
            })
            .addCase(fetchFilteredGroups.fulfilled, (state, action) => {
                state.filteredGroups = action.payload
                // state.filteredStudents = action.payload.students
                // state.loading = false
                // state.error = null
            })
            .addCase(fetchFilteredGroups.rejected, (state, action) => {
                // state.loading = false
                // state.error = "error"
            })
            .addCase(fetchWeekDays.pending, state => {
                // state.loading = true
                // state.error = null
            })
            .addCase(fetchWeekDays.fulfilled, (state, action) => {
                console.log(action.payload?.today, "action.payload?.today")
                state.weekDays = action.payload?.days?.results?.map(item => ({...item, name: item.name_uz}))
                state.selectedWeekDay = action.payload?.today
                // state.filteredStudents = action.payload.students
                // state.loading = false
                // state.error = null
            })
            .addCase(fetchWeekDays.rejected, (state, action) => {
                // state.loading = false
                // state.error = "error"
            })
            .addCase(createWeekDays.pending, state => {
                // state.loading = true
                // state.error = null
            })
            .addCase(createWeekDays.fulfilled, (state, action) => {
                state.weekDays = action.payload.map(item => ({...item, name: item.name_uz}))
                // state.filteredStudents = action.payload.students
                // state.loading = false
                // state.error = null
            })
            .addCase(createWeekDays.rejected, (state, action) => {
                // state.loading = false
                // state.error = "error"
            })


            .addCase(getGroupStudyYears.pending, state => {
                // state.loading = true
                // state.error = null
            })
            .addCase(getGroupStudyYears.fulfilled, (state, action) => {
                state.studyYears = action.payload?.dates
                // state.filteredStudents = action.payload.students
                // state.loading = false
                // state.error = null
            })
            .addCase(getGroupStudyYears.rejected, (state, action) => {
                // state.loading = false
                // state.error = "error"
            })

            .addCase(getGroupStudyMonth.pending, state => {
                // state.loading = true
                // state.error = null
            })
            .addCase(getGroupStudyMonth.fulfilled, (state, action) => {
                state.studyMonths = action.payload?.dates
                // state.filteredStudents = action.payload.students
                // state.loading = false
                // state.error = null
            })
            .addCase(getGroupStudyMonth.rejected, (state, action) => {
                // state.loading = false
                // state.error = "error"
            })

            .addCase(getGroupDebtStudents.pending, state => {
                // state.loading = true
                // state.error = null
            })
            .addCase(getGroupDebtStudents.fulfilled, (state, action) => {
                state.debtStudents = action.payload?.students
                // state.filteredStudents = action.payload.students
                // state.loading = false
                // state.error = null
            })
            .addCase(getGroupDebtStudents.rejected, (state, action) => {
                // state.loading = false
                // state.error = "error"
            })



    // .addCase(getSchoolAttendance.pending, state => {
    //     state.loading = true
    //     state.error = null
    // })
    // .addCase(getSchoolAttendance.fulfilled, (state, action) => {
    //     state.groupAttendance = action.payload
    //     state.loading = false
    //     state.error = null
    // })
    // .addCase(getSchoolAttendance.rejected, (state, action) => {
    //     state.loading = false
    //     state.error = true
    // })
})

export const {getNextLesson, changeDebtStudent, deleteDebtStudent, onMoveToGroup} = groupProfileSlice.actions
// export default groupProfileSlice.reducer

export const {reducer: groupProfileReducer} = groupProfileSlice