import { createSlice } from "@reduxjs/toolkit";
import { fetchLocationsThunk } from "features/locations/model/thunk/locationsThunk";

const initialState = {
    locations: [],
    selectedLocations: {},
    loading: false,
    fetchStatus: "idle",
    error: null,
};

const locationsSlice = createSlice({
    name: "ChangeLocationSlice",
    initialState,
    reducers: {
        addSelectedLocations: (state, action) => {
            const filteredLocation = state.locations.find(
                (item) => item?.id === +action.payload
            );

            if (!filteredLocation) return;

            const userRole = localStorage.getItem("job");
            const storageKey = `selectedLocation_${userRole}`;


            if (userRole === "director") {
                localStorage.setItem(storageKey, JSON.stringify(filteredLocation));
            }


            state.selectedLocations = filteredLocation;

            state.locations = state.locations.map((item) =>
                item.id === +action.payload
                    ? { ...item, disabled: true }
                    : { ...item, disabled: false }
            );
        },

        clearSelectedLocations: (state) => {
            state.selectedLocations = {};
        },
    },

    extraReducers: (builder) =>
        builder
            .addCase(fetchLocationsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.fetchStatus = "pending";
            })
            .addCase(fetchLocationsThunk.fulfilled, (state, action) => {
                const userRole = localStorage.getItem("job");
                const storageKey = `selectedLocation_${userRole}`;
                const savedLocation = JSON.parse(localStorage.getItem(storageKey));

                if (savedLocation) {
                    state.selectedLocations = savedLocation;
                    state.locations = action.payload.list.map((item) =>
                        item.id === savedLocation.id
                            ? { ...item, disabled: true }
                            : { ...item, disabled: false }
                    );
                } else {
                    const first = action.payload.list[0];
                    state.selectedLocations = first;


                    if (userRole === "director") {
                        localStorage.setItem(storageKey, JSON.stringify(first));
                    }

                    state.locations = action.payload.list.map((item, i) =>
                        i === 0 ? { ...item, disabled: true } : item
                    );
                }

                state.loading = false;
                state.error = null;
                state.fetchStatus = "success";
            })
            .addCase(fetchLocationsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
                state.fetchStatus = "error";
            }),
});

export const { reducer: locationsReducer } = locationsSlice;
export const { addSelectedLocations, clearSelectedLocations } = locationsSlice.actions;
