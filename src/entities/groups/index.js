
export {GroupsList} from "./groups/ui/groupsList"


export {DeletedGroups} from "./deletedGroups/ui/deletedGroups";
export {getGroupsListData, getGroupsLoading,getGroupListWithFilter, getGroupTypes} from "./model/selectors/groupsList"
export { fetchGroupsDataWithFilter, fetchGroupTypeThunk} from "./model/slice/groupsThunk";
export {getDeletedGroupsData} from "./model/selectors/deletedGroups";




