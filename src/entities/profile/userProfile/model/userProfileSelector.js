
export const getUserSalaryData = (state) =>
    state.userProfileSlice.salaryData

export const getUserSalaryInnerData = (state) =>
    state.userProfileSlice.salaryInnerData

export const getUserProfileData = (state) =>
    state.userProfileSlice.userData

export const getUserProfileLoading = (state) =>
    state.userProfileSlice.loading

export const getUserBranchId = (state) =>
    state.userProfileSlice.userBranchId

export const getUserSystemId = (state) =>
    state.userProfileSlice.userSystemId


export const getUserPermission = (state) =>
    state.userProfileSlice.userPermissions

export const getUserJob = (state) =>
    state.userProfileSlice.userJob
