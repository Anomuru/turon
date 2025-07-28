import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";

// export const fetchFilteredRooms = createAsyncThunk(
//     "filterRooms/fetchFilteredRooms",
//     async (filterObj) => {
//         const {request} = useHttp()
//         return await request(
//             `${API_URL}`,
//             "POST",
//             JSON.stringify(filterObj),
//             headers()
//         )
//     }
// )


export const fetchFilteredRooms = createAsyncThunk(
    "filterRooms/fetchFilteredRooms",
    async ({teacherId, seatFromId, seatUntilId, boardCond}) => {
        const {request} = useHttp();
        return await  request(`${API_URL}Rooms/rooms/?seats_number=${seatFromId}-${seatUntilId}&deleted=False&electronic_board=${boardCond}`, "GET", null, headers())
    }
)