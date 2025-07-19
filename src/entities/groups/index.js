
export {GroupsList} from "./groups/ui/groupsList"
export {default as groupsSlice} from "./model/slice/groupsSlice"
export {default as deletedGroupsSlice} from "./model/slice/deletedGroupsSlice"
export {DeletedGroups} from "./deletedGroups/ui/deletedGroups";
export {getGroupsListData, getGroupsLoading,getGroupListWithFilter, getGroupTypes} from "./model/selectors/groupsList"
export {fetchGroupsData, fetchGroupsDataWithFilter, fetchGroupTypeThunk} from "./model/slice/groupsThunk";
export {getDeletedGroupsData} from "./model/selectors/deletedGroups";

export {default as groupAttendance} from "./model/slice/groupsAttendanceSlice"


