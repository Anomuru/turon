


export const getLocations = (state) => state.locationsSlice.locations || []
export const getSelectedLocations = (state) => state.locationsSlice.selectedLocations
export const getSelectedLocationsByIds = (state) => state.locationsSlice.selectedLocations.map(item => item?.id)
export const getLocationLoading = (state) => state.locationsSlice.loading