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
    async ({branchId, seatFromId, seatUntilId, boardCond}) => {
        const {request} = useHttp();
        return await request(
            `${API_URL}Rooms/rooms/?deleted=False&branch=${branchId}${boardCond ? `&electronic_board=${boardCond}` : ""}${(seatFromId && seatUntilId) ? `&seats_number=${seatFromId}-${seatUntilId}` : ""}`,
            "GET", null, headers()
        )
    }
)