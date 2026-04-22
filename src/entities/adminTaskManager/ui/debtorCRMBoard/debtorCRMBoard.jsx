import React, { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { useDispatch } from "react-redux"
import { Pagination } from "features/pagination/ui/pagination"
import cls from "./debtorCRMBoard.module.sass"

import {
    CallThunk,
    CheckCallStatusThunk,
    SetCallThunk,
    GetCallsHistoryThunk,
    FetchDebtorsThunk,
    FetchLeadsThunk,
    FetchNewStudentsThunk,
    FetchCallStatisticThunk,
    UpdateCallStatisticThunk,
    FetchCalledUsersThunk,
} from "entities/adminTaskManager/model/crmThunks"

// ─── In-App Call Modal ─────────────────────────────────────────────────────────
// onRefresh — optional, called after save+close so the board can silently refetch
const CallModal = ({ student, callId, callLogId, onClose, onRefresh }) => {
    const dispatch = useDispatch()

    // callState: 'calling' | 'active' | 'ended'
    const [callState, setCallState]   = useState('calling')
    const [elapsed, setElapsed]       = useState(0)
    const [callResult, setCallResult] = useState(null) // final response data

    // ── Next call date form
    const [nextCallDate, setNextCallDate] = useState('')
    const [comment, setComment]           = useState('')
    const [saving, setSaving]             = useState(false)
    const [saved, setSaved]               = useState(false)

    const timerRef  = useRef(null)
    const pollRef   = useRef(null)

    const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`

    // ── End call — stops polling, shows result
    const handleEndCall = useCallback((resultData = null) => {
        setCallState('ended')
        clearInterval(pollRef.current)
        clearInterval(timerRef.current)
        localStorage.removeItem('activeCallId')
        if (resultData) setCallResult(resultData)
        else setTimeout(onClose, 300)
    }, [onClose])

    // ── Transition to active after 2s (simulates ringing)
    useEffect(() => {
        const ring = setTimeout(() => setCallState('active'), 2000)
        return () => clearTimeout(ring)
    }, [])

    // ── Poll call/status/ every 5s once active
    useEffect(() => {
        if (callState !== 'active' || !callId) return
        const check = async () => {
            try {
                const result = await dispatch(CheckCallStatusThunk(callId))
                const data   = result.payload
                if (data?.is_finished === true) {
                    handleEndCall(data)
                }
            } catch (e) {
                console.warn('Status poll error:', e)
            }
        }
        pollRef.current = setInterval(check, 5000)
        return () => clearInterval(pollRef.current)
    }, [callState, callId, handleEndCall, dispatch])

    // ── Live elapsed timer while active
    useEffect(() => {
        if (callState === 'active') {
            timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
        } else {
            clearInterval(timerRef.current)
        }
        return () => clearInterval(timerRef.current)
    }, [callState])

    // ── Cleanup on unmount
    useEffect(() => () => {
        clearInterval(timerRef.current)
        clearInterval(pollRef.current)
    }, [])

    const stateLabel = {
        calling: "Qo'ng'iroq yuborilyapti...",
        active:  "Ulangan",
        ended:   "Qo'ng'iroq tugatildi",
    }[callState]

    const answered = callResult?.vats_status === 'success'

    return createPortal(
        <div
            className={cls.modal__overlay}
            onMouseDown={e => { if (e.target === e.currentTarget && callState !== 'ended') handleEndCall() }}
        >
            <div className={cls.modal}>
                {/* Avatar */}
                <div className={`${cls.modal__avatar} ${callState === 'active' ? cls['modal__avatar--active'] : ''}`}>
                    {student?.full_name?.split(' ').slice(0,2).map(w => w[0]).join('') || '?'}
                </div>

                <h2 className={cls.modal__name}>{student?.full_name || student?.user.name}</h2>
                <p className={cls.modal__phone}>{student?.phone || student?.user.phone}</p>

                <div className={`${cls.modal__status} ${cls['modal__status--' + callState]}`}>
                    {stateLabel}
                    {callState === 'active' && <span className={cls.modal__timer}>{fmt(elapsed)}</span>}
                </div>

                {/* ── Result section (shown after call ends) ── */}
                {callState === 'ended' && callResult && (
                    <div className={cls.modal__result}>
                        <div className={`${cls.modal__vats_status} ${answered ? cls['modal__vats_status--success'] : cls['modal__vats_status--missed']}`}>
                            {answered ? '✓ Javob berdi' : '✗ Javob bermadi'}
                            {callResult.vats_duration > 0 && (
                                <span className={cls.modal__duration}>⏱ {fmt(callResult.vats_duration)}</span>
                            )}
                        </div>

                        {callResult.audio_url && (
                            <div className={cls.modal__audio_wrap}>
                                <p className={cls.modal__audio_label}>📞 Suhbat yozuvi</p>
                                <audio controls src={callResult.audio_url} className={cls.modal__audio} />
                                <a href={callResult.audio_url} download className={cls.modal__audio_dl}>
                                    ⬇ Yuklab olish
                                </a>
                            </div>
                        )}

                        {/* ── Next call date form ── */}
                        {!saved ? (
                            <div className={cls.modal__next_call}>
                                <p className={cls.modal__next_call_title}>
                                    📅 Keyingi qo'ng'iroq sanasini belgilang
                                </p>
                                <input
                                    type="date"
                                    className={cls.modal__date_input}
                                    value={nextCallDate}
                                    min={new Date().toISOString().slice(0, 10)}
                                    onChange={e => setNextCallDate(e.target.value)}
                                />
                                <textarea
                                    className={cls.modal__comment_input}
                                    placeholder="Izoh (masalan: Kelmagan, Qayta chaqirish...)"
                                    rows={2}
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                />
                                <div className={cls.modal__next_actions}>
                                    <button
                                        className={cls.modal__save_btn}
                                        disabled={!nextCallDate || saving}
                                        onClick={async () => {
                                            if (!callLogId || !nextCallDate) return
                                            setSaving(true)
                                            try {
                                                await dispatch(SetCallThunk({
                                                    callId,
                                                    comment: comment || "Kelmagan",
                                                    next_call_date: nextCallDate,
                                                }))
                                                setSaved(true)
                                            } catch (e) {
                                                console.warn('SetCallThunk failed:', e)
                                            } finally {
                                                setSaving(false)
                                            }
                                        }}
                                    >
                                        {saving ? (
                                            <span className={cls.btn__spinner} />
                                        ) : '💾'}
                                        {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                                    </button>
                                    <button className={cls.modal__close_btn} onClick={onClose}>
                                        Yopish
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className={cls.modal__saved_notice}>
                                ✅ Keyingi qo'ng'iroq {nextCallDate} sanasiga belgilandi
                                <button
                                    className={cls.modal__close_btn}
                                    onClick={() => { onClose(); onRefresh?.() }}
                                    style={{marginTop: '0.8rem'}}
                                >
                                    Yopish
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>,
        document.body
    )
}

// ─── Formatters ───────────────────────────────────────────────────────────────
const formatMoney = (val) =>
    new Intl.NumberFormat("uz-UZ", { style: "decimal" }).format(val) + " so'm"

// ─── Pending Card ─────────────────────────────────────────────────────────────
const fmtDur = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

const PendingCard = ({ student, onRefresh }) => {
    const dispatch = useDispatch()

    const [showCall, setShowCall]               = useState(false)
    const [activeCallId, setActiveCallId]       = useState(null)
    const [activeCallLogId, setActiveCallLogId] = useState(null)
    const [callLoading, setCallLoading]         = useState(false)
    const [callStatus, setCallStatus]           = useState(null)

    // ── Call history
    const [showHistory, setShowHistory]       = useState(false)
    const [history, setHistory]               = useState(null)   // null = not loaded yet
    const [historyLoading, setHistoryLoading] = useState(false)

    // API shape: full_name, phone, parent_phone, debt, months_count, color, id
    const initials = student.full_name
        ? student.full_name.split(' ').slice(0, 2).map(w => w[0]).join('')
        : "?"
    const initialss = student?.user?.name 
    ? student?.user?.name.split(' ').slice(0, 2).map(w => w[0]).join('')
    : "?"

    // POST first → get callId + callLogId → save to localStorage → open modal
    const handleCallClick = async () => {
        if (callLoading || showCall) return
        setCallLoading(true)
        try {
            const result  = await dispatch(CallThunk({
                user: "admin",
                phone: "+998942021090",
                student_id: student.student_id,
                comment: "com",
                category: 'debtor',
            }))
            const data    = result.payload
            const callId    = data?.callid      ?? null
            const callLogId = data?.call_log_id ?? null
            if (callId) localStorage.setItem('activeCallId', callId)
            localStorage.setItem("student_id", student.id)
            setActiveCallId(callId)
            setActiveCallLogId(callLogId)
            setShowCall(true)
        } catch (err) {
            console.warn('Could not initiate call:', err)
        } finally {
            setCallLoading(false)
        }
    }

    // Fetch history once on first open
    const toggleHistory = async () => {
        if (!showHistory && history === null) {
            setHistoryLoading(true)
            try {
                const result = await dispatch(GetCallsHistoryThunk(student?.lead_id || student?.id || student?.student_id))
                setHistory(result.payload ?? [])
            } catch (e) {
                console.warn('History fetch failed:', e)
                setHistory([])
            } finally {
                setHistoryLoading(false)
            }
        }
        setShowHistory(prev => !prev)
    }

    const colorClass = student.color === 'red' ? cls['card--red'] : student.color === 'yellow' ? cls['card--yellow'] : ''

    return (
        <div className={`${cls.card} ${cls["card--pending"]} ${colorClass}`}>
            <div className={cls.card__top}>
                {
                    student.user ? <div className={cls.card__avatars}>
                    {initialss}
                </div> : <div className={cls.card__avatar}>
                    {initials}
                </div> 
                }
                
                <div className={cls.card__meta}>
                    <h3 className={cls.card__name}>
                        {
                            student.user ? 
                            `${student.user.surname}   ${student.user.name}` : `${student.full_name}`
                        }
                    </h3>
                    <p className={cls.card__phone}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.78 19.78 0 01.01 2.22 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
                        {student.phone || student?.user?.phone}
                    </p>
                    {student.parent_phone && student.parent_phone !== student.phone && (
                        <p className={cls.card__phone}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                            {student.parent_phone}
                        </p>
                    )}
                </div>
                {
                    student.user || student.lead_id ? null :
                    <div className={cls.card__badges}>
                    <span className={`${cls.badge__pending} ${colorClass}`}>{student.months_count} oy</span>
                </div>
                }
                
            </div>
            {
                student.user || student.lead_id ? null :
                <div className={cls.card__debt}>
                <span className={cls.card__debt_label}>Debt Amount</span>
                <span className={cls.card__debt_value}>{formatMoney(student.debt)}</span>
            </div>
            }
            
            <div className={cls.card__actions}>
                {
                    student.user ? <button
                    onClick={handleCallClick}
                    className={cls.btn__calls}
                    disabled={callLoading || showCall}
                >
                    {callLoading ? (
                        <span className={cls.btn__spinner} />
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.78 19.78 0 01.01 2.22 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
                    )}
                    {callLoading ? "Ulanmoqda..." : "Qo'ng'iroq"}
                </button> : <button
                    onClick={handleCallClick}
                    className={cls.btn__call}
                    disabled={callLoading || showCall}
                >
                    {callLoading ? (
                        <span className={cls.btn__spinner} />
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.78 19.78 0 01.01 2.22 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
                    )}
                    {callLoading ? "Ulanmoqda..." : "Qo'ng'iroq"}
                </button> 
                }
                
                {showCall && (
                    <CallModal
                        student={student}
                        callId={activeCallId}
                        callLogId={activeCallLogId}
                        onClose={() => { setShowCall(false); setActiveCallId(null); setActiveCallLogId(null) }}
                        onRefresh={onRefresh}
                    />
                )}
            </div>

            {/* ── Call History ── */}
            <button className={cls.history__toggle} onClick={toggleHistory}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Qo'ng'iroq tarixi
                {historyLoading && <span className={cls.history__spinner} />}
                {!historyLoading && history !== null && (
                    <span className={cls.history__count}>{history.length}</span>
                )}
                <svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    style={{ marginLeft: 'auto', transform: showHistory ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                >
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </button>

            {showHistory && (
                <div className={cls.history__panel}>
                    {historyLoading && (
                        <p className={cls.history__loading}>Yuklanmoqda...</p>
                    )}
                    {!historyLoading && history?.length === 0 && (
                        <p className={cls.history__empty}>Qo'ng'iroq tarixi topilmadi</p>
                    )}
                    {!historyLoading && history?.map((log, i) => {
                        const answered = log.vats_status === 'success'
                        const date = log.called_at
                            ? new Date(log.called_at).toLocaleString('uz-UZ', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
                            : '—'
                        return (
                            <div key={log.id ?? i} className={cls.history__item}>
                                <div className={cls.history__item_top}>
                                    <span className={`${cls.history__badge} ${answered ? cls['history__badge--success'] : cls['history__badge--missed']}`}>
                                        {answered ? '✓ Javob berdi' : '✗ Javob bermadi'}
                                    </span>
                                    <span className={cls.history__date}>{date}</span>
                                    {log.vats_duration > 0 && (
                                        <span className={cls.history__dur}>⏱ {fmtDur(log.vats_duration)}</span>
                                    )}
                                </div>

                                {log.comment && (
                                    <p className={cls.history__comment}>💬 {log.comment}</p>
                                )}
                                {log.next_call_date && (
                                    <p className={cls.history__next}>📅 Keyingi: {log.next_call_date}</p>
                                )}
                                {log.audio_url && (
                                    <audio controls src={log.audio_url} className={cls.history__audio} />
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

// ─── Statistics Panel ────────────────────────────────────────────────────────
const StatisticsPanel = () => {
    const dispatch = useDispatch()
    const branchId = localStorage.getItem('branchId') || 11
    const todayStr = new Date().toISOString().slice(0, 10)

    const [date, setDate]       = useState(todayStr)
    const [stats, setStats]     = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError]     = useState(null)

    const fetchStats = (d) => {
        setLoading(true)
        setError(null)
        dispatch(FetchCallStatisticThunk({ branchId, date: d }))
            .then(res => {
                if (res.payload) setStats(res.payload)
                else setError('Ma\'lumot topilmadi')
            })
            .catch(() => setError('Xatolik yuz berdi'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchStats(date) }, [])

    const handleDateChange = (e) => {
        setDate(e.target.value)
        fetchStats(e.target.value)
    }

    // Derive metric rows from whatever shape the API returns
    const metrics = stats ? [
        { icon: '📞', label: 'Jami qo\'ng\'iroqlar',    value: stats.total_calls      ?? stats.total      ?? '—', color: 'blue'   },
        { icon: '✅', label: 'Javob berildi',            value: stats.answered_calls   ?? stats.answered   ?? '—', color: 'green'  },
        { icon: '❌', label: 'Javob berilmadi',          value: stats.missed_calls     ?? stats.missed     ?? '—', color: 'red'    },
        { icon: '⏱',  label: 'O\'rtacha davomiyligi',   value: stats.avg_duration     != null
                ? `${Math.floor(stats.avg_duration / 60)}:${String(stats.avg_duration % 60).padStart(2,'0')}`
                : '—',                                                                                             color: 'orange' },
        { icon: '🎯', label: 'Javob darajasi',           value: stats.answer_rate      != null
                ? `${stats.answer_rate}%`
                : '—',                                                                                             color: 'purple' },
        { icon: '👥', label: 'O\'zlashtirilgan lidlar',  value: stats.converted_leads  ?? stats.converted  ?? '—', color: 'teal'   },
    ] : []

    return (
        <div className={cls.statPanel}>
            {/* Header row */}
            <div className={cls.statPanel__header}>
                <div className={cls.statPanel__title}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                    Qo'ng'iroq statistikasi
                </div>
                <div className={cls.statPanel__controls}>
                    <div className={cls.statPanel__datebox}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <input
                            type="date"
                            className={cls.statPanel__dateInput}
                            value={date}
                            max={todayStr}
                            onChange={handleDateChange}
                        />
                    </div>
                    <button
                        className={cls.statPanel__refresh}
                        onClick={() => fetchStats(date)}
                        disabled={loading}
                        title="Yangilash"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                            style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }}>
                            <polyline points="23 4 23 10 17 10"/>
                            <polyline points="1 20 1 14 7 14"/>
                            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Body */}
            {loading && (
                <div className={cls.statPanel__loading}>
                    <div className={cls.loader__spinner} />
                    <span>Yuklanmoqda...</span>
                </div>
            )}
            {!loading && error && (
                <p className={cls.statPanel__error}>{error}</p>
            )}
            {!loading && stats && (
                <div className={cls.statPanel__grid}>
                    {metrics.map(m => (
                        <div key={m.label} className={`${cls.statCard} ${cls[`statCard--${m.color}`]}`}>
                            <span className={cls.statCard__icon}>{m.icon}</span>
                            <div className={cls.statCard__body}>
                                <span className={cls.statCard__val}>{m.value}</span>
                                <span className={cls.statCard__lbl}>{m.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// ─── Main Board ───────────────────────────────────────────────────────────────
const COLOR_CONFIG = {
    red:    { label: 'Kritik qarzdorlar',  dot: cls.dot__red,    section: cls['section--red']    },
    yellow: { label: 'O\'rtacha qarzdorlar', dot: cls.dot__yellow, section: cls['section--yellow'] },
}

const PAGE_SIZE = 12

export const DebtorCRMBoard = () => {
    const dispatch = useDispatch()

    // ── Active tab: 'debtors' | 'newstudents' | 'leads'
    const [activeTab, setActiveTab] = useState('debtors')

    // ── Debtors data
    const [debtors, setDebtors]   = useState([])
    const [loading, setLoading]   = useState(true)
    const [error, setError]       = useState(null)

    // ── New students data
    const [newStudents, setNewStudents]       = useState([])
    const [newStudentsLoading, setNewStudentsLoading] = useState(false)
    const [newStudentsFetched, setNewStudentsFetched] = useState(false)

    // ── Leads data
    const [leads, setLeads]           = useState([])
    const [leadsLoading, setLeadsLoading] = useState(false)
    const [leadsFetched, setLeadsFetched] = useState(false)

    const [search, setSearch]     = useState("")
    const [colorFilter, setColorFilter] = useState("all") // 'all' | 'red' | 'yellow'
    const [pages, setPages]       = useState({}) // { red: 1, yellow: 1, ... }
    const [flatPage, setFlatPage] = useState(1)

    // ── Called users data
    const todayStr = new Date().toISOString().slice(0, 10)
    const [calledUsers, setCalledUsers]     = useState([])
    const [calledLoading, setCalledLoading] = useState(false)
    const [calledCategory, setCalledCategory] = useState('debtor')
    const [calledDate, setCalledDate]       = useState(todayStr)

    // ── Refresh debtors silently (fade out → in)
    const [refreshing, setRefreshing] = useState(false)
    const refreshDebtors = useCallback(() => {
        const branchId = localStorage.getItem('branchId') || 6
        setRefreshing(true)
        dispatch(FetchDebtorsThunk(branchId))
            .then(result => {
                if (result.payload) setDebtors(result.payload)
            })
            .finally(() => setTimeout(() => setRefreshing(false), 300))
    }, [dispatch])

    useEffect(() => {
        const branchId = localStorage.getItem("branchId") || 6
        dispatch(FetchDebtorsThunk(branchId))
            .then(result => {
                if (result.payload) {
                    setDebtors(result.payload)
                } else {
                    setError(result.error?.message ?? 'Xatolik yuz berdi')
                }
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [dispatch])

    // ── Daily Stats Sync (Once per day)
    useEffect(() => {
        const syncDailyStats = async () => {
            const branchId = localStorage.getItem('branchId') || 6
            const todayStr = new Date().toISOString().slice(0, 10)
            const lastSync = localStorage.getItem('lastStatsSyncDate')

            // if already synced today, skip
            if (lastSync === todayStr) return

            try {
                // Fetch all 3 lists silently to compute total
                const [dRes, nRes, lRes] = await Promise.all([
                    dispatch(FetchDebtorsThunk(branchId)).unwrap(),
                    dispatch(FetchNewStudentsThunk()).unwrap(),
                    dispatch(FetchLeadsThunk()).unwrap(),
                ])

                const dLen = Array.isArray(dRes) ? dRes.length : (dRes?.results?.length || 0)
                const nLen = Array.isArray(nRes) ? nRes.length : (nRes?.results?.length || 0)
                const lLen = Array.isArray(lRes) ? lRes.length : (lRes?.results?.length || 0)
                const total = dLen + nLen + lLen

                await dispatch(UpdateCallStatisticThunk({ branch: Number(branchId), total })).unwrap()
                localStorage.setItem('lastStatsSyncDate', todayStr)
            } catch (e) {
                console.warn('Daily sync of call stats failed:', e)
            }
        }
        syncDailyStats()
    }, [dispatch])

    // ── Fetch new students when tab is clicked (lazy)
    useEffect(() => {
        if (activeTab === 'newstudents' && !newStudentsFetched) {
            setNewStudentsLoading(true)
            dispatch(FetchNewStudentsThunk())
                .then(result => {
                    const data = result.payload
                    setNewStudents(Array.isArray(data) ? data : (data?.results ?? []))
                    setNewStudentsFetched(true)
                })
                .catch(err => console.warn('New students fetch failed:', err))
                .finally(() => setNewStudentsLoading(false))
        }
    }, [activeTab, newStudentsFetched, dispatch])

    // ── Fetch leads when tab is clicked (lazy)
    useEffect(() => {
        if (activeTab === 'leads' && !leadsFetched) {
            setLeadsLoading(true)
            dispatch(FetchLeadsThunk())
                .then(result => {
                    const data = result.payload
                    setLeads(Array.isArray(data) ? data : (data?.results ?? []))
                    setLeadsFetched(true)
                })
                .catch(err => console.warn('Leads fetch failed:', err))
                .finally(() => setLeadsLoading(false))
        }
    }, [activeTab, leadsFetched, dispatch])

    // ── Fetch called users when tab is 'called' or category/date changes
    const fetchCalledUsers = useCallback((category, date) => {
        const branchId = localStorage.getItem('branchId') || 11
        setCalledLoading(true)
        dispatch(FetchCalledUsersThunk({ branchId, date, category }))
            .then(result => {
                const data = result.payload
                setCalledUsers(Array.isArray(data) ? data : (data?.results ?? []))
            })
            .catch(err => console.warn('Called users fetch failed:', err))
            .finally(() => setCalledLoading(false))
    }, [dispatch])

    useEffect(() => {
        if (activeTab === 'called') {
            fetchCalledUsers(calledCategory, calledDate)
        }
    }, [activeTab, calledCategory, calledDate, fetchCalledUsers])

    // Reset flat page when switching tabs
    useEffect(() => {
        setFlatPage(1)
        setSearch('')
    }, [activeTab])

    // ── Active data based on tab
    const activeData = activeTab === 'debtors' ? debtors
        : activeTab === 'newstudents' ? newStudents
        : activeTab === 'leads' ? leads
        : calledUsers

    const isTabLoading = activeTab === 'debtors' ? loading
        : activeTab === 'newstudents' ? newStudentsLoading
        : activeTab === 'leads' ? leadsLoading
        : calledLoading

    // ── Filter by search
    const filtered = useMemo(() => {
        const q = search.toLowerCase()
        return activeData.filter(s => {
            const name = (s.full_name || s.name || '').toLowerCase()
            const phone = s.phone || ''
            const parentPhone = s.parent_phone || ''
            return name.includes(q) || phone.includes(q) || parentPhone.includes(q)
        })
    }, [activeData, search])

    // ── Group by color (only for debtors)
    const grouped = useMemo(() => {
        if (activeTab !== 'debtors') return {}
        const groups = {}
        filtered.forEach(d => {
            const c = d.color || 'yellow'
            if (!groups[c]) groups[c] = []
            groups[c].push(d)
        })
        return groups
    }, [filtered, activeTab])

    const colorOrder   = ['red', 'yellow', ...Object.keys(grouped).filter(c => c !== 'red' && c !== 'yellow')]

    if (loading && activeTab === 'debtors') return (
        <div className={cls.loader}>
            <div className={cls.loader__spinner} />
            <p>Ma'lumotlar yuklanmoqda...</p>
        </div>
    )

    if (error && activeTab === 'debtors') return (
        <div className={cls.error}>
            ⚠ Ma'lumotlarni yuklashda xatolik: {error}
        </div>
    )

    // ── Flat paginated items for newstudents / leads
    const flatStart = (flatPage - 1) * PAGE_SIZE
    const flatPageItems = filtered.slice(flatStart, flatStart + PAGE_SIZE)

    return (
        <div className={cls.board}>

            {/* ── Top-level Type Tabs ── */}
            <div className={cls.type_tabs}>
                {[
                    { key: 'debtors',     label: '💰 Qarzdorlar',             count: debtors.length },
                    { key: 'newstudents', label: "🎓 Yangi o'quvchilar",     count: newStudents.length },
                    { key: 'leads',       label: '🧲 Lidlar',                 count: leads.length },
                    { key: 'called',      label: "📞 Qo'ng'iroq qilinganlar", count: calledUsers.length },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`${cls.type_tab} ${activeTab === tab.key ? cls['type_tab--active'] : ''}`}
                    >
                        {tab.label}
                        {tab.count > 0 && <span className={cls.type_tab__count}>{tab.count}</span>}
                    </button>
                ))}
            </div>

            {/* ── Controls ── */}
            <div className={cls.controls}>
                <div className={cls.search}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input
                        type="text"
                        placeholder="Ism yoki telefon bo'yicha qidirish..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className={cls.search__input}
                    />
                </div>

                {/* Color sub-filter only for debtors */}
                {activeTab === 'debtors' && (
                    <div className={cls.filters}>
                        {['all', 'red', 'yellow'].map(f => (
                            <button
                                key={f}
                                onClick={() => setColorFilter(f)}
                                className={`${cls.filter__btn} ${colorFilter === f ? cls['filter__btn--active'] : ''} ${f !== 'all' ? cls[`filter__btn--${f}`] : ''}`}
                            >
                                {f === 'all' ? 'Hammasi' : f === 'red' ? '🔴 Kritik' : '🟡 O\'rtacha'}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Tab loading state ── */}
            {isTabLoading && (
                <div className={cls.loader}>
                    <div className={cls.loader__spinner} />
                    <p>Ma'lumotlar yuklanmoqda...</p>
                </div>
            )}

            {/* ── Debtors: Color-grouped rows ── */}
            {activeTab === 'debtors' && !isTabLoading && (
                <div style={{ opacity: refreshing ? 0.4 : 1, transition: 'opacity 0.3s ease' }}>
                    {colorOrder
                        .filter(color => (colorFilter === 'all' || colorFilter === color) && grouped[color]?.length > 0)
                        .map(color => {
                            const cfg = COLOR_CONFIG[color] || { label: color, dot: cls.dot__pending, section: '' }
                            const currentPage = pages[color] || 1
                            const totalCount  = grouped[color].length
                            const start = (currentPage - 1) * PAGE_SIZE
                            const pageItems = grouped[color].slice(start, start + PAGE_SIZE)
                            return (
                                <section key={color} className={`${cls.section} ${cfg.section}`}>
                                    <div className={cls.section__header}>
                                        <h2 className={cls.section__title}>
                                            <span className={cfg.dot} />
                                            {cfg.label}
                                        </h2>
                                        <span className={cls.section__count}>
                                            {totalCount} ta o'quvchi · {formatMoney(grouped[color].reduce((s,x) => s + (x.debt||0), 0))}
                                        </span>
                                    </div>
                                    <div className={cls.grid}>
                                        {pageItems.map((s, i) => (
                                            <PendingCard key={s.phone + i} student={s} onRefresh={refreshDebtors} />
                                        ))}
                                    </div>
                                    <Pagination
                                        totalCount={totalCount}
                                        pageSize={PAGE_SIZE}
                                        currentPage={currentPage}
                                        onPageChange={(p) => setPages(prev => ({ ...prev, [color]: p }))}
                                    />
                                </section>
                            )
                        })
                    }
                    {filtered.length === 0 && (
                        <p className={cls.empty}>Qarzdor o'quvchi topilmadi.</p>
                    )}
                </div>
            )}

            {/* ── New Students / Leads: Flat grid ── */}
            {(activeTab === 'newstudents' || activeTab === 'leads') && !isTabLoading && (
                <>
                    <section className={cls.section}>
                        <div className={cls.section__header}>
                            <h2 className={cls.section__title}>
                                <span className={cls.dot__pending} />
                                {activeTab === 'newstudents' ? "Yangi o'quvchilar" : 'Lidlar'}
                            </h2>
                            <span className={cls.section__count}>
                                {filtered.length} ta
                            </span>
                        </div>
                        <div className={cls.grid}>
                            {flatPageItems.map((s, i) => (
                                <PendingCard key={(s.phone || '') + i} student={s} />
                            ))}
                        </div>
                        <Pagination
                            totalCount={filtered.length}
                            pageSize={PAGE_SIZE}
                            currentPage={flatPage}
                            onPageChange={setFlatPage}
                        />
                    </section>
                    {filtered.length === 0 && (
                        <p className={cls.empty}>
                            {activeTab === 'newstudents' ? "Yangi o'quvchilar topilmadi." : 'Lidlar topilmadi.'}
                        </p>
                    )}
                </>
            )}

            {/* ── Called Users Tab ── */}
            {activeTab === 'called' && (
                <>
                    {/* Controls: category + date */}
                    <div className={cls.calledControls}>
                        <div className={cls.calledControls__cats}>
                            {[
                                { key: 'debtor',      label: '💰 Qarzdorlar' },
                                { key: 'new_student', label: "🎓 Yangi o'quvchilar" },
                                { key: 'lead',        label: '🧲 Lidlar' },
                            ].map(c => (
                                <button
                                    key={c.key}
                                    className={`${cls.calledCatBtn} ${calledCategory === c.key ? cls['calledCatBtn--active'] : ''}`}
                                    onClick={() => setCalledCategory(c.key)}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                        <div className={cls.calledControls__datebox}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            <input
                                type="date"
                                className={cls.calledControls__dateInput}
                                value={calledDate}
                                max={todayStr}
                                onChange={e => setCalledDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Loading */}
                    {calledLoading && (
                        <div className={cls.loader}>
                            <div className={cls.loader__spinner} />
                            <p>Yuklanmoqda...</p>
                        </div>
                    )}

                    {/* Cards */}
                    {!calledLoading && (
                        <section className={cls.section}>
                            <div className={cls.section__header}>
                                <h2 className={cls.section__title}>
                                    <span className={cls.dot__pending} />
                                    Qo'ng'iroq qilinganlar
                                </h2>
                                <span className={cls.section__count}>{calledUsers.length} ta</span>
                            </div>
                            <div className={cls.grid}>
                                {calledUsers.map((s, i) => (
                                    <PendingCard key={(s.phone || s.id || '') + i} student={s} />
                                ))}
                            </div>
                            {calledUsers.length === 0 && (
                                <p className={cls.empty}>Qo'ng'iroq qilingan foydalanuvchilar topilmadi.</p>
                            )}
                        </section>
                    )}
                </>
            )}

        </div>
    )
}
