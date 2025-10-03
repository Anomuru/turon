import {createSlice} from "@reduxjs/toolkit";
import {fetchLocationsThunk} from "features/locations/model/thunk/locationsThunk";

const initialState = {
    locations: [],
    selectedLocations: {},
    loading: false,
    fetchStatus: "idle",
    error: null
}

const locationsSlice = createSlice({
    name: "ChangeLocationSlice",
    initialState,
    reducers: {
        addSelectedLocations: (state, action) => {
            const filteredLocation = state.locations.find(item => item?.id === +action.payload)

            if (!filteredLocation) return;

            localStorage.setItem("selectedLocation", JSON.stringify(filteredLocation));
            state.selectedLocations = filteredLocation

            state.locations = state.locations.map(item => {
                if (item.id === +action.payload) {
                    return { ...item, disabled: true }
                }
                return { ...item, disabled: false }
            })
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
                const savedLocation = JSON.parse(localStorage.getItem("selectedLocation"));

                if (savedLocation) {
                    state.selectedLocations = savedLocation;
                    state.locations = action.payload.list.map(item =>
                        item.id === savedLocation.id
                            ? { ...item, disabled: true }
                            : { ...item, disabled: false }
                    );
                } else {
                    // Agar localStorage bo‘sh bo‘lsa — birinchi branch default
                    const first = action.payload.list[0];
                    state.selectedLocations = first;
                    localStorage.setItem("selectedLocation", JSON.stringify(first));
                    state.locations = action.payload.list.map((item, i) =>
                        i === 0 ? { ...item, disabled: true } : item
                    );
                }

                state.loading = false;
                state.error = null;
                state.fetchStatus = "success";
            })
            .addCase(fetchLocationsThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
                state.fetchStatus = "error"

            })


})

export const {reducer: locationsReducer} = locationsSlice
export const {deleteSelectedLocations,addSelectedLocations,clearSelectedLocations} = locationsSlice.actions
