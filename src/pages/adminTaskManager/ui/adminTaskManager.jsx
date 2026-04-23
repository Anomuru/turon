import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { DynamicModuleLoader } from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx"
import { DebtorCRMBoard } from "../../../entities/adminTaskManager"
import { FetchCallStatisticThunk } from "entities/adminTaskManager/model/crmThunks"

import cls from "./adminTaskManager.module.sass"

// ─── Format helpers ────────────────────────────────────────────────────────────
const fmt = (s) => s != null
    ? `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
    : '—'

// ─── Call Statistics Page ─────────────────────────────────────────────────────
const CallStatisticsPage = () => {
    const dispatch = useDispatch()
    const branchId = localStorage.getItem('branchId') || 11
    const todayStr = new Date().toISOString().slice(0, 10)

    const [date, setDate] = useState(todayStr)
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchStats = (d) => {
        setLoading(true)
        setError(null)
        dispatch(FetchCallStatisticThunk({ branchId, date: d }))
            .then(res => {
                if (res.payload) setStats(res.payload.results)
                else setError("Ma'lumot topilmadi yoki API xatosi")
            })
            .catch(() => setError('Serverga ulanishda xatolik'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchStats(date) }, [])
    console.log(stats, "log")

    // ── Single circular progress logic ──
    const total = stats?.total ?? 0;
    const called = stats?.called ?? 0;
    const percentage = stats?.percentage ?? 0;

    const radius = 90;
    const strokeWidth = 14;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className={cls.statsPage}>

            {/* ── Hero header ── */}
            <div className={cls.statsPage__hero}>
                <div className={cls.statsPage__heroLeft}>
                    <div className={cls.statsPage__heroIcon}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                    </div>
                    <div>
                        <h2 className={cls.statsPage__heroTitle}>Qo'ng'iroq Statistikasi</h2>
                        <p className={cls.statsPage__heroSub}>Filial #{branchId} · {date}</p>
                    </div>
                </div>

                {/* ── Controls ── */}
                <div className={cls.statsPage__controls}>
                    <div className={cls.statsPage__datebox}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <input
                            type="date"
                            className={cls.statsPage__dateInput}
                            value={date}
                            max={todayStr}
                            onChange={e => { setDate(e.target.value); fetchStats(e.target.value) }}
                        />
                    </div>
                    <button
                        className={cls.statsPage__refreshBtn}
                        onClick={() => fetchStats(date)}
                        disabled={loading}
                        title="Yangilash"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                            style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }}>
                            <polyline points="23 4 23 10 17 10" />
                            <polyline points="1 20 1 14 7 14" />
                            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                        </svg>
                        Yangilash
                    </button>
                </div>
            </div>

            {/* ── Loading ── */}
            {loading && (
                <div className={cls.statsPage__loading}>
                    <div className={cls.statsPage__spinner} />
                    <span>Statistika yuklanmoqda...</span>
                </div>
            )}

            {/* ── Error ── */}
            {!loading && error && (
                <div className={cls.statsPage__error}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                    <button className={cls.statsPage__retryBtn} onClick={() => fetchStats(date)}>Qayta urinish</button>
                </div>
            )}

            {/* ── Main Circular Progress ── */}
            {!loading && stats && (
                <div className={cls.statsPage__cardsGrid}>
                    {stats?.map((item) => {
                        const radius = 90;
                        const strokeWidth = 14;
                        const circumference = 2 * Math.PI * radius;
                        const strokeDashoffset = circumference - (item.percentage / 100) * circumference;

                        return (
                            <div key={item.id} className={cls.statsPage__cardsGrid__card}>
                                <div className={cls.statsPage__circleWrap}>
                                    <svg className={cls.statsPage__circleSvg} width="240" height="240" viewBox="0 0 200 200">
                                        <circle
                                            className={cls.statsPage__circleTrack}
                                            cx="100" cy="100" r={radius}
                                            strokeWidth={strokeWidth}
                                        />
                                        <circle
                                            className={cls.statsPage__circleProgress}
                                            cx="100" cy="100" r={radius}
                                            strokeWidth={strokeWidth}
                                            strokeDasharray={circumference}
                                            strokeDashoffset={strokeDashoffset}
                                        />
                                    </svg>
                                    <div className={cls.statsPage__circleInfo}>
                                        <div className={cls.statsPage__circlePercent}>{item.percentage}%</div>
                                        <div className={cls.statsPage__circleLabel}>Bajarildi</div>
                                    </div>
                                </div>

                                <div className={cls.statsPage__progressDetails}>

                                    <div className={cls.statsPage__progressItem}>
                                        <span className={cls.statsPage__progressItemLabel}>Jami:</span>
                                        <span className={cls.statsPage__progressItemValue}>{item.total}</span>
                                    </div>
                                    <div className={cls.statsPage__progressItem}>
                                        <span className={cls.statsPage__progressItemLabel}>Qo'ng'iroq qilindi:</span>
                                        <span className={cls.statsPage__progressItemValue}>{item.called}</span>
                                    </div>
                                </div>
                                <div className={cls.statsPage__progressItem}>
                                    <span className={cls.statsPage__progressItemLabel}>Sana:</span>
                                    <span className={cls.statsPage__progressItemValue}>{item.date}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

// ─── Page Tabs ────────────────────────────────────────────────────────────────
const PAGE_TABS = [
    {
        key: 'crm',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
        ),
        label: 'CRM Board',
    },
    {
        key: 'statistics',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
        ),
        label: 'Statistika',
    },
]

// ─── Main Page ────────────────────────────────────────────────────────────────
const initialState = {}

export const AdminTaskManager = () => {
    const [activeTab, setActiveTab] = useState('crm')

    return (
        <DynamicModuleLoader reducers={initialState}>
            <div className={cls.container}>
                {/* ── Page Header ── */}
                <header className={cls.header}>
                    <div className={cls.header__left}>
                        <div className={cls.header__icon}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 11l3 3L22 4" />
                                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                            </svg>
                        </div>
                        <div>
                            <h1 className={cls.header__title}>Task Manager</h1>
                            <p className={cls.header__subtitle}>Qarzdor va yangi o'quvchilar bilan bog'lanish</p>
                        </div>
                    </div>
                    <div className={cls.header__right}>
                        {/* Page-level nav tabs */}
                        <nav className={cls.pageTabs}>
                            {PAGE_TABS.map(t => (
                                <button
                                    key={t.key}
                                    className={`${cls.pageTab} ${activeTab === t.key ? cls['pageTab--active'] : ''}`}
                                    onClick={() => setActiveTab(t.key)}
                                >
                                    {t.icon}
                                    {t.label}
                                </button>
                            ))}
                        </nav>
                        <div className={cls.header__badge}>
                            <span className={cls.pulse} />
                            Live CRM
                        </div>
                        {/* <Link to={"../filteredLeadsList"} className={cls.header__btn}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            New Lead
                        </Link> */}
                    </div>
                </header>

                {/* ── Content ── */}
                <main className={cls.main}>
                    {activeTab === 'crm' && <DebtorCRMBoard />}
                    {activeTab === 'statistics' && <CallStatisticsPage />}
                </main>
            </div>
        </DynamicModuleLoader>
    )
}
