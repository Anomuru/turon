

export const getTeachers = (state) =>
    state.teachersSlice?.teachersData



export const getDeletedTeacher = (state) =>
    state.teachersSlice?.deletedTeachers
export const getTeacherLoading = (state) =>
    state.teachersSlice?.loading

export const getTeachersWithFilter = (state) =>
    state.teachersSlice?.teachersDataWithFilter