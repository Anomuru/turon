
export const getGroupsListData = (state) =>
    state.groupsSlice?.data;
export const getGroupsListCount = (state) =>
    state.groupsSlice?.totalCount;

export const getGroupsLoading = (state) =>
    state.groupsSlice?.loading

export const getGroupListWithFilter = (state) =>
    state.groupsSlice?.data
export const getGroupListWithFilterLoading = (state) =>
    state.groupsSlice?.loadingClasses
export const getGroupTypes = (state) =>
    state.groupsSlice?.typeData
