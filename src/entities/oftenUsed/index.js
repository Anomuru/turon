export {default as oftenUsedSlice} from "./model/oftenUsedSlice";

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
    fetchTeachersForSelect
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
    getOperatorsError
} from "./model/oftenUsedSelector";

