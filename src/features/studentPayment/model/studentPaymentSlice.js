import {createSlice} from "@reduxjs/toolkit";
import {
    studentPaymentThunk,
    studentCharityThunk,
    studentDiscountThunk,
    studentGroupHistoryThunk,
    studentTotalAddendanceThunk,
    studentProfileTotalAmountThunk,
    studentProfileAttendanceDataThunk,
    studentProfileAttendanceDataPostThunk,
    studentProfileAttendanceAll,
    studentProfileAttendanceAllDataThunk,
    studentProfileAttendanceAllDataPostThunk,
    studentPaymentListThunk,
    studentContractThunk,
    studentContractUploadThunk,
    studentPaymenListDelete,
    studentPaymentListDeleteGetThunk,
    studentPaymentDataThunk,
    studentPaymentDataPostThunk,
    studentPaymentTypeChangeThunk,
    studentBookOrderListThunk,
    getMonthDataThunk,
    fetchStudentDebtorData, fetchStudentCharityMonth, fetchStudentCharityYears

} from "./studentPaymentThunk";
import {months} from "../../../pages/calendarPage/ui/calendarDetail";


const initialState = {
    payment: [],
    charities: [],
    discount: [],
    groupHistory: [],
    attendance: [],
    totalAmount: [],
    attendanceData: [],
    attendanceDatas: [],
    attendanceAllData: [],
    allAttendance: [],
    allAttendanceDatas: [],
    paymentList: [],
    contract: [],
    contractFile: [],
    deleteList: [],
    getDeletedList: [],
    getPaymentDates: [],
    getDateWithPost: [],
    paymentType: [],
    booksList: [],
    getMonthData: [],
    debtStudent: [],
    loading: false,
    error: null,
    month: [],
    year: [],
    yearMonth: []


}

const studentPaymentSlice = createSlice({
    name: "studentPaymentSlice",
    initialState,
    reducers: {

        onChange: (state, action) => {
            state.month.data = state?.month.data?.map(item => {
                if (item.id === +action.payload.id) {
                    return {
                        ...item,
                        payment_sum: action.payload.payment_sum,
                        payment_reason: action.payload.payment_reason,
                    }
                }
                return item
            })
        },
        onDeleteDebtorData: (state, action) => {

            console.log(action.payload)
            state.debtStudent.data = state?.debtStudent?.data?.filter(item => item.id !== action.payload.id)

        }
    },
    extraReducers: builder => {
        builder
            .addCase(studentPaymentThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(studentPaymentThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.payment = action.payload
            })
            .addCase(studentPaymentThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message
            })


            .addCase(studentCharityThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(studentCharityThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.charities = action.payload
            })
            .addCase(studentCharityThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message
            })


            .addCase(studentDiscountThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(studentDiscountThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.discount = action.payload
            })
            .addCase(studentDiscountThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message
            })


            .addCase(studentGroupHistoryThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(studentGroupHistoryThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.groupHistory = action.payload
            })
            .addCase(studentGroupHistoryThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message
            })


            .addCase(studentTotalAddendanceThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(studentTotalAddendanceThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.attendance = action.payload
            })
            .addCase(studentTotalAddendanceThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message
            })


            .addCase(studentProfileTotalAmountThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(studentProfileTotalAmountThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.totalAmount = action.payload
            })
            .addCase(studentProfileTotalAmountThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message
            })


            .addCase(studentProfileAttendanceDataThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(studentProfileAttendanceDataThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.attendanceData = action.payload
            })
            .addCase(studentProfileAttendanceDataThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message
            })


            .addCase(studentProfileAttendanceDataPostThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(studentProfileAttendanceDataPostThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.attendanceDatas = action.payload
            })
            .addCase(studentProfileAttendanceDataPostThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message
            })


            .addCase(studentProfileAttendanceAll.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(studentProfileAttendanceAll.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.allAttendance = action.payload
            })
            .addCase(studentProfileAttendanceAll.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message
            })


            .addCase(studentProfileAttendanceAllDataThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(studentProfileAttendanceAllDataThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.attendanceAllData = action.payload
            })
            .addCase(studentProfileAttendanceAllDataThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message
            })


            .addCase(studentProfileAttendanceAllDataPostThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(studentProfileAttendanceAllDataPostThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.allAttendanceDatas = action.payload
            })
            .addCase(studentProfileAttendanceAllDataPostThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message
            })


            .addCase(studentPaymentListThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(studentPaymentListThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.paymentList = action.payload
            })
            .addCase(studentPaymentListThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message
            })


            .addCase(studentContractThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(studentContractThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.contract = action.payload;
            })
            .addCase(studentContractThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })


            .addCase(studentContractUploadThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(studentContractUploadThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.contractFile = action.payload;
            })
            .addCase(studentContractUploadThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })


            .addCase(studentPaymenListDelete.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(studentPaymenListDelete.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.deleteList = action.payload;
            })
            .addCase(studentPaymenListDelete.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })


            .addCase(studentPaymentListDeleteGetThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(studentPaymentListDeleteGetThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.getDeletedList = action.payload;
            })
            .addCase(studentPaymentListDeleteGetThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })


            .addCase(studentPaymentDataThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(studentPaymentDataThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.getPaymentDates = action.payload;
            })
            .addCase(studentPaymentDataThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })


            .addCase(studentPaymentDataPostThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(studentPaymentDataPostThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.getDateWithPost = action.payload;
            })
            .addCase(studentPaymentDataPostThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })


            .addCase(studentPaymentTypeChangeThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(studentPaymentTypeChangeThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.paymentType = action.payload;
            })
            .addCase(studentPaymentTypeChangeThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })


            .addCase(studentBookOrderListThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(studentBookOrderListThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.booksList = action.payload;
            })
            .addCase(studentBookOrderListThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })


            .addCase(getMonthDataThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getMonthDataThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.getMonthData = action.payload;
            })
            .addCase(getMonthDataThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchStudentDebtorData.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(fetchStudentDebtorData.fulfilled, (state, action) => {
                state.debtStudent = action.payload
                state.loading = false
                state.error = false
            })
            .addCase(fetchStudentDebtorData.rejected, state => {
                state.loading = false
                state.error = true
            })

            .addCase(fetchStudentCharityYears.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(fetchStudentCharityYears.fulfilled, (state, action) => {
                state.year = action.payload
                console.log(action.payload, "action payload")
                state.loading = false
                state.error = false
            })
            .addCase(fetchStudentCharityYears.rejected, state => {
                state.loading = false
                state.error = true
            })



            .addCase(fetchStudentCharityMonth.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(fetchStudentCharityMonth.fulfilled, (state, action) => {
                state.yearMonth = action.payload
                state.loading = false
                state.error = false
            })
            .addCase(fetchStudentCharityMonth.rejected, state => {
                state.loading = false
                state.error = true
            })


    }
});
export const {onChange, onDeleteDebtorData} = studentPaymentSlice.actions
export default studentPaymentSlice.reducer
