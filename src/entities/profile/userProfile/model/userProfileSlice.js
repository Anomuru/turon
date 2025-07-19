import {createSlice} from "@reduxjs/toolkit";

import {
    fetchUserProfileData,
    changeUserProfileData,
    changeUserProfileImage
} from "entities/profile/userProfile/model/userProfileThunk";

const initialState = {
    userBranchId: null,
    userSystemId: null,
    userData: null,
    userJob: null,
    userPermissions: null,
    salaryData: [
        {
            id: 1,
            salary: 10000000000,
            theRest: 1000,
            received: 2000,
            month: "may"
        },
        {
            id: 1,
            salary: 3000,
            theRest: 1000,
            received: 2000,
            month: "june"
        },
        {
            id: 1,
            salary: 3000,
            theRest: 1000,
            received: 2000,
            month: "july"
        },
        {
            id: 1,
            salary: 3000,
            theRest: 1000,
            received: 2000,
            month: "aug"
        },
        {
            id: 1,
            salary: 3000,
            theRest: 1000,
            received: 2000,
            month: "september"
        },
        {
            id: 1,
            salary: 3000,
            theRest: 1000,
            received: 2000,
            month: "may"
        },
        {
            id: 1,
            salary: 3000,
            theRest: 1000,
            received: 2000,
            month: "june"
        },
        {
            id: 1,
            salary: 3000,
            theRest: 1000,
            received: 2000,
            month: "july"
        },
        {
            id: 1,
            salary: 3000,
            theRest: 1000,
            received: 2000,
            month: "aug"
        },
        {
            id: 1,
            salary: 3000,
            theRest: 1000,
            received: 2000,
            month: "september"
        },
        {
            id: 1,
            salary: 3000,
            theRest: 1000,
            received: 2000,
            month: "may"
        },
        {
            id: 1,
            salary: 3000,
            theRest: 1000,
            received: 2000,
            month: "june"
        },
        {
            id: 1,
            salary: 3000,
            theRest: 1000,
            received: 2000,
            month: "july"
        },
        {
            id: 1,
            salary: 3000,
            theRest: 1000,
            received: 2000,
            month: "aug"
        },
        {
            id: 1,
            salary: 3000,
            theRest: 1000,
            received: 2000,
            month: "september"
        }
    ],
    salaryInnerData: [
        {
            salary: 390.000,
            salaryType: "Click",
            date: "2024.01.11"
        },
        {
            salary: 390.000,
            salaryType: "Click",
            date: "2024.01.11"
        },
        {
            salary: 390.000,
            salaryType: "Click",
            date: "2024.01.11"
        },
        {
            salary: 390.000,
            salaryType: "Click",
            date: "2024.01.11"
        },
        {
            salary: 390.000,
            salaryType: "Click",
            date: "2024.01.11"
        }, {
            salary: 390.000,
            salaryType: "Click",
            date: "2024.01.11"
        },
        {
            salary: 390.000,
            salaryType: "Click",
            date: "2024.01.11"
        },
        {
            salary: 390.000,
            salaryType: "Click",
            date: "2024.01.11"
        },
        {
            salary: 390.000,
            salaryType: "Click",
            date: "2024.01.11"
        },
        {
            salary: 390.000,
            salaryType: "Click",
            date: "2024.01.11"
        },
        {
            salary: 390.000,
            salaryType: "Click",
            date: "2024.01.11"
        },
        {
            salary: 390.000,
            salaryType: "Click",
            date: "2024.01.11"
        },
        {
            salary: 390.000,
            salaryType: "Click",
            date: "2024.01.11"
        },
        {
            salary: 390.000,
            salaryType: "Click",
            date: "2024.01.11"
        },
        {
            salary: 390.000,
            salaryType: "Click",
            date: "2024.01.11"
        }

    ],
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



                state.userData = action.payload
                state.userBranchId = action.payload?.branch?.id
                state.userJob = action.payload?.job[0]
                localStorage.setItem("job", action.payload?.job[0])

                localStorage.setItem("username",  action.payload.username)

                // state.userSystemId = action.payload.user.branch.location.system.id
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
