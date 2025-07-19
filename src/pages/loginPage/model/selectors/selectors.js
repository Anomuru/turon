

export const getUserRole = (state) =>
    state.loginSlice?.role

export const getUsername = (state) =>
    state.loginSlice.username

export const getUserRefreshLoading = (state) =>
    state.loginSlice.loading

export const getUserFetchError = (state) =>
    state.loginSlice.error

export const getUserId = (state) =>
    state.loginSlice.userId
