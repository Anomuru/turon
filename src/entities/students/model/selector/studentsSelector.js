

export const getFilteredLoading = (state) =>
    state.newStudents.filteredByClass

export const getFilteredClassStudents = (state) =>
    state.newStudents.filteredByClassStudents


export const getLoadingNewStudents = (state) =>
    state.newStudents?.newStudentsStatus

export const getLoadingStudyingStudents = (state) =>
    state.newStudents?.studyingStudentsStatus

export const getLoadingDeletedStudents = (state) =>
    state.newStudents?.loading

export const getNewStudentsData = (state) =>
    state.newStudents?.newStudentes

export const getNewStudentsLoading = (state) =>
    state.newStudents.newStudentsStatus

export const getStudyingStudents = (state) =>
    state.newStudents.studyingStudents

export const getFilteredStudents = (state) =>
    state.newStudents?.filteredStudents

export const getFilteredTeachers = (state) =>
    state.newStudents?.filteredTeachers

export const getFilteredErrors = (state) =>
    state.newStudents?.filteredErrors

export const getFilteredStatus = (state) =>
    state.newStudents?.newStudentsStatus

export const getCurseTypesData = (state) =>
    state.newStudents?.filteredCurseTypes

export const getCurseLevelData = (state) =>
    state.newStudents?.filteredCurseLevel

export const getSchoolClassNumbers = (state) =>
    state.newStudents?.schoolClassNumbers

export const getSchoolClassColors = (state) =>
    state.newStudents?.schoolClassColors

export const getSchoolStudents = (state) =>
    state.newStudents?.schoolStudents

export const getOnlyDeletedStudents = (state) =>
    state.newStudents?.deletedStudents
