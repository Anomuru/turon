

export const getTeacherSalaries = (state) =>
    state.teacherSalarySlice?.salaryData

export const getTeacherSalariesList = (state) =>
    state.teacherSalarySlice?.salaryDatas

export const getTeacherSalaryLoading = (state) =>
    state.teacherSalarySlice.loading