
export const getTeacherId = (state) =>
    state.teacherParseSlice?.teacherId
export const getLoading = (state) =>
    state.teacherParseSlice?.fetchTeacherStatus

export const getTeacherStudent = (state) =>
    state.teacherParseSlice?.students

export const getStudentLoading = (state) =>
    state.teacherParseSlice?.studentsLoading

