export const getTeacherSalaryData = (state) =>
    state.teacher?.teacherSalary
export const getTeacherSalaryCount = (state) =>
    state.teacher?.teacherSalaryCount

export const getDeletedTeachersSalaryData = (state) =>
    state.teacher?.deletedSalary
export const getDeletedTeachersSalaryCount = (state) =>
    state.teacher?.deletedSalaryCount
export const getTeachersLoading = (state) =>
    state.teacher?.loading