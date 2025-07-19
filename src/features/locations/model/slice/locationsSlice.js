import {createSlice} from "@reduxjs/toolkit";
import {fetchLocationsThunk} from "features/locations/model/thunk/locationsThunk";

const initialState = {
    locations: [],
    systemId: null,
    selectedLocations: [],
    loading: false,
    fetchStatus: "idle",
    error: null
}

const locationsSlice = createSlice({
    name: "ChangeLocationSlice",
    initialState,
    reducers: {
        addSelectedLocations: (state,action) => {
            const filteredLocation = state.locations.filter(item => item?.id === +action.payload)[0]
            localStorage.setItem("selectedLocations", JSON.stringify([...state.selectedLocations,filteredLocation]))
            state.selectedLocations = [...state.selectedLocations,filteredLocation]

            state.locations = state.locations.map(item => {
                if (item.id === +action.payload) {
                    return {
                        ...item,
                        disabled: true
                    }

                }
                return item

            })
            console.log(state.locations, "ededed")


        },

        deleteSelectedLocations: (state,action) => {
            localStorage.setItem("selectedLocations", JSON.stringify(state.selectedLocations.filter(item => item.id !== +action.payload)))
            state.selectedLocations = state.selectedLocations.filter(item => item.id !== +action.payload)
            state.locations = state.locations.map(item => {
                if (item.id === +action.payload) {
                    return {
                        ...item,
                        disabled: false
                    }
                }

                return item
            })

        },


        clearSelectedLocations: (state,action) => {
            state.selectedLocations = []
            if (state.systemId && action.payload !== state.systemId) {
                localStorage.removeItem("selectedLocations")
            }


        }
    },
    extraReducers: builder =>
        builder
            .addCase(fetchLocationsThunk.pending, state => {
                state.loading = true
                state.error = null
                state.fetchStatus = "pending"
            })
            .addCase(fetchLocationsThunk.fulfilled, (state, action) => {


                state.systemId = action.payload.systemId

                const localstorageLocs = JSON.parse(localStorage.getItem("selectedLocations"))


                if (localstorageLocs && localstorageLocs.length > 0) {
                    state.selectedLocations = localstorageLocs
                    state.locations = action.payload.list.map(item => {

                        const isHave = localstorageLocs.some(loc => loc?.id === item.id)

                        if (isHave) {
                            return {
                                ...item,
                                disabled: true
                            }
                        }
                        return item
                    })
                } else {

                    localStorage.setItem("selectedLocations", JSON.stringify( [action.payload.list[0]]))
                    state.selectedLocations = [action.payload.list[0]]
                    state.locations = action.payload.list.map((item,index) => {
                        if (index === 0) {
                            return {
                                ...item,
                                disabled: true
                            }
                        }
                        return item
                    })
                }

                state.loading = false
                state.error = null
                state.fetchStatus = "success"
            })
            .addCase(fetchLocationsThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
                state.fetchStatus = "error"

            })


})

export default locationsSlice.reducer
export const {deleteSelectedLocations,addSelectedLocations,clearSelectedLocations} = locationsSlice.actions
