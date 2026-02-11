import {createSlice} from "@reduxjs/toolkit";
import {fetchLocationsThunk} from "features/locations";
import {fetchBranchesByLocationsThunk} from "features/branchSwitcher/model/thunk/branchSwitcherThunk";

const initialState = {

    branches: [],
    branch: {},

    isChanged: true,
    loading: false,
    error: null
}

const branchSwitcherSlice = createSlice({
    name: "branchSwitcherSlice",
    initialState,
    reducers: {
        onChangeBranch: (state, action) => {

            const filteredBranch = state.branches.filter(item => item.id === +action.payload)[0]

            if (filteredBranch) {
                state.branch = filteredBranch
            }


            localStorage.setItem("selectedBranch", action.payload)
        },
        onDeleteBranch: (state) => {
            state.branch = {}
            state.branches = []
            localStorage.removeItem("selectedBranch")
        }
    },
    extraReducers: builder =>
        builder
            .addCase(fetchBranchesByLocationsThunk.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchBranchesByLocationsThunk.fulfilled, (state, action) => {


                state.branches = action.payload
                state.branch = action.payload[0]

                localStorage.setItem("selectedBranch",  state.branch?.id)

                state.loading = false
                state.error = null
            })
            .addCase(fetchBranchesByLocationsThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })
})

export default branchSwitcherSlice.reducer
export const {onChangeBranch, onDeleteBranch} = branchSwitcherSlice.actions
