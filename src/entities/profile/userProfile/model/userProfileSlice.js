import {createSlice} from "@reduxjs/toolkit";

import {
    fetchUserProfileData,
    changeUserProfileData,
    changeUserProfileImage
} from "entities/profile/userProfile/model/userProfileThunk";

const initialState = {
    userBranchId: null,
    userData: null,
    userJob: null,
    userPermissions: null,
    salaryData: [],
    salaryInnerData: [],
    loading: false,
    salaryLoading: false,
    error: null
}

const userProfileSlice = createSlice({
    name: "userProfile",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(fetchUserProfileData.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUserProfileData.fulfilled, (state, action) => {

                console.log(action.payload, "action.payload")


                state.userData = action.payload
                state.userBranchId = action.payload?.branch?.id
                state.userJob = action.payload?.job[0]
                localStorage.setItem("job", action.payload?.job[0])

                localStorage.setItem("username",  action.payload.username)

                state.userPermissions = action.payload.permissions
                state.loading = false
                state.error = null
            })
            .addCase(fetchUserProfileData.rejected, (state, action) => {
                state.loading = false
                state.error = "error"
            })

})

export const {
    changeUserProfile,
    changingUserProfile
} = userProfileSlice.actions
export default userProfileSlice.reducer
export const {reducer: userProfileReducer} = userProfileSlice
