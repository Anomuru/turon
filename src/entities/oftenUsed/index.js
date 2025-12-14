export { default as oftenUsedSlice, oftenUsedReducer } from "./model/oftenUsedSlice";

export {
    fetchClassColorData,
    fetchClassNumberData,
    fetchSubjectsData,
    fetchLanguagesData,
    fetchClassTypeData,
    fetchCategories,
    fetchClassInput,
    fetchBranchesForSelect,
    fetchGroupsForSelect,
    fetchOperatorsData,
    fetchTeachersForSelect,
    fetchVacancyData,
    fetchTeachersData
} from "./model/oftenUsedThunk";

export {
    getSubjectsData,
    getSubjectsLoading,
    getSubjectsError,
    getLanguagesData,
    getLanguagesLoading,
    getLanguagesError,
    getClassColorData,
    getClassColorLoading,
    getClassColorError,
    getClassNumberData,
    getClassNumberLoading,
    getClassNumberError,
    getClassTypeData,
    getClassTypeLoading,
    getClassTypeError,
    getCategories,
    getClassInputData,
    getClassInputLoading,
    getClassInputError,
    getOperatorsData,
    getOperatorsLoading,
    getOperatorsError,
    getVacancyData,
    getVacancyLoading,
    getVacancyError,
    getTeacherData,
    getTeacherLoading,
    getTeacherError,
    getStatusList
} from "./model/oftenUsedSelector";

