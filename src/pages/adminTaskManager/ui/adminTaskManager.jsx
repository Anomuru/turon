import React, {useState, useEffect, useMemo} from "react"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { DynamicModuleLoader } from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx"
import { DebtorCRMBoard } from "../../../entities/adminTaskManager"
import { FetchCallStatisticThunk } from "entities/adminTaskManager/model/crmThunks"

import cls from "./adminTaskManager.module.sass"
import cls2 from "./admin.module.scss"
import {Button} from "antd";

// ─── Format helpers ────────────────────────────────────────────────────────────
const fmt = (s) => s != null
    ? `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
    : '—'

// ─── Call Statistics Page ─────────────────────────────────────────────────────




const CallStatisticsPage = () => {
    const dispatch = useDispatch();
    const branchId = localStorage.getItem('branchId') || 11;
    const todayStr = new Date().toISOString().slice(0, 10);

    const [date, setDate] = useState(todayStr);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchStats = (d) => {
        setLoading(true);
        dispatch(FetchCallStatisticThunk({ branchId, date: d }))
            .then(res => {
                if (res.payload?.ok) setStats(res.payload);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchStats(date) }, []);

    // Yuqoridagi 3 ta karta uchun umumiy hisob-kitoblar
    const summary = useMemo(() => {
        // const totalCustomers = stats.reduce((acc, curr) => acc + curr.total, 0);
        // const totalCalled = stats.reduce((acc, curr) => acc + curr.called, 0);
        // const avgPercent = totalCustomers > 0 ? ((totalCalled / totalCustomers) * 100).toFixed(1) : 0;
        //
        // return { totalCustomers, totalCalled, avgPercent };
    }, [stats]);

    return (
        <div className={cls2.statsWrapper}>
            {/* Header Section */}
            <header className={cls2.header}>
                <div className={cls2.header__left}>
                    <div className={cls2.header__icon}><i className="fi fi-rr-stats" /></div>
                    <div>
                        <h1>Qo'ng'iroq Statistikasi</h1>
                        {/*<span>Filial #{branchId} · {date}</span>*/}
                    </div>
                </div>
                <div className={cls2.header__controls}>
                    <input type="date" value={date} onChange={(e) => { setDate(e.target.value); fetchStats(e.target.value); }} />
                    <Button onClick={() => fetchStats(date)} className={cls2.refreshBtn}>
                        <i className={loading ? cls2.spin : ""}>↻</i> Yangilash
                    </Button>
                </div>
            </header>

            {/*/!* Summary Cards *!/*/}
            {/*<div className={cls2.summaryGrid}>*/}
            {/*    <div className={cls2.summaryCard}>*/}
            {/*        <p>JAMI MIJOZLAR</p>*/}
            {/*        <h2>{summary.totalCustomers}</h2>*/}
            {/*        <span>barcha filiallar</span>*/}
            {/*    </div>*/}
            {/*    <div className={cls2.summaryCard}>*/}
            {/*        <p>QO'NG'IROQ QILINDI</p>*/}
            {/*        <h2>{summary.totalCalled}</h2>*/}
            {/*        <span>bugun</span>*/}
            {/*    </div>*/}
            {/*    <div className={cls2.summaryCard}>*/}
            {/*        <p>O'RTACHA FOIZ</p>*/}
            {/*        <h2 className={cls2.highlightText}>{summary.avgPercent}%</h2>*/}
            {/*        <span>bajarilish darajasi</span>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Branch Cards Grid */}
            <div className={cls2.cardsGrid}>
                {/*{stats.map((item) => (*/}
                    <BranchCard key={stats.id} data={stats.called_counts} />
                {/*// ))}*/}
            </div>
        </div>
    );
};

// Har bir filial uchun alohida kichik komponent
const BranchCard = ({ data }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (data?.percentage / 100) * circumference;

    // Filialga qarab rang tanlash (ixtiyoriy)
    const cardColor = data?.branch_id === 6 ? "#3b82f6" : data?.branch_id === 9 ? "#10b981" : "#f43f5e";

    return (
        <div className={cls2.branchCard}>
            <div className={cls2.branchCard__header}>
                <span className={cls2.badge} style={{ backgroundColor: cardColor + '22', color: cardColor }}>
                    Filial #{data?.branch_id}
                </span>
                <span className={cls2.dateText}>{data?.date}</span>
            </div>

            <div className={cls2.circleBox}>
                <svg width="160" height="160">
                    <circle className={cls2.bgCircle} cx="80" cy="80" r={radius} />
                    <circle
                        className={cls2.progressCircle}
                        cx="80" cy="80" r={radius}
                        stroke={cardColor}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                    />
                </svg>
                <div className={cls2.circleInfo}>
                    <h3>{data?.percentage}%</h3>
                    <p>BAJARILDI</p>
                </div>
            </div>

            <div className={cls2.statsTable}>
                <div className={cls2.statsRow}>
                    <div className={cls2.statItem} style={{gridColumn: "1/3"}}><span>Jami</span><strong>{data?.total}</strong></div>
                    <div className={cls2.statItem}><span>Qo'ng'iroq</span><strong>{data?.called}</strong></div>
                    <div className={cls2.statItem}><span>Yangi o'quvchilar</span><strong>{data?.new_student}</strong></div>
                    <div className={cls2.statItem}><span>Qarizdorlar</span><strong>{data?.debtor}</strong></div>
                    <div className={cls2.statItem}><span>Leadlar</span><strong>{data?.lead}</strong></div>
                </div>
                <div className={cls2.progressLine}>
                    <div className={cls2.lineLabel}>
                        <span>Bajarilish</span>
                        <span>{data?.percentage}%</span>
                    </div>
                    <div className={cls2.lineBg}>
                        <div className={cls2.lineFill} style={{ width: `${data?.percentage}%`, backgroundColor: cardColor }} />
                    </div>
                </div>
            </div>
        </div>
    );
};


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
const tab = localStorage.getItem('activeTab');
    const [activeTab, setActiveTab] = useState(tab || "crm")

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
                                    onClick={() => {
                                        setActiveTab(t.key)
                                        localStorage.setItem('activeTab', t.key)
                                    }}
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
