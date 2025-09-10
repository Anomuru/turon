import {createSlice} from "@reduxjs/toolkit";
import {fetchTerm, fetchTermData} from "features/groupProfile/model/makeQuarter/groupQuarterThunk.js";

const initialState = {
    data: [
        {
            title: "11-sinf",
            children: [
                {
                    title: "Ingliz",
                    tableData: [
                        { id: 1, name: "Grammar" },
                        { id: 2, name: "Vocabulary" },
                    ],
                },
                {
                    title: "Matematika",
                    tableData: [
                        { id: 1, name: "Algebra" },
                        { id: 2, name: "Geometriya" },
                        { id: 2, name: "Geometriya" },
                        { id: 2, name: "Geometriya" },
                        { id: 2, name: "Geometriya" },
                    ],
                },
            ],
        },
        {
            title: "10-sinf",
            children: [
                {
                    title: "Kimyo",
                    tableData: [
                        { id: 1, name: "Organik" },
                        { id: 2, name: "Noorganik" },
                    ],
                },
            ],
        },
    ],
    loadingData: false,
    error: null,
    term: [],
}

const groupQuarterSlice = createSlice({
    name: "groupQuarterSlice",
    initialState,
    reducers: {
        addTest: (state, action) => {
            const {path, test} = action.payload;

            let current = state.data;

            for (let i = 0; i < path.length; i++) {
                const {id, type} = path[i];
                const found = current.find(item => item.id === id && item.type === type);

                if (!found) return;

                if (i === path.length - 1) {
                    if (!found.tableData) {
                        found.tableData = [];
                    }
                    // res kelgan testni qo‘shamiz
                    found.tableData.push(test);
                } else {
                    current = found.children ?? [];
                }
            }
        },
        deleteTest: (state, action) => {
            const {path, testId} = action.payload;

            let current = state.data;

            for (let i = 0; i < path.length; i++) {
                const {id, type} = path[i];
                const found = current.find(item => item.id === id && item.type === type);

                if (!found) return;

                if (i === path.length - 1) {

                    if (found.tableData) {
                        found.tableData = found.tableData.filter(test => test.id !== testId);
                    }
                } else {
                    current = found.children ?? [];
                }
            }
        },
        updateTest: (state, action) => {
            const {path, test} = action.payload;
            let node = state.data;

            path.forEach((p, idx) => {
                const found = node.find((item) => item.id === p.id && item.type === p.type);
                if (found) {
                    if (idx === path.length - 1) {
                        if (found.tableData) {
                            const index = found.tableData.findIndex((t) => t.id === test.id);
                            if (index !== -1) {
                                found.tableData[index] = test;
                            }
                        }
                    } else {
                        node = found.children || [];
                    }
                }
            });
        },
    },
    extraReducers: builder => builder
        .addCase(fetchTerm.pending , state => {
            state.loadingData = true
            state.error = null
        })
        .addCase(fetchTerm.fulfilled, (state, action) => {
            state.term = action.payload
            state.loadingData = false
            state.error = null
        })
        .addCase(fetchTerm.rejected, (state, action) => {
            state.loadingData = false
            state.error = action.payload ?? null
        })
        .addCase(fetchTermData.pending , state => {
            state.loadingData = true
            state.error = null
        })
        .addCase(fetchTermData.fulfilled, (state, action) => {
            state.data = action.payload
            state.loadingData = false
            state.error = null
        })
        .addCase(fetchTermData.rejected, (state, action) => {
            state.loadingData = false
            state.error = action.payload ?? null
        })
})

export const {addTest , deleteTest , updateTest} = groupQuarterSlice.actions;
export const {reducer: groupQuarterReducer} = groupQuarterSlice