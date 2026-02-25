import {createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import {newStudents} from "entities/students/model/studentsSlice.js";

const initialState = {
    data: [],
    loading: false,
    error: false,
}

export const fetchNews = createAsyncThunk(
    "newsSlice/fetchNews",
    async () => {
        const {request} = useHttp()
        return await request(`${API_URL}Ui/news/` , "GET" , null , headers())
    }
)

const newsSlice = createSlice({
    name: "newsSlice",
    initialState,
    reducers: {
        onAddNews: (state, action) => {
            state.data = [...state.data, action.payload]
        },
        onRemoveNews: (state, action) => {
            state.data.filter(item => item.id !== action.payload)
        },
        onEditNews: (state, action) => {
            state.data = [...state.data.filter(item => item.id !== action.payload.id), action.payload.data]
        }
    },
    extraReducers: builder =>
        builder
            .addCase(fetchNews.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(fetchNews.fulfilled , (state, action) => {
                state.loading = false
                state.error = false
                state.data = action.payload
            })
            .addCase(fetchNews.rejected , state => {
                state.loading = false
                state.error = true
            })
})
export default newsSlice.reducer

export const {onEditNews , onRemoveNews , onAddNews} = newsSlice.actions
