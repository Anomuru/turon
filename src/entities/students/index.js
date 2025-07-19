export {Students} from "./ui/studyingStudents/studnets"
export {DeletedStudents} from "./ui/deletedStudents/deletedStudents"
export {NewStudents} from "./ui/newStudents/newStudents"
export {StudentsHeader} from "./ui/studentsHeader/studentsHeader"
export {GroupCreatePage} from "../../pages/groupsPage/ui/groupCreatePage/groupCreatePage"

export {
    default as newStudents,
    getFilteredStudentsData,
    getFilteredStudentsStatus,
} from "./model/studentsSlice"

export {fetchNewStudentsData,
    fetchClassNumberList,
    fetchClassColors
} from "./model/studentsThunk"
export {
    fetchOnlyStudyingStudentsData,
    fetchOnlyNewStudentsData,
    fetchOnlyDeletedStudentsData,
    createSchoolClass,
    fetchDeletedNewStudentsThunk
} from "./model/studentsThunk"
export {
    getNewStudentsData,
    getStudyingStudents,
    getCurseLevelData,
    getCurseTypesData,
    getFilteredTeachers,
    getFilteredStudents,
    getFilteredStatus,
    getSchoolClassColors,
    getFilteredErrors,
    getNewStudentsLoading,
    getSchoolClassNumbers,
    getOnlyDeletedStudents

} from "./model/selector/studentsSelector"

