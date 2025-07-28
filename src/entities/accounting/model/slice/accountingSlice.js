import {createSlice} from "@reduxjs/toolkit";
import {accountingThunk} from "../thunk/accountingThunk";


const pages = [
    {
        value: "studentsPayments",
        name: "O'quvchilar tolovlari",
        disabled: false
    },

    {
        value: "teachersSalary",
        name: "O'qituvchilar oyligi",
        disabled: false
    },
    {
        value: "employeesSalary",
        name: "Ishchilar oyligi",
        disabled: false
    },
    {
        value: "overhead",
        name: "Qo'shimcha xarajatlar",
        disabled: false
    },
    {
        value: "capital",
        name: "Kapital xarajatlari",
        disabled: false
    }
]

const otchotPages = [

    {
        value: "payment",
        name: "O'quvchilar tolovlari",
        disabled: false
    },

    {
        value: "teacherSalary",
        name: "O'qituvchilar oyligi",
        disabled: false
    },
    {
        value: "employerSalary",
        name: "Ishchilar oyligi",
        disabled: false
    },
    {
        value: "all",
        name: "Hammasi",
        disabled: false
    },


]
const initialState = {
    pages: pages,
    accountingPages: otchotPages,
    activePage: "studentsPayments",
    loading: false,
    error: false,
    encashment: [],
}

const accountingSlice = createSlice({
    name: 'accountingSlice',
    initialState,
    reducers: {
        onChangeAccountingPage: (state, action) => {
            state.pages = state.pages.map(item => {
                if (item.value === action.payload.value) {
                    state.activePage = action.payload.value
                    return {...item, disabled: true}
                }
                return {...item, disabled: false}
            })
        },
        onChangePage: (state, action) => {
            state.accountingPages = state.accountingPages.map(item => {
                if (item.value === action.payload.value) {
                    return {...item, disabled: true}
                }
                return {...item, disabled: false}
            })
        },
    },
    extraReducers: builder =>
        builder
            .addCase(accountingThunk.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(accountingThunk.fulfilled, (state, action) => {
                state.encashment = action.payload
                state.loading = false
                state.error = false
            })
            .addCase(accountingThunk.rejected, state => {
                state.error = "error"
                state.loading = false
            })

})

export const {onChangeAccountingPage , onChangePage} = accountingSlice.actions
export default accountingSlice.reducer

