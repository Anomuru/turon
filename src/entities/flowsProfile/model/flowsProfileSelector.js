
export const getFlowsProfileData = (state) =>
    state.flowsProfileSlice.data

export const getFlowsProfileNextLs = (state) =>
    state.flowsProfileSlice.nextLessonData

export const getFlowsProfileFilteredStudents = (state) =>
    state.flowsProfileSlice.filteredStudents

export const getFlowsProfileFilteredTeachers = (state) =>
    state.flowsProfileSlice.filteredTeachers

export const getFlowsProfileStatus = (state) =>
    state.flowsProfileSlice.loading



