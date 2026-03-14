import {createSlice} from "@reduxjs/toolkit";
import {fetchParty, fetchPartyTask} from "pages/partyPage/model/partyThunk.js";


const initialState = {
    data : [],
    tasks: [],
    loading: false,
    error: false,
    dataItem : {},
}

const partySlice = createSlice({
    name:"partySlice",
    initialState,
    reducers: {
        onAddParty: (state, action) => {
            state.data = [...state.data  ,action.payload]

        },
        onAddPartyTask: (state, action) => {
            state.tasks = [...state.tasks  ,action.payload]

        }

    },
    extraReducers: builder =>
        builder
            .addCase(fetchParty.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(fetchParty.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(fetchParty.rejected, (state, action) => {
                state.error = true;
            })

            .addCase(fetchPartyTask.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(fetchPartyTask.fulfilled, (state, action) => {
                state.tasks = action.payload;
                state.loading = false;
            })
            .addCase(fetchPartyTask.rejected, (state, action) => {
                state.error = true;
            })

})

export default partySlice.reducer
export const {onAddParty , onAddPartyTask} = partySlice.actions