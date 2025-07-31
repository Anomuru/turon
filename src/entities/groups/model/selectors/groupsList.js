
export const getGroupsListData = (state) =>
    state.groupsSlice?.data;

export const getGroupsLoading = (state) =>
    state.groupsSlice?.loading

export const getGroupListWithFilter = (state) =>
    state.groupsSlice?.dataWithFilter
export const getGroupListWithFilterLoading = (state) =>
    state.groupsSlice?.loadingClasses
export const getGroupTypes = (state) =>
    state.groupsSlice?.typeData
