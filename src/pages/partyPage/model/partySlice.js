import {createSlice} from "@reduxjs/toolkit";
import {
    fetchParty,
    fetchPartyCompetitions,
    fetchPartyReyting,
    fetchPartyTask
} from "pages/partyPage/model/partyThunk.js";


const initialState = {
    data: [],
    tasks: [],
    loading: false,
    error: false,
    dataItem: {},
    competitions: [],
    reyting: [],

}

const partySlice = createSlice({
    name: "partySlice",
    initialState,
    reducers: {
        onAddParty: (state, action) => {
            state.data = [...state.data, action.payload]

        },
        onAddPartyTask: (state, action) => {
            state.tasks = [...state.tasks, action.payload]

        },
        onAddCompetitions: (state, action) => {
            state.competitions = [...state.competitions, action.payload]

        },
        onAddCompetitionResult: (state, action) => {
            const { compId, result } = action.payload;

            state.competitions = state.competitions.map(c => {
                if (c.id === compId) {
                    return {
                        ...c,
                        results: [...(c.results || []), result]
                    };
                }
                return c;
            });
        },

        // 🔥 RESULT UPDATE
        onUpdateCompetitionResult: (state, action) => {
            const { compId, resultId, data } = action.payload;

            state.competitions = state.competitions.map(c => {
                if (c.id === compId) {
                    return {
                        ...c,
                        results: c.results.map(r =>
                            r.id === resultId
                                ? { ...r, ...data }
                                : r
                        )
                    };
                }
                return c;
            });
        },

        // 🔥 RESULT DELETE
        onDeleteCompetitionResult: (state, action) => {
            const { compId, resultId } = action.payload;

            state.competitions = state.competitions.map(c => {
                if (String(c.id) === String(compId)) {
                    return {
                        ...c,
                        results: (c.results || []).filter(
                            r => String(r.id) !== String(resultId)
                        )
                    };
                }
                return c;
            });
        }
    },
    extraReducers: builder =>
        builder
            .addCase(fetchParty.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(fetchParty.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(fetchParty.rejected, (state, action) => {
                state.error = true;
            })

            .addCase(fetchPartyTask.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(fetchPartyTask.fulfilled, (state, action) => {
                state.tasks = action.payload;
                state.loading = false;
            })
            .addCase(fetchPartyTask.rejected, (state, action) => {
                state.error = true;
            })
            .addCase(fetchPartyCompetitions.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(fetchPartyCompetitions.fulfilled, (state, action) => {
                state.competitions = action.payload;
                state.loading = false;
            })
            .addCase(fetchPartyCompetitions.rejected, (state, action) => {
                state.error = true;
            })
            .addCase(fetchPartyReyting.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(fetchPartyReyting.fulfilled, (state, action) => {
                state.reyting = action.payload;
                state.loading = false;
            })
            .addCase(fetchPartyReyting.rejected, (state, action) => {
                state.error = true;
            })

})

export default partySlice.reducer
export const {onAddParty, onAddPartyTask, onAddCompetitions , onAddCompetitionResult , onDeleteCompetitionResult , onUpdateCompetitionResult} = partySlice.actions