export { default as educationQualityReducer } from './model/slice/educationQualitySlice';
export {
    setSelectedTerm,
    setSelectedSubject,
    setSelectedClass,
    setSelectedTeacher,
    clearFilters,
    resetState,
} from './model/slice/educationQualitySlice';

export {
    fetchEducationQualityOverview,
    fetchEducationQualityStatistics,
    fetchTermsList,
} from './model/thunk/educationQualityThunk';

export {
    selectEducationQualityLoading,
    selectEducationQualityError,
    selectEducationQualityOverview,
    selectEducationQualityStatistics,
    selectEducationQualityTermInfo,
    selectEducationQualityChartData,
    selectEducationQualityTerms,
    selectEducationQualitySubjects,
    selectEducationQualityClasses,
    selectEducationQualityTeachers,
    selectEducationQualitySelectedTerm,
    selectEducationQualitySelectedSubject,
    selectEducationQualitySelectedClass,
    selectEducationQualitySelectedTeacher,
} from './model/selector/educationQualitySelector';
