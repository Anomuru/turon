

export const getVacancyJobs = (state) =>
    state.vacancyPageParseSlice?.vacanciesData

export const getVacancyLoading = (state) =>
    state.vacancyPageParseSlice?.loading