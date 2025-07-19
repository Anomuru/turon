import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, useHttp, headers, headersImg} from "../../../shared/api/base";
import {data} from "../../../entities/calendar";


export const studentPaymentThunk = createAsyncThunk(
    'studentPaymentSlice/studentPaymentThunk',
    async (newPayment) => {
        const { request } = useHttp();
        return  await request(`${API_URL}Students/student_payment_create/`, "POST", JSON.stringify(newPayment), headers());

    }
)

export const studentCharityThunk = createAsyncThunk(
    'studentPaymentSlice/studentCharityThunk',
    async (newCharity) => {
        const {request} = useHttp();
        return await request(`${API_URL}Students/student_charities_create/`, "POST", JSON.stringify(newCharity), headers())
    }
)

export const studentDiscountThunk = createAsyncThunk(
    'studentPaymentSlice/studentDiscountThunk',
    async (newDiscount) => {
        const {request} = useHttp();
        return await request(`${API_URL}Students/student_payment_create/`, "POST", JSON.stringify(newDiscount), headers())
    }
)

export const studentGroupHistoryThunk = createAsyncThunk(
    'studentPaymentSlice/studentGroupHistoryThunk',
    async (id) => {
        const {request} = useHttp();
        return await request(`${API_URL}Students/student_history_groups/${id}/`, "GET", null, headers())
    }
)

export const studentTotalAddendanceThunk = createAsyncThunk(
    'studentPaymentSlice/studentTotalAddendanceThunk',
    async ({id, lastId}) => {
        const {request} = useHttp();
        return await request(`${API_URL}Attendance/attendance_list/${id}/?student_id=${lastId}`, "GET", null, headers())
    }
);


export const studentProfileTotalAmountThunk = createAsyncThunk(
    'studentPaymentSlice/studentProfileTotalAmountThunk',
    async () => {
        const {request} = useHttp();
        return await request(`${API_URL}Students/student_payment_list`, "GET", null, headers())
    }
)

export const studentProfileAttendanceDataThunk = createAsyncThunk(
    'studentPaymentSlice/studentProfileAttendanceDataThunk',
    async ({id, lastId}) => {
        const {request} = useHttp();
        return await request(`${API_URL}Attendance/attendance_datas_group/${id}/?student_id=${lastId}`, "GET", null, headers())
    }
)



export const studentProfileAttendanceDataPostThunk = createAsyncThunk(
    'studentPaymentSlice/studentProfileAttendanceDataPostThunk',
    async ({groupId, lastId, data}) => {
        const {request} = useHttp();
        const response = await request(`${API_URL}Attendance/attendance_list/${groupId}/?student_id=${lastId}`, "POST", JSON.stringify(data), headers());

        return response
    }
);


export const studentProfileAttendanceAll = createAsyncThunk(
    'studentPaymentSlice/studentProfileAttendanceAll',
    async (studentId) => {
        const {request} = useHttp();
        return await request(`${API_URL}Attendance/attendance_list_all/${studentId}/`, "GET", null, headers())
    }
)



export const studentProfileAttendanceAllDataThunk = createAsyncThunk(
    'studentPaymentSlice/studentProfileAttendanceAllDataThunk',
    async (id) => {
        const {request} = useHttp();
        return await request(`${API_URL}Attendance/attendance_datas_group_all/${id}/`, "GET", null, headers())
    }
)


export const studentProfileAttendanceAllDataPostThunk = createAsyncThunk(
    'studentPaymentSlice/studentProfileAttendanceAllDataPostThunk',
    async ({lastId, data}) => {
        const {request} = useHttp();
        const response = await request(`${API_URL}Attendance/attendance_list_all/${lastId}/`, "POST", JSON.stringify(data), headers());

        return response
    }
);


export const studentPaymentListThunk =  createAsyncThunk(
    'studentPaymentSlice/studentPaymentListThunk',
    async (id) => {
        const {request} = useHttp();
        return await request(`${API_URL}Students/student_payment/${id}/?status=False`, "GET", null, headers())
    }
)


export const studentContractThunk = createAsyncThunk(
    'studentPaymentSlice/studentContractThunk',
    async ({id, data}) => {
        const {request} = useHttp();
        const response = await request(`${API_URL}Students/create_contract/${id}/`, "POST", JSON.stringify(data), headers())
        return response
    }
)

export const studentContractUploadThunk = createAsyncThunk(
    'studentPaymentSlice/studentContractUploadThunk',
    async ({id, file}) => {
        const {request} = useHttp();
        const formData =  new FormData();
        formData.append('file', file)

        return await request(`${API_URL}Students/upload_pdf_contract/${id}/`, "POST", formData, headersImg())
    }
)

export const studentPaymenListDelete = createAsyncThunk(
    'studentPaymentSlice/studentPaymenListDelete',
    async (id) => {
        const {request} = useHttp();
        const response = await request(`${API_URL}Students/student_payment_delete/${id}/`, "DELETE", null, headers())
        return response
    }
)

export const studentPaymentListDeleteGetThunk =  createAsyncThunk(
    'studentPaymentSlice/studentPaymentListDeleteGetThunk',
    async (id) => {
        const {request} = useHttp();
        return await request(`${API_URL}Students/student_payment/${id}/?status=True`, "GET", null, headers())
    }
)


export const studentPaymentDataThunk = createAsyncThunk(
    'studentPaymentSlice/studentPaymentDataThunk',
    async (id) => {
        const {request} = useHttp();
        return await request(`${API_URL}Students/payment_datas/${id}/`, "GET", null, headers())
    }
)

export const studentPaymentDataPostThunk = createAsyncThunk(
    'studentPaymentSlice/studentPaymentDataPostThunk',
    async ({lastId, data}) => {
        const {request} = useHttp();
        const response = await request(`${API_URL}Students/payment_datas/${lastId}/`, "POST", JSON.stringify(data), headers());

        return response
    }
);

export const studentPaymentTypeChangeThunk = createAsyncThunk(
    'studentPaymentSlice/studentPaymentTypeChangeThunk',
    async ({id, data}) => {
        const {request} = useHttp();
        return await request(`${API_URL}Students/student_payment_update/${id}/`, "PATCH", JSON.stringify(data), headers())
    }
)


export const studentBookOrderListThunk = createAsyncThunk(
    'studentPaymentSlice/studentBookOrderListThunk',
    async (id) => {
        const {request} = useHttp();
        return await request(`${API_URL}Books/book_order_list/?student_id=${id}/`, "GET", null, headers())
    }
)

export const getMonthDataThunk = createAsyncThunk(
    'studentPaymentSlice/getMonthData',
    async (id) => {
        const {request} = useHttp();
        return await request(`${API_URL}Students/student_payment_month/${id}/1/`, "GET", null, headers())
    }
)

export const fetchStudentDebtorData = createAsyncThunk(
    "studentPaymentSlice/fetchStudentDebtorData",
    (id) => {
        const {request} = useHttp()
        return request(`${API_URL}Students/missing_month/${id}`, "GET", null, headers())
    }
)

export const fetchStudentCharityYears = createAsyncThunk(
    "studentPaymentSlice/fetchStudentCharityYears",
    (id) => {
        const {request} = useHttp()
        return request(`${API_URL}Students/get_year/?student_id=${id}`,"GET" , null , headers())
    }
)


export const fetchStudentCharityMonth = createAsyncThunk(
    "studentPaymentSlice/fetchStudentCharityMonth",
    ({years, id}) => {
        const {request} = useHttp()
        return request(`${API_URL}Students/get_month/?student_id=${id}&year=${years}/` , "GET" , null , headers())
    }
)


