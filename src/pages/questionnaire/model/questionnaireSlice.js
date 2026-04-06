import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base.js";


const initialState = {
    questions: [],
    questionsID: [],
    loading: false,
    error: false,
}

export const fetchPoll = createAsyncThunk(
    "questionnaire/fetchPoll",
    async () => {
        const {request} = useHttp()
        return await request(`${API_URL}surveys/admin/surveys/` , "GET" , null , headers())
    }
)
export const fetchPollId = createAsyncThunk(
    "questionnaire/fetchPollId",
    async (id) => {
        const {request} = useHttp()
        return await request(`${API_URL}surveys/admin/surveys/${id}/` , "GET" , null , headers())
    }
)
const questionnaireSlice = createSlice({
    name: "questionnaire",
    initialState,
    reducers: {
        onQuestionnaireAdd: (state, action) => {
            state.questions = [...state.questions, action.payload];
        },
        onQuestionnaireDelete: (state, action) => {
            state.questions = state.questions.filter(questionnaire => questionnaire.id !== action.payload);
        },
        onQuestionnaireProfile: (state, action) => {
            state.questionsID = action.payload;
        }
    },
    extraReducers: builder =>
        builder
            .addCase(fetchPoll.pending , (state, action) => {
                state.loading = true;
            })
            .addCase(fetchPoll.fulfilled , (state, action) => {
                state.loading = false;
                state.error = false;
                state.questions = action.payload
            })
            .addCase(fetchPoll.rejected , (state, action) => {
                state.loading = false;
                state.error = true;
            })

            // .addCase(fetchPollId.pending , (state, action) => {
            //     state.loading = true;
            // })
            // .addCase(fetchPollId.fulfilled , (state, action) => {
            //     state.loading = false;
            //     state.error = false;
            //     state.questionsID = action.payload
            // })
            // .addCase(fetchPollId.rejected , (state, action) => {
            //     state.loading = false;
            //     state.error = true;
            // })
})


export const {onQuestionnaireAdd , onQuestionnaireProfile ,onQuestionnaireDelete} = questionnaireSlice.actions
export default questionnaireSlice.reducer