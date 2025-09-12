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
    getGroupDebtStudents,
    getSchoolAttendance,
    getSchoolAttendanceAll,
    getSchoolAttendanceList,
    getSchoolAttendanceForDay
} from "./groupProfileThunk";

const initialState = {
    data: null,
    groupAttendance: [],
    // groupAttendanceDate: {
    //     date: null,
    //     lastYear: null,
    //     lastMonth: null,
    //     lastDay: null
    // },
    groupAttendanceDateAll: [],
    groupAttendanceDate: [],
    groupAttendanceDateLoading: false,
    attendanceListForDay: [],
    attendanceAllForDay: {},
    attendanceList: {},
    attendanceListLoading: false,
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
    error: null,
    loadingStudent: false
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
        },
        createAttendance: (state, action) => {
            const dayNumber = new Date(action.payload.date).getDate().toString();

            state.attendanceList = {
                days: state.attendanceList.days,
                students: state.attendanceList.students.map((s) => {
                    const studentAttendance = action.payload.attendance.find(
                        (a) => a.student_id === s.student.id
                    );

                    if (studentAttendance) {
                        return {
                            ...s,
                            days: {
                                ...s.days,
                                [dayNumber]: {
                                    id: studentAttendance.student_id,
                                    status: studentAttendance.status,
                                    reason: studentAttendance.reason ?? null,
                                },
                            },
                        };
                    }

                    return s;
                }),
            };
        },
        deleteAttendance: (state, action) => {
            state.attendanceList = {
                days: state.attendanceList.days,
                students: state.attendanceList.students.map((s) => {
                    let updatedDays = {};

                    for (const [day, value] of Object.entries(s.days)) {
                        if (value.id === action.payload.id) {
                            updatedDays[day] = { id: null, status: null };
                        } else {
                            updatedDays[day] = value;
                        }
                    }

                    return {
                        ...s,
                        days: updatedDays
                    };
                })
            };
        }
    },
    extraReducers: builder =>
        builder
            .addCase(fetchGroupProfile.pending, state => {
                state.loadingStudent = true
                state.error = null
            })
            .addCase(fetchGroupProfile.fulfilled, (state, action) => {
                state.data = action.payload
                state.loadingStudent = false
                state.error = null
            })
            .addCase(fetchGroupProfile.rejected, (state, action) => {
                state.loadingStudent = false
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
                state.loadingStudent = true
                state.error = "error"
            })
            .addCase(filteredStudents.fulfilled, (state, action) => {
                state.filteredStudents = action.payload.students
                // state.error = action.payload.errors
                state.loadingStudent = false
            })
            .addCase(filteredStudents.rejected, (state, action) => {
                state.loadingStudent = false
                state.error = "error"
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
                state.weekDays = action.payload?.days?.map(item => ({...item, name: item.name_uz}))
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



    .addCase(getSchoolAttendance.pending, state => {
        state.groupAttendanceDateLoading = true
        state.error = null
    })
    .addCase(getSchoolAttendance.fulfilled, (state, action) => {
        state.groupAttendanceDate = action.payload?.periods
        // state.groupAttendanceDate.date = action.payload?.periods
        // const lastYear = action.payload?.periods[action.payload?.periods?.length - 1]?.year
        // const yearMonths = action.payload?.periods.filter(item => item.year === lastYear)[0]?.months
        // const lastMonth = yearMonths[yearMonths?.length - 1]
        // state.groupAttendanceDate.lastYear = lastYear
        // state.groupAttendanceDate.lastMonth = lastMonth?.month
        // state.groupAttendanceDate.lastDay = lastMonth?.days[lastMonth?.days?.length - 1]
        state.groupAttendanceDateLoading = false
        state.error = null
    })
    .addCase(getSchoolAttendance.rejected, (state, action) => {
        state.groupAttendanceDateLoading = false
        state.error = true
    })

    .addCase(getSchoolAttendanceAll.pending, state => {
        state.loading = true
        state.error = null
    })
    .addCase(getSchoolAttendanceAll.fulfilled, (state, action) => {
        state.groupAttendanceDateAll = action.payload?.periods
        state.loading = false
        state.error = null
    })
    .addCase(getSchoolAttendanceAll.rejected, (state, action) => {
        state.loading = false
        state.error = true
    })


    .addCase(getSchoolAttendanceList.pending, state => {
        state.attendanceListLoading = true
        state.error = null
    })
    .addCase(getSchoolAttendanceList.fulfilled, (state, action) => {
        state.attendanceList = action.payload
        state.attendanceListLoading = false
        state.error = null
    })
    .addCase(getSchoolAttendanceList.rejected, (state, action) => {
        state.attendanceListLoading = false
        state.error = true
    })

    .addCase(getSchoolAttendanceForDay.pending, state => {
        state.loading = true
        state.error = null
    })
    .addCase(getSchoolAttendanceForDay.fulfilled, (state, action) => {
        state.attendanceListForDay = action.payload?.groups
        state.attendanceAllForDay = action.payload?.overall_summary
        state.loading = false
        state.error = null
    })
    .addCase(getSchoolAttendanceForDay.rejected, (state, action) => {
        state.loading = false
        state.error = true
    })
})

export const {
    getNextLesson,
    changeDebtStudent,
    deleteDebtStudent,
    onMoveToGroup,
    createAttendance,
    deleteAttendance
} = groupProfileSlice.actions
// export default groupProfileSlice.reducer

export const {reducer: groupProfileReducer} = groupProfileSlice