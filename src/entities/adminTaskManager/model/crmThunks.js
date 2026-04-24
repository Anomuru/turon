import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL, headers } from "shared/api/base.js";

// POST call/calls/ → returns { ok, callid, call_log_id }
export const CallThunk = createAsyncThunk(
    'crmSlice/callThunk',
    async (data, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}call/calls/`, {
                method: 'POST',
                headers: headers(),
                body: JSON.stringify(data),
            })
            if (!res.ok) throw new Error(`calls/ POST failed: ${res.status}`)
            return res.json()
        } catch (e) {
            return rejectWithValue(e.message)
        }
    }
)

// GET call/history/?student_id=... → returns array of call logs
export const GetCallsHistoryThunk = createAsyncThunk(
    'crmSlice/GetCallsHistory',
    async (studentId, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}call/history/?student_id=${studentId}`, {
                headers: headers(),
            })
            if (!res.ok) throw new Error(`history GET failed: ${res.status}`)
            const data = await res.json()
            return Array.isArray(data) ? data : (data.results ?? [])
        } catch (e) {
            return rejectWithValue(e.message)
        }
    }
)

// GET call/status/?callid=... → returns { is_finished, vats_status, audio_url, ... }
export const CheckCallStatusThunk = createAsyncThunk(
    'crmSlice/CheckCallStatus',
    async (callId, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}call/status/?callid=${callId}`, {
                headers: headers(),
            })
            if (!res.ok) throw new Error(`status GET failed: ${res.status}`)
            return res.json()
        } catch (e) {
            return rejectWithValue(e.message)
        }
    }
)

// POST call/update/?callid=... { comment, next_call_date }
export const SetCallThunk = createAsyncThunk(
    'crmSlice/SetCallThunk',
    async ({ callId, comment, next_call_date }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}call/update/?callid=${callId}`, {
                method: 'POST',
                headers: headers(),
                body: JSON.stringify({ comment, next_call_date }),
            })
            if (!res.ok) throw new Error(`update POST failed: ${res.status}`)
            return res.json()
        } catch (e) {
            return rejectWithValue(e.message)
        }
    }
)

// GET Tasks/admin/debtors/?branch=... → returns debtors list
export const FetchDebtorsThunk = createAsyncThunk(
    'crmSlice/FetchDebtors',
    async (branchId, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}Tasks/admin/debtors/?branch=${branchId}`, {
                headers: headers(),
            })
            if (!res.ok) throw new Error(`debtors GET failed: ${res.status}`)
            return res.json()
        } catch (e) {
            return rejectWithValue(e.message)
        }
    }
)

export const FetchLeadsThunk = createAsyncThunk(
    'crmSlice/FetchLeadsThunk',
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}Tasks/admin/leads/?branch=6`, {
                headers: headers(),
            })
            if (!res.ok) throw new Error(`leads GET failed: ${res.status}`)
            return res.json()
        } catch (e) {
            return rejectWithValue(e.message)
        }
    }
)

// GET Students/new-registered-students/?branch=6&limit=50&offset=0
export const FetchNewStudentsThunk = createAsyncThunk(
    'crmSlice/FetchNewStudentsThunk',
    async (_, { rejectWithValue }) => {
        try {
            const branchId = localStorage.getItem('branchId') || 6
            const res = await fetch(
                `${API_URL}Students/new-registered-students/?branch=${branchId}&limit=50&offset=0`,
                { headers: headers() }
            )
            if (!res.ok) throw new Error(`new-registered-students GET failed: ${res.status}`)
            const data = await res.json()
            return Array.isArray(data) ? data : (data.results ?? [])
        } catch (e) {
            return rejectWithValue(e.message)
        }
    }
)

// GET call/statistic/?branch_id=...&date=YYYY-MM-DD → call statistics
export const FetchCallStatisticThunk = createAsyncThunk(
    'crmSlice/FetchCallStatistic',
    async ({ branchId, date }, { rejectWithValue }) => {
        try {
            const res = await fetch(
                `${API_URL}call/statistic/?branch_id=${branchId}&date=${date}`,
                { headers: headers() }
            )
            if (!res.ok) throw new Error(`call/statistic/ GET failed: ${res.status}`)
            return res.json()
        } catch (e) {
            return rejectWithValue(e.message)
        }
    }
)

// POST call/statistic/update/ → { branch, total }
export const UpdateCallStatisticThunk = createAsyncThunk(
    'crmSlice/UpdateCallStatistic',
    async ({ branch, total }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}call/statistic/update/`, {
                method: 'POST',
                headers: headers(),
                body: JSON.stringify({ branch, total }),
            })
            if (!res.ok) throw new Error(`call/statistic/update/ POST failed: ${res.status}`)
            return res.json()
        } catch (e) {
            return rejectWithValue(e.message)
        }
    }
)

// GET call/called/?branch_id=...&date=YYYY-MM-DD&category=debtor|new_student|lead
export const FetchCalledUsersThunk = createAsyncThunk(
    'crmSlice/FetchCalledUsers',
    async ({ branchId, date, category }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({ branch_id: branchId, date, category })
            const res = await fetch(`${API_URL}call/called/?${params}`, {
                headers: headers(),
            })
            if (!res.ok) throw new Error(`call/called/ GET failed: ${res.status}`)
            const data = await res.json()
            return Array.isArray(data) ? data : (data.results ?? [])
        } catch (e) {
            return rejectWithValue(e.message)
        }
    }
)