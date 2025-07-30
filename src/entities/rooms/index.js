export {default as roomsSlice, roomsReducer} from './model/roomsSlice'
export * from './model/constants/constants';
export * from './ui/roomList/roomList';
export {getRoomsData, getRoomsLoading} from "./model/selectors/roomsSelectors"
export {fetchRoomsData} from "./model/roomsThunk"

