

export const getVacancyJobs = (state) =>
    state.vacancyPageParseSlice.vacanciesData

export const getVacancySystems = (state) =>
    state.vacancyPageParseSlice.vacanciesSystems

export const getVacancyLoading = (state) =>
    state.vacancyPageParseSlice?.loading