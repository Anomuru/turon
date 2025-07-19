import {createSlice} from "@reduxjs/toolkit";
import {fetchThemeSwitcherSystemsThunk} from "../thunk/themeSwitcherThunk";

const initialState = {
    systems: [
        {
            id: 1,
            name: "Education center",
            number: 2147483647,
            type: "center"
        },
        {
            id: 2,
            name: "School",
            number: 2147483647,
            type: "school"

        }
    ],

    system: {},
    selectedLocations: [],
    inited: false,
    loading: false,
    error: null
}

const themeSwitcherSlice = createSlice({
    name: "themeSwitcherSlice",
    initialState,
    reducers: {

        onChangeSystem: (state,action) => {

            const filtered = state.systems.filter(item => item.name === action.payload)[0]

            localStorage.setItem("selectedSystem", JSON.stringify(filtered))
            state.system =  {
                id: filtered.id,
                name: action.payload
            }


        },


        clearSystems: (state) => {
            state.inited = false
        }
    },
    extraReducers: builder =>
        builder
            .addCase(fetchThemeSwitcherSystemsThunk.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchThemeSwitcherSystemsThunk.fulfilled, (state, action) => {
                state.systems = action.payload
                state.inited = true

                const localSystem = JSON.parse(localStorage.getItem("selectedSystem")) // changed


                if (!localSystem && !localSystem?.name ) {



                    state.system = {
                        id: action.payload[0]?.id,
                        name: action.payload[0]?.name
                    }

                    localStorage.setItem("selectedSystem", JSON.stringify({
                        id: action.payload[0]?.id,
                        name: action.payload[0]?.name
                    }))
                } else {

                    if (action.payload.some(item => item.id === +localSystem.id)) {
                        state.system = {
                            id: localSystem.id,
                            name: localSystem.name
                        }
                    } else {
                        state.system = {
                            id: action.payload[0]?.id,
                            name: action.payload[0]?.name
                        }

                        localStorage.setItem("selectedSystem", JSON.stringify({
                            id: action.payload[0]?.id,
                            name: action.payload[0]?.name
                        }))
                    }
                }



                state.loading = false
                state.error = null
            })
            .addCase(fetchThemeSwitcherSystemsThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })


})

export default themeSwitcherSlice.reducer
export const {onChangeSystem,clearSystems} = themeSwitcherSlice.actions
