import {statisticsReducer} from "entities/statistics/model/statisticsSlice.js";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {useDispatch, useSelector} from "react-redux";
import {getStatistics, getStatisticsLoading} from "entities/statistics/model/statisticsSelector.js";
import {capitalReducer, getCapitalTypes} from "entities/capital/index.js";
import {getPaymentType} from "entities/capital/model/thunk/capitalThunk.js";
import {getCurrentBranch} from "entities/oftenUsed/model/oftenUsedSelector.js";
import {fetchStatistics} from "entities/statistics/model/statisticsThunk.js";
import {DefaultPageLoader} from "shared/ui/defaultLoader/index.js";
import cls from "./financeDashboardPage.module.sass";
import {useEffect, useMemo, useState} from "react";

const reducers = {
    statisticsSlice: statisticsReducer,
    CapitalSlice: capitalReducer,
};

const fmtNum = (n) =>
    (+(n ?? 0)).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");

const MONTHS_UZ = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

const parseDMY = (str) => {
    if (!str) return new Date(0);
    const parts = str.split(".");
    if (parts.length === 3) return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    return new Date(str);
};

// ── Mock data (shown when API returns no results) ───────────────────────────
const DEMO_DATA = {
    payments: {
        count: 47,
        sum: 280_500_000,
        data: [
            {name: "Aliyev", surname: "Asadbek", amount: 650_000, date: "01.04.2026", payment_type: "click"},
            {name: "Karimova", surname: "Sevinch", amount: 450_000, date: "02.04.2026", payment_type: "cash"},
            {name: "Rahimov", surname: "Shahzod", amount: 750_000, date: "03.04.2026", payment_type: "bank"},
            {name: "Yo'ldosheva", surname: "Dildora", amount: 550_000, date: "05.04.2026", payment_type: "click"},
            {name: "Sattarov", surname: "Bobur", amount: 480_000, date: "07.04.2026", payment_type: "cash"},
            {name: "Nazarov", surname: "Jasur", amount: 620_000, date: "09.04.2026", payment_type: "click"},
            {name: "Toshmatov", surname: "Ulugbek", amount: 580_000, date: "11.04.2026", payment_type: "bank"},
            {name: "Mirzayeva", surname: "Nilufar", amount: 700_000, date: "14.04.2026", payment_type: "cash"},
        ],
    },
    teacher_salaries: {
        count: 12,
        sum: 85_000_000,
        data: [
            {name: "Hamidov", surname: "Bekzod", amount: 8_500_000, date: "01.04.2026", payment_type: "bank"},
            {name: "Yusupova", surname: "Malika", amount: 7_200_000, date: "01.04.2026", payment_type: "bank"},
            {name: "Ergashev", surname: "Sardor", amount: 9_000_000, date: "02.04.2026", payment_type: "bank"},
            {name: "Holiqova", surname: "Zulfiya", amount: 6_800_000, date: "02.04.2026", payment_type: "cash"},
        ],
    },
    staff_salaries: {
        count: 8,
        sum: 44_750_000,
        data: [
            {name: "Qodirov", surname: "Sherzod", amount: 5_500_000, date: "03.04.2026", payment_type: "bank"},
            {name: "Normatova", surname: "Feruza", amount: 4_200_000, date: "03.04.2026", payment_type: "bank"},
            {name: "Baxtiyorov", surname: "Kamol", amount: 6_000_000, date: "04.04.2026", payment_type: "cash"},
        ],
    },
    overheads: {
        count: 15,
        sum: 20_500_000,
        data: [
            {name: "Ijara to'lovi", amount: 20_000_000, date: "01.04.2026", type_name: "Ijara"},
            {name: "O'qituvchilar oyligi", amount: 85_000_000, date: "01.04.2026", type_name: "Oyliklar"},
            {name: "Kommunal to'lov", amount: 6_250_000, date: "22.04.2026", type_name: "Kommunal"},
            {name: "Kantselyariya", amount: 1_350_000, date: "21.04.2026", type_name: "Boshqa"},
            {name: "Internet xizmati", amount: 650_000, date: "20.04.2026", type_name: "Kommunal"},
        ],
    },
    new_students: {
        count: 18,
        data: [
            {name: "Aliyev", surname: "Asadbek", date: "20.04.2026", payment_type: "click"},
            {name: "Karimova", surname: "Sevinch", date: "19.04.2026", payment_type: "cash"},
            {name: "Rahimov", surname: "Shahzod", date: "18.04.2026", payment_type: "bank"},
            {name: "Yo'ldosheva", surname: "Dildora", date: "17.04.2026", payment_type: "click"},
            {name: "Sattarov", surname: "Bobur", date: "16.04.2026", payment_type: "cash"},
        ],
    },
    new_groups: {count: 3, data: []},
    new_leads: {count: 24, data: []},
};

// generate per-day chart points for demo
const DEMO_CHART = Array.from({length: 22}, (_, i) => {
    const d = String(i + 1).padStart(2, "0");
    return {
        date: `${d}.04.2026`,
        income: 8_000_000 + Math.round(Math.sin(i * 0.4) * 3_000_000 + Math.random() * 2_000_000),
        expense: 4_500_000 + Math.round(Math.cos(i * 0.3) * 1_500_000 + Math.random() * 1_000_000),
    };
});

// ── SVG Line Chart ──────────────────────────────────────────────────────────
const LineChart = ({data}) => {
    const W = 540, H = 200;
    const PAD = {top: 20, right: 16, bottom: 36, left: 52};
    const cw = W - PAD.left - PAD.right;
    const ch = H - PAD.top - PAD.bottom;

    if (!data?.length) {
        return (
            <div className={cls.chartEmpty}>
                <i className="fa fa-chart-line"/>
                <p>Ma'lumot yo'q</p>
            </div>
        );
    }

    const maxVal = Math.max(1, ...data.flatMap(d => [d.income, d.expense]));
    const n = data.length;
    const xOf = (i) => PAD.left + (n > 1 ? (i / (n - 1)) * cw : cw / 2);
    const yOf = (v) => PAD.top + ch - (v / maxVal) * ch;

    const incPts = data.map((d, i) => `${xOf(i)},${yOf(d.income)}`).join(" ");
    const expPts = data.map((d, i) => `${xOf(i)},${yOf(d.expense)}`).join(" ");

    const yTicks = [0, 0.25, 0.5, 0.75, 1];
    const step = Math.max(1, Math.floor(n / 5));
    const xLabels = data
        .map((d, i) => ({i, label: d.date?.split(".")?.slice(0, 2)?.join(" ") || `${i + 1}`}))
        .filter((_, i) => i === 0 || i === n - 1 || i % step === 0);

    return (
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} className={cls.chartSvg}>
            {yTicks.map((f, i) => (
                <g key={i}>
                    <line
                        x1={PAD.left} y1={yOf(f * maxVal)}
                        x2={W - PAD.right} y2={yOf(f * maxVal)}
                        stroke="#e5e7eb" strokeDasharray="3,3" strokeWidth="1"
                    />
                    <text x={PAD.left - 4} y={yOf(f * maxVal) + 4} textAnchor="end" fontSize="9" fill="#9ca3af">
                        {fmtNum(Math.round(f * maxVal / 1e6))} mln
                    </text>
                </g>
            ))}
            {xLabels.map(({i, label}) => (
                <text key={i} x={xOf(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="#9ca3af">
                    {label}
                </text>
            ))}
            <polyline points={incPts} fill="none" stroke="#10b981" strokeWidth="1.5"
                      strokeLinejoin="round" strokeLinecap="round"/>
            <polyline points={expPts} fill="none" stroke="#ef4444" strokeWidth="1.5"
                      strokeLinejoin="round" strokeLinecap="round"/>
            {n <= 25 && data.map((d, i) => (
                <g key={i}>
                    <circle cx={xOf(i)} cy={yOf(d.income)} r="2.5" fill="#10b981"/>
                    <circle cx={xOf(i)} cy={yOf(d.expense)} r="2.5" fill="#ef4444"/>
                </g>
            ))}
        </svg>
    );
};

// ── Summary Card ────────────────────────────────────────────────────────────
const SummaryCard = ({icon, iconBg, iconColor, label, value, unit, sub, noFormat, valueColor}) => (
    <div className={cls.summaryCard}>
        <div className={cls.summaryCardIcon} style={{background: iconBg}}>
            <i className={`fa ${icon}`} style={{color: iconColor}}/>
        </div>
        <div className={cls.summaryCardBody}>
            <span className={cls.summaryCardLabel}>{label}</span>
            <span className={cls.summaryCardValue} style={valueColor ? {color: valueColor} : undefined}>
                {noFormat ? value : fmtNum(value)}
            </span>
            <div className={cls.summaryCardMeta}>
                <span className={cls.summaryCardUnit}>{unit}</span>
                <span className={cls.summaryCardSub}>{sub}</span>
            </div>
        </div>
    </div>
);

// ── Balance Card ─────────────────────────────────────────────────────────────
const BalanceCard = ({icon, iconColor, label, value, sub, valueColor}) => (
    <div className={cls.balanceCard}>
        <div className={cls.balanceCardIconWrap}>
            <i className={`fa ${icon}`} style={{color: iconColor, fontSize: "2rem"}}/>
        </div>
        <div className={cls.balanceCardInfo}>
            <span className={cls.balanceCardLabel}>{label}</span>
            <span className={cls.balanceCardValue} style={valueColor ? {color: valueColor} : undefined}>
                {fmtNum(Math.abs(+(value ?? 0)))}
            </span>
            <span className={cls.balanceCardUnit}>so'm</span>
            <span className={cls.balanceCardSub}>{sub}</span>
        </div>
    </div>
);

// ── Main Page ────────────────────────────────────────────────────────────────
export const FinanceDashboardPage = () => {
    const dispatch = useDispatch();
    const rawData = useSelector(getStatistics);
    const loading = useSelector(getStatisticsLoading);
    const paymentTypes = useSelector(getCapitalTypes);
    const branchId = localStorage.getItem("branchId");
    const ROLE = localStorage.getItem("job");
    const currentBranch = useSelector(getCurrentBranch);
    const branchForFilter = ROLE === "director" ? currentBranch : branchId;

    const now = new Date();
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
    const [activePayment, setActivePayment] = useState();

    const years = Array.from({length: 5}, (_, i) => now.getFullYear() - i);

    useEffect(() => {
        dispatch(getPaymentType());
    }, []);

    useEffect(() => {
        if (paymentTypes?.length) setActivePayment(paymentTypes[0].name);
    }, [paymentTypes]);

    const fromDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-01`;
    const toDate = (() => {
        const last = new Date(selectedYear, selectedMonth + 1, 0).getDate();
        return `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${last}`;
    })();

    useEffect(() => {
        if (activePayment) {
            dispatch(fetchStatistics({
                data: {from_date: fromDate, to_date: toDate, branch: branchForFilter},
                activePayment,
            }));
        }
    }, [fromDate, toDate, activePayment, branchForFilter]);

    const data = useMemo(() => {
        const raw = Array.isArray(rawData) ? rawData[0] : rawData;
        // use demo if API returned nothing or all zeros
        const isEmpty = !raw || (
            !raw.payments?.sum &&
            !raw.teacher_salaries?.sum &&
            !raw.new_students?.count
        );
        return isEmpty ? DEMO_DATA : raw;
    }, [rawData]);

    const stats = useMemo(() => {
        if (!data) return {income: 0, teacherSal: 0, staffSal: 0, overheads: 0, expenses: 0, net: 0, newStudents: 0, newGroups: 0, newLeads: 0};
        const income = data.payments?.sum ?? 0;
        const teacherSal = data.teacher_salaries?.sum ?? 0;
        const staffSal = data.staff_salaries?.sum ?? 0;
        const oh = data.overheads?.sum ?? 0;
        const expenses = teacherSal + staffSal + oh;
        return {
            income,
            teacherSal,
            staffSal,
            overheads: oh,
            expenses,
            net: income - expenses,
            newStudents: data.new_students?.count ?? 0,
            newGroups: data.new_groups?.count ?? 0,
            newLeads: data.new_leads?.count ?? 0,
        };
    }, [data]);

    const chartData = useMemo(() => {
        if (!data) return DEMO_CHART;
        if (data === DEMO_DATA) return DEMO_CHART;
        const byDate = {};
        const add = (items, type) => {
            (items || []).forEach(item => {
                const key = item.date || "";
                if (!byDate[key]) byDate[key] = {date: key, income: 0, expense: 0};
                byDate[key][type] += +(item.amount ?? 0);
            });
        };
        add(data.payments?.data || data.payments?.items, "income");
        add(data.overheads?.data || data.overheads?.items, "expense");
        add(data.teacher_salaries?.data || data.teacher_salaries?.items, "expense");
        add(data.staff_salaries?.data || data.staff_salaries?.items, "expense");
        const result = Object.values(byDate).sort((a, b) => parseDMY(a.date) - parseDMY(b.date));
        return result.length ? result : DEMO_CHART;
    }, [data]);

    const recentExpenses = useMemo(() => {
        if (!data) return [];
        return [
            ...(data.overheads?.data || data.overheads?.items || []).map(i => ({...i, category: i.type_name || "Overhead"})),
            ...(data.teacher_salaries?.data || data.teacher_salaries?.items || []).map(i => ({
                ...i,
                name: `${i.name || ""} ${i.surname || ""}`.trim(),
                category: "O'qituvchi oyligi",
            })),
            ...(data.staff_salaries?.data || data.staff_salaries?.items || []).map(i => ({
                ...i,
                name: `${i.name || ""} ${i.surname || ""}`.trim(),
                category: "Xodim oyligi",
            })),
        ]
            .sort((a, b) => parseDMY(b.date) - parseDMY(a.date))
            .slice(0, 8);
    }, [data]);

    const recentPayments = useMemo(() => {
        if (!data) return [];
        return (data.payments?.data || data.payments?.items || [])
            .sort((a, b) => parseDMY(b.date) - parseDMY(a.date))
            .slice(0, 8);
    }, [data]);

    const newStudentsList = data?.new_students?.data || data?.new_students?.items || [];
    const monthLabel = MONTHS_UZ[selectedMonth];
    const isProfit = stats.net >= 0;

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.page}>

                {/* ── Header ── */}
                <div className={cls.header}>
                    <div className={cls.headerLeft}>
                        <h1 className={cls.pageTitle}>Moliyaviy statistika</h1>
                        <p className={cls.pageSubtitle}>
                            Bugungi sana: {String(now.getDate()).padStart(2, "0")}.{String(now.getMonth() + 1).padStart(2, "0")}.{now.getFullYear()}
                        </p>
                    </div>
                    <div className={cls.headerControls}>
                        {paymentTypes?.map(pt => (
                            <button
                                key={pt.id}
                                className={`${cls.payBtn} ${activePayment === pt.name ? cls.payBtnActive : ""}`}
                                onClick={() => setActivePayment(pt.name)}
                            >
                                {pt.name}
                            </button>
                        ))}
                        <select className={cls.select} value={selectedYear} onChange={e => setSelectedYear(+e.target.value)}>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <select className={cls.select} value={selectedMonth} onChange={e => setSelectedMonth(+e.target.value)}>
                            {MONTHS_UZ.map((m, i) => <option key={i} value={i}>{m}</option>)}
                        </select>
                    </div>
                </div>

                {loading ? <DefaultPageLoader/> : (
                    <>
                        {/* ── 6 Summary Cards ── */}
                        <div className={cls.cardsRow}>
                            <SummaryCard
                                icon="fa-wallet" iconBg="#dbeafe" iconColor="#3b82f6"
                                label="Jami tushum" value={stats.income} unit="so'm" sub={monthLabel}
                            />
                            <SummaryCard
                                icon="fa-calendar-week" iconBg="#e0f2fe" iconColor="#0ea5e9"
                                label="O'quvchi to'lovlari" value={stats.income} unit="so'm"
                                sub={`To'lovlar soni: ${data?.payments?.count ?? 0} ta`}
                            />
                            <SummaryCard
                                icon="fa-chart-bar" iconBg="#f3e8ff" iconColor="#a855f7"
                                label="Oylik xarajatlar" value={stats.expenses} unit="so'm" sub={monthLabel}
                            />
                            <SummaryCard
                                icon="fa-user-plus" iconBg="#fef3c7" iconColor="#f59e0b"
                                label="Yangi o'quvchilar" value={stats.newStudents}
                                unit="ta" sub="Bu oy" noFormat
                            />
                            <SummaryCard
                                icon="fa-arrow-down" iconBg="#fee2e2" iconColor="#ef4444"
                                label="Umumiy xarajatlar" value={stats.expenses} unit="so'm" sub={monthLabel}
                            />
                            <SummaryCard
                                icon={isProfit ? "fa-arrow-up" : "fa-arrow-down"}
                                iconBg={isProfit ? "#dcfce7" : "#fee2e2"}
                                iconColor={isProfit ? "#22c55e" : "#ef4444"}
                                label="Sof foyda / zarar"
                                value={Math.abs(stats.net)} unit="so'm"
                                sub={isProfit ? "Foyda" : "Zarar"}
                                valueColor={isProfit ? "#22c55e" : "#ef4444"}
                            />
                        </div>

                        {/* ── Chart + Balance ── */}
                        <div className={cls.chartRow}>
                            <div className={cls.chartCard}>
                                <div className={cls.chartCardHeader}>
                                    <span className={cls.cardTitle}>Tushum va xarajatlar dinamikasi</span>
                                    <div className={cls.chartLegend}>
                                        <span className={cls.legendItem}>
                                            <span className={cls.legendDot} style={{background: "#10b981"}}/>Tushum
                                        </span>
                                        <span className={cls.legendItem}>
                                            <span className={cls.legendDot} style={{background: "#ef4444"}}/>Xarajat
                                        </span>
                                    </div>
                                </div>
                                <LineChart data={chartData}/>
                            </div>

                            <div className={cls.balanceColumn}>
                                <BalanceCard
                                    icon="fa-wallet" iconColor="#3b82f6"
                                    label="Jami tushum" value={stats.income} sub="To'lovlar"
                                />
                                <BalanceCard
                                    icon="fa-university" iconColor="#6366f1"
                                    label="Jami xarajatlar" value={stats.expenses} sub="Oylik chiqimlar"
                                />
                                <BalanceCard
                                    icon="fa-chart-pie" iconColor={isProfit ? "#10b981" : "#ef4444"}
                                    label="Umumiy balans" value={stats.net}
                                    sub="Tushum − Xarajat"
                                    valueColor={isProfit ? "#10b981" : "#ef4444"}
                                />
                            </div>
                        </div>

                        {/* ── Three Tables ── */}
                        <div className={cls.tablesRow}>

                            {/* New Students */}
                            <div className={cls.tableCard}>
                                <div className={cls.tableCardHeader}>
                                    <span className={cls.cardTitle}>Yangi o'quvchilar</span>
                                    <span className={cls.tableBadge}>{stats.newStudents} ta</span>
                                </div>
                                <table className={cls.table}>
                                    <thead>
                                    <tr>
                                        <th>O'quvchi</th>
                                        <th>Sana</th>
                                        <th>To'lov turi</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {newStudentsList.slice(0, 8).map((s, i) => (
                                        <tr key={i}>
                                            <td>{s.name} {s.surname}</td>
                                            <td>{s.date || "—"}</td>
                                            <td>{s.payment_type || "—"}</td>
                                        </tr>
                                    ))}
                                    {!newStudentsList.length && (
                                        <tr><td colSpan={3} className={cls.emptyCell}>Ma'lumot yo'q</td></tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Recent Expenses */}
                            <div className={cls.tableCard}>
                                <div className={cls.tableCardHeader}>
                                    <span className={cls.cardTitle}>So'nggi xarajatlar</span>
                                    <span className={cls.tableBadge}>
                                        {(data?.overheads?.count ?? 0) + (data?.teacher_salaries?.count ?? 0) + (data?.staff_salaries?.count ?? 0)} ta
                                    </span>
                                </div>
                                <table className={cls.table}>
                                    <thead>
                                    <tr>
                                        <th>Xarajat nomi</th>
                                        <th>Kategoriya</th>
                                        <th>Summa</th>
                                        <th>Sana</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {recentExpenses.map((e, i) => (
                                        <tr key={i}>
                                            <td>{e.name || e.reason || "—"}</td>
                                            <td><span className={cls.badge}>{e.category}</span></td>
                                            <td className={cls.redText}>{fmtNum(e.amount)}</td>
                                            <td>{e.date}</td>
                                        </tr>
                                    ))}
                                    {!recentExpenses.length && (
                                        <tr><td colSpan={4} className={cls.emptyCell}>Ma'lumot yo'q</td></tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Recent Payments */}
                            <div className={cls.tableCard}>
                                <div className={cls.tableCardHeader}>
                                    <span className={cls.cardTitle}>So'nggi to'lovlar</span>
                                    <span className={cls.tableBadge}>{data?.payments?.count ?? 0} ta</span>
                                </div>
                                <table className={cls.table}>
                                    <thead>
                                    <tr>
                                        <th>O'quvchi</th>
                                        <th>Summa</th>
                                        <th>Sana</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {recentPayments.map((p, i) => (
                                        <tr key={i}>
                                            <td>{p.name} {p.surname}</td>
                                            <td className={cls.greenText}>{fmtNum(p.amount)}</td>
                                            <td>{p.date}</td>
                                        </tr>
                                    ))}
                                    {!recentPayments.length && (
                                        <tr><td colSpan={3} className={cls.emptyCell}>Ma'lumot yo'q</td></tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ── Summary Report ── */}
                        <div className={cls.reportCard}>
                            <div className={cls.tableCardHeader}>
                                <span className={cls.cardTitle}>
                                    Umumiy hisobot ({monthLabel} {selectedYear} holatiga)
                                </span>
                            </div>
                            <table className={cls.table}>
                                <thead>
                                <tr>
                                    <th>Kategoriya</th>
                                    <th style={{textAlign: "right"}}>Summa (so'm)</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>O'quvchi to'lovlari (tushum)</td>
                                    <td className={cls.greenText} style={{textAlign: "right"}}>{fmtNum(stats.income)}</td>
                                </tr>
                                <tr>
                                    <td>O'qituvchilar oyligi</td>
                                    <td className={cls.redText} style={{textAlign: "right"}}>{fmtNum(stats.teacherSal)}</td>
                                </tr>
                                <tr>
                                    <td>Xodimlar oyligi</td>
                                    <td className={cls.redText} style={{textAlign: "right"}}>{fmtNum(stats.staffSal)}</td>
                                </tr>
                                <tr>
                                    <td>Qo'shimcha xarajatlar</td>
                                    <td className={cls.redText} style={{textAlign: "right"}}>{fmtNum(stats.overheads)}</td>
                                </tr>
                                <tr className={cls.totalRow}>
                                    <td><strong>Jami xarajatlar</strong></td>
                                    <td className={cls.redText} style={{textAlign: "right"}}><strong>{fmtNum(stats.expenses)}</strong></td>
                                </tr>
                                <tr className={cls.totalRow}>
                                    <td><strong>Sof foyda / zarar</strong></td>
                                    <td style={{textAlign: "right", color: isProfit ? "#22c55e" : "#ef4444"}}>
                                        <strong>{fmtNum(Math.abs(stats.net))} ({isProfit ? "Foyda" : "Zarar"})</strong>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <p className={cls.reportFormula}>
                                Tushum − Xarajatlar = {fmtNum(stats.income)} − {fmtNum(stats.expenses)} = {fmtNum(stats.net)} so'm
                            </p>
                        </div>
                    </>
                )}
            </div>
        </DynamicModuleLoader>
    );
};
