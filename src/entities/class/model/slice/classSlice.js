import {createSlice} from "@reduxjs/toolkit";
import {
    classItem,
    createClassType,
    createColor,
    fetchClassSubjects,
    getClassNewNumberList,
    getClassTypeNumber,
    getClassTypes,
    getColor, updateClassItem,
    updateClassType,
    updateColor
} from "../thunk/classThunk";

const initialState = {
    loading: false,
    error: false,
    classData: [],
    classTypeNumber: [],
    classItems: [],
    color: [],
    subjects: [],

    classNewItems: []
}

const classSlice = createSlice({
    name: "classSlice",
    initialState,
    reducers: {
        onDelete: (state, action) => {
            state.color = state.color.filter(item => item.id !== action.payload.id)
        },
        onDeleteTypes: (state, action) => {
            state.classData = state.classData.filter(item => item.id !== action.payload.id)
        },
        onChangeClassStatus : (state , action) =>{
            state.classNewItems = state.classNewItems.map(item => {
                if (item.id === action.payload.id){
                    return {
                        ...item,
                        status: !item.status
                    }
                }
                return item
            })
        },

        onUpdateClass: (state , action) => {
            state.classItems = state.classItems.map(item => {
                if (item.id === action.payload.id) {
                    return {
                        ...item,
                        price : action.payload.price,
                        curriculum_hours : action.payload.curriculum_hours,
                        subjects: action.payload.subjects
                    }
                }
                return item
            })
        },


    },
    extraReducers: builder =>
        builder
            .addCase(getClassTypes.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(getClassTypes.fulfilled, (state, action) => {
                state.classData = action.payload
                state.loading = false
                state.error = false
            })
            .addCase(getClassTypes.rejected, state => {
                state.error = true
                state.loading = false
            })

            .addCase(createClassType.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(createClassType.fulfilled, (state, action) => {
                state.classData = [...state.classData, action.payload]
                state.loading = false
                state.error = false
            })
            .addCase(createClassType.rejected, state => {
                state.error = true
                state.loading = false
            })


            .addCase(updateClassType.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(updateClassType.fulfilled, (state, action) => {
                state.classData = [
                    ...state.classData.filter(item => item.id !== action.payload.id),
                    action.payload
                ]
                state.loading = false
                state.error = false
            })
            .addCase(updateClassType.rejected, state => {
                state.error = true
                state.loading = false
            })

            .addCase(getClassTypeNumber.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(getClassTypeNumber.fulfilled, (state, action) => {
                state.classTypeNumber = action.payload
                state.loading = false
                state.error = false
            })
            .addCase(getClassTypeNumber.rejected, state => {
                state.error = true
                state.loading = false
            })

            .addCase(classItem.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(classItem.fulfilled, (state, action) => {
                state.loading = false
                state.error = false
                state.classItems = action.payload


            })
            .addCase(classItem.rejected, state => {
                state.loading = false
                state.error = true
            })


            .addCase(updateClassItem.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(updateClassItem.fulfilled, (state, action) => {
                state.loading = false
                state.error = false

                state.classNewItems = state.classNewItems.map(item => {
                    if (item.id === action.payload.id) {
                        return {
                            ...item,
                            price : action.payload.price,
                            subjects: action.payload.subjects
                        }
                    }
                    return item
                })

            })
            .addCase(updateClassItem.rejected, state => {
                state.loading = false
                state.error = true
            })




            .addCase(createColor.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(createColor.fulfilled, (state, action) => {
                state.loading = false
                state.error = false
                state.color = [...state.color, action.payload]

            })
            .addCase(createColor.rejected, state => {
                state.loading = false
                state.error = true
            })


            .addCase(getColor.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(getColor.fulfilled, (state, action) => {
                state.loading = false
                state.error = false
                state.color = action.payload

            })
            .addCase(getColor.rejected, state => {
                state.loading = false
                state.error = true
            })


            .addCase(updateColor.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(updateColor.fulfilled, (state, action) => {
                state.loading = false
                state.error = false
                state.color = [
                    ...state.color.filter(item => item.id !== action.payload.id),
                    action.payload
                ]

            })
            .addCase(updateColor.rejected, state => {
                state.loading = false
                state.error = true
            })


            .addCase(fetchClassSubjects.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(fetchClassSubjects.fulfilled, (state, action) => {
                state.subjects = action.payload
                state.loading = false
                state.error = false


            })
            .addCase(fetchClassSubjects.rejected, state => {
                state.loading = false
                state.error = true
            })


            .addCase(getClassNewNumberList.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(getClassNewNumberList.fulfilled, (state, action) => {
                state.classNewItems = action.payload
                state.loading = false
                state.error = false


            })
            .addCase(getClassNewNumberList.rejected, state => {
                state.loading = false
                state.error = true
            })
})

export const {onDelete, onDeleteTypes,onChangeClassStatus , onUpdateClass} = classSlice.actions

export default classSlice.reducer