import React, {useState} from 'react';
import {MONTHS, RATING_CATEGORIES, useDirectorDashboard} from 'features/directorDashboard/index.js';
import cls from './directorDashboardPage.module.sass';
import {Button} from "shared/ui/button/index.js";
import {LessonPlanDailyReportPage} from "pages/lessonPlanDailyReportPage/index.js";
import {FinanceDashboardPage} from "pages/financeDashboardPage/index.js";

// ─── Palette for charts ───────────────────────────────────────────────────────
const PIE_COLORS = [
    '#6366f1', '#10b981', '#f59e0b', '#ef4444',
    '#06b6d4', '#a855f7', '#ec4899', '#84cc16',
];

const BRANCH_GRADIENTS = [
    ['#6366f1', '#818cf8'],
    ['#10b981', '#34d399'],
    ['#f59e0b', '#fbbf24'],
    ['#06b6d4', '#38bdf8'],
    ['#a855f7', '#c084fc'],
    ['#ec4899', '#f472b6'],
];

// ─── Pie Chart (SVG) ──────────────────────────────────────────────────────────
const PieChart = ({data, size = 140}) => {
    const total = data.reduce((s, d) => s + (d.count || 0), 0);
    if (!total) return <div className={cls.empty}>Ma'lumot yo'q</div>;

    const cx = size / 2, cy = size / 2, r = size / 2 - 8, inner = r * 0.55;
    let angle = -Math.PI / 2;
    const slices = data.map((d, i) => {
        const pct = d.count / total;
        const start = angle;
        angle += pct * 2 * Math.PI;
        const end = angle;
        const lx1 = cx + r * Math.cos(start), ly1 = cy + r * Math.sin(start);
        const lx2 = cx + r * Math.cos(end), ly2 = cy + r * Math.sin(end);
        const ix1 = cx + inner * Math.cos(start), iy1 = cy + inner * Math.sin(start);
        const ix2 = cx + inner * Math.cos(end), iy2 = cy + inner * Math.sin(end);
        const large = pct > 0.5 ? 1 : 0;
        const path = [
            `M ${ix1} ${iy1}`,
            `L ${lx1} ${ly1}`,
            `A ${r} ${r} 0 ${large} 1 ${lx2} ${ly2}`,
            `L ${ix2} ${iy2}`,
            `A ${inner} ${inner} 0 ${large} 0 ${ix1} ${iy1}`,
            'Z',
        ].join(' ');
        return {path, color: PIE_COLORS[i % PIE_COLORS.length], pct};
    });

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <defs>
                {slices.map((s, i) => (
                    <filter key={i} id={`glow${i}`}>
                        <feGaussianBlur stdDeviation="3" result="blur"/>
                        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                    </filter>
                ))}
            </defs>
            {slices.map((s, i) => (
                <path
                    key={i}
                    d={s.path}
                    fill={s.color}
                    opacity={0.9}
                    style={{transition: 'opacity 0.2s'}}
                    onMouseEnter={e => (e.target.style.opacity = 1)}
                    onMouseLeave={e => (e.target.style.opacity = 0.9)}
                />
            ))}
            <circle cx={cx} cy={cy} r={inner - 4} fill="#ffffff"/>
            <text x={cx} y={cy - 6} textAnchor="middle" fill="#0f172a" fontSize="18" fontWeight="800"
                  fontFamily="Inter">
                {total}
            </text>
            <text x={cx} y={cy + 12} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="Inter">
                jami
            </text>
        </svg>
    );
};

// ─── Bar Chart ────────────────────────────────────────────────────────────────
const BarChart = ({data}) => {
    const maxVal = Math.max(1, ...data.flatMap(d => [d.joined || 0, d.left || 0]));
    const totalJoined = data.reduce((s, d) => s + (d.joined || 0), 0);
    const totalLeft = data.reduce((s, d) => s + (d.left || 0), 0);
    const dayLabels = data.map((_, i) => i + 1);

    return (
        <div className={cls.dynamicsChart}>
            <div className={cls.dynamicsSummary}>
                <div className={cls.dynamicsStat}>
                    <div className={cls.dynamicsStatDot} style={{background: '#10b981'}}/>
                    <span className={cls.dynamicsStatLabel}>Keldi</span>
                    <span className={cls.dynamicsStatValue}>{totalJoined}</span>
                </div>
                <div className={cls.dynamicsStat}>
                    <div className={cls.dynamicsStatDot} style={{background: '#ef4444'}}/>
                    <span className={cls.dynamicsStatLabel}>Ketdi</span>
                    <span className={cls.dynamicsStatValue}>{totalLeft}</span>
                </div>
                <div className={cls.dynamicsStat}>
                    <div className={cls.dynamicsStatDot} style={{background: '#6366f1'}}/>
                    <span className={cls.dynamicsStatLabel}>Balans</span>
                    <span className={cls.dynamicsStatValue}
                          style={{color: totalJoined - totalLeft >= 0 ? '#10b981' : '#ef4444'}}>
                        {totalJoined - totalLeft >= 0 ? '+' : ''}{totalJoined - totalLeft}
                    </span>
                </div>
            </div>
            <div className={cls.barsContainer}>
                {data.map((d, i) => (
                    <div key={i} className={cls.barGroup} title={`Kun ${i + 1}: +${d.joined || 0} / -${d.left || 0}`}>
                        <div className={cls.barWrapper}>
                            <div
                                className={`${cls.bar} ${cls.barJoined}`}
                                style={{height: `${((d.joined || 0) / maxVal) * 100}%`}}
                            />
                        </div>
                        <div className={cls.barWrapper}>
                            <div
                                className={`${cls.bar} ${cls.barLeft}`}
                                style={{height: `${((d.left || 0) / maxVal) * 100}%`}}
                            />
                        </div>
                    </div>
                ))}
            </div>
            {data.length > 0 && (
                <div style={{display: 'flex', justifyContent: 'space-between', padding: '0 4px'}}>
                    {[1, Math.ceil(data.length / 3), Math.ceil((2 * data.length) / 3), data.length].map(d => (
                        <span key={d} style={{fontSize: 10, color: '#64748b'}}>{d}</span>
                    ))}
                </div>
            )}
            <div className={cls.barsLegend}>
                <div className={cls.legendItem}>
                    <div className={cls.legendDot} style={{background: '#10b981'}}/>
                    Kelgan o'quvchilar
                </div>
                <div className={cls.legendItem}>
                    <div className={cls.legendDot} style={{background: '#ef4444'}}/>
                    Ketgan o'quvchilar
                </div>
            </div>
        </div>
    );
};

// ─── Ring SVG ─────────────────────────────────────────────────────────────────
const Ring = ({pct = 0, color = '#6366f1', size = 64}) => {
    const r = (size - 8) / 2;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    return (
        <svg width={size} height={size} style={{transform: 'rotate(-90deg)'}}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="5"/>
            <circle
                cx={size / 2} cy={size / 2} r={r}
                fill="none"
                stroke={color}
                strokeWidth="5"
                strokeDasharray={`${dash} ${circ}`}
                strokeLinecap="round"
                style={{transition: 'stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)'}}
            />
        </svg>
    );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonRows = ({n = 5}) =>
    Array.from({length: n}).map((_, i) => (
        <div
            key={i}
            className={cls.skeleton}
            style={{height: 36, marginBottom: 8, opacity: 1 - i * 0.12}}
        />
    ));

// ─── Fallback demo data (when API not available) ──────────────────────────────
const DEMO_TEACHER_RATINGS = [
    {teacher__name: "Ma'lumot topilmadi",}
];

const DEMO_DYNAMICS = Array.from({length: 30}, (_, i) => ({
    day: i + 1,
    joined: Math.floor(Math.random() * 8) + 1,
    left: Math.floor(Math.random() * 4),
}));

const DEMO_LEFT = [
    {reason: "Narx yuqori", count: 42},
    {reason: "Vaqt mos emas", count: 28},
    {reason: "Boshqa markaz", count: 19},
    {reason: "Ko'chib ketdi", count: 11},
];

const DEMO_BRANCHES = [
    {name: "Chilonzor", students: 312, percentage: 34},
    {name: "Yunusobod", students: 278, percentage: 30},
    {name: "Mirzo-Ulug'bek", students: 198, percentage: 21},
    {name: "Yakkasaray", students: 137, percentage: 15},
];

const DEMO_ACHIEVEMENT = {
    total_enrolled_year: 1200,
    levels: [
        {label: "Yuqori daraja", count: 360, color: '#10b981'},
        {label: "O'rta daraja", count: 480, color: '#6366f1'},
        {label: "Boshlang'ich", count: 240, color: '#f59e0b'},
        {label: "Chiqib ketdi", count: 120, color: '#ef4444'},
    ],
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export const DirectorDashboardPage = () => {
    const {
        selectedMonth, setSelectedMonth,
        selectedYear, setSelectedYear,
        teacherRatings, teacherRatingsLoading,
        studentDynamics, dynamicsLoading,
        leftStudentsAnalysis, leftLoading,
        branchAnalysis, branchLoading,
        achievementShare, achievementLoading,
        selectedRatingCategory, setSelectedRatingCategory
    } = useDirectorDashboard();

    const currentYear = new Date().getFullYear();
    const years = Array.from({length: 5}, (_, i) => currentYear - i);
    const job = localStorage.getItem("job");
    const [buttonActive, setButtonActive] = useState(job === "accountant" ? "Moliyaviy statistika" : job === "spiritualist" ? "Kunlik Dars Rejasi Hisoboti" : "Dashboard");
    // Use real data or demo fallback
    const ratings = teacherRatings?.length ? teacherRatings : DEMO_TEACHER_RATINGS;
    const dynamics = studentDynamics?.length ? studentDynamics : DEMO_DYNAMICS;
    const leftData = leftStudentsAnalysis?.length ? leftStudentsAnalysis : DEMO_LEFT;
    const branches = branchAnalysis?.length ? branchAnalysis : DEMO_BRANCHES;
    const achieve = achievementShare || DEMO_ACHIEVEMENT;

    const maxBall = Math.max(1, ...ratings.map(r => r.ball || r.score || 0));
    const leftTotal = leftData.reduce((s, d) => s + (d.count || 0), 0);

    const monthLabel = MONTHS.find(m => m.value === selectedMonth)?.label;



    return (
        <div className={cls.page}>
            <div style={{display: "flex"}}>
                {job === "spiritualist" || job === "accountant" ? "" : <Button onClick={() => setButtonActive("Dashboard")}>Dashboard</Button>}
                {job === "spiritualist" ? "" :
                    <Button onClick={() => setButtonActive("Moliyaviy statistika")}>Moliyaviy statistika</Button>
                }
                {job === "accountant" ? "" :
                <Button onClick={() => setButtonActive("Kunlik Dars Rejasi Hisoboti")}>Kunlik Dars Rejasi
                    Hisoboti</Button>}
            </div>


            {buttonActive === "Dashboard" && (
                <>
                    {/* ── Header ──────────────────────────────────────────────────── */}
                    <div className={cls.header}>
                        <div className={cls.headerLeft}>
                            <h1 className={cls.pageTitle}>📊 Direktor Paneli</h1>
                            <p className={cls.pageSubtitle}>
                                {monthLabel} {selectedYear} — umumiy tahlil
                            </p>
                        </div>

                        {/* Month / Year selector */}
                        <div className={cls.monthFilter}>
                            <select
                                className={cls.yearSelect}
                                value={selectedYear}
                                onChange={e => setSelectedYear(+e.target.value)}
                            >
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <div className={cls.filterDivider}/>
                            <select
                                className={cls.monthSelect}
                                value={selectedMonth}
                                onChange={e => setSelectedMonth(+e.target.value)}
                            >
                                {MONTHS.map(m => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* ── Row 1: Teacher Ratings + Student Dynamics ──────────────── */}
                    <div className={cls.gridTwoThirds}>

                        {/* 3. O'qituvchilar reytingi */}
                        <div style={{width: "203%"}} className={cls.card}>
                            <div className={cls.cardHeader}>
                                <h2 className={cls.cardTitle}>🏆 O'qituvchilar reytingi</h2>
                                <select
                                    className={cls.cardBadge}
                                    value={selectedRatingCategory}
                                    onChange={e => setSelectedRatingCategory(e.target.value)}
                                >
                                    {RATING_CATEGORIES.map(m => (
                                        <option key={m.value} value={m.value}>{m.label}</option>
                                    ))}
                                </select>
                            </div>
                            {teacherRatingsLoading ? <SkeletonRows n={5}/> : (
                                ratings.length === 0
                                    ? <div className={cls.empty}>Ma'lumot yo'q</div>
                                    : ratings.map((r, i) => {
                                        const name = r.teacher__name || r.name || `O'qituvchi ${i + 1}`;
                                        const score = r.ball || r.score || 0;
                                        const pct = (score / maxBall) * 100;
                                        const rankCls = i === 0 ? cls.rankGold : i === 1 ? cls.rankSilver : i === 2 ? cls.rankBronze : cls.rankDefault;
                                        return (
                                            <div key={i} className={cls.ratingRow}>
                                                <div className={`${cls.rank} ${rankCls}`}>
                                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                                                </div>
                                                <span className={cls.teacherName}>{name}</span>
                                                <div className={cls.scoreBar}>
                                                    <div className={cls.scoreBarFill} style={{width: `${pct}%`}}/>
                                                </div>
                                                <span className={cls.scoreValue}>{score}</span>
                                            </div>
                                        );
                                    })
                            )}
                        </div>

                        {/* 4. O'quvchilar kirish/chiqish dinamikasi */}
                        {/*<div className={cls.card}>*/}
                        {/*    <div className={cls.cardHeader}>*/}
                        {/*        <h2 className={cls.cardTitle}>📈 Kirish / Chiqish dinamikasi</h2>*/}
                        {/*        <span className={cls.cardBadge}>{monthLabel}</span>*/}
                        {/*    </div>*/}
                        {/*    {dynamicsLoading*/}
                        {/*        ? <div className={cls.skeleton} style={{ height: 160 }} />*/}
                        {/*        : <BarChart data={dynamics} />*/}
                        {/*    }*/}
                        {/*</div>*/}
                    </div>

                    {/* ── Row 2: Left Students Pie + Branch Analysis ─────────────── */}
                    <div className={cls.gridTwoThirds}>

                        {/* 5. Ketgan o'quvchilar tahlili */}
                        <div className={cls.card}>
                            <div className={cls.cardHeader}>
                                <h2 className={cls.cardTitle}>🔴 Ketgan o'quvchilar tahlili</h2>
                                <span className={cls.cardBadge}>{leftTotal} ta</span>
                            </div>
                            {leftLoading ? <SkeletonRows n={4}/> : (
                                leftData.length === 0
                                    ? <div className={cls.empty}>Hech kim ketmagan 🎉</div>
                                    : (
                                        <div className={cls.pieContainer}>
                                            <div className={cls.pieSvgWrap}>
                                                <PieChart data={leftData} size={150}/>
                                            </div>
                                            <div className={cls.pieLabels}>
                                                {leftData.map((d, i) => {
                                                    const pct = leftTotal ? Math.round((d.count / leftTotal) * 100) : 0;
                                                    return (
                                                        <div key={i} className={cls.pieLabel}>
                                                            <div
                                                                className={cls.pieLabelDot}
                                                                style={{background: PIE_COLORS[i % PIE_COLORS.length]}}
                                                            />
                                                            <span
                                                                className={cls.pieLabelText}>{d.reason || d.label || `Sabab ${i + 1}`}</span>
                                                            <span className={cls.pieLabelValue}>{d.count}</span>
                                                            <span className={cls.pieLabelPercent}>{pct}%</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )
                            )}
                        </div>

                        {/* 6. Filial tahlili */}
                        <div className={cls.card}>
                            <div className={cls.cardHeader}>
                                <h2 className={cls.cardTitle}>🏢 Filial tahlili</h2>
                                <span className={cls.cardBadge}>tez kunda</span>
                            </div>
                            <div className={cls.comingSoon}>
                                <span className={cls.comingSoonIcon}>🔧</span>
                                <span className={cls.comingSoonText}>Bu bo'lim ustida ish olib borilmoqa</span>
                            </div>
                        </div>
                    </div>

                    <div className={cls.gridFull}>
                        <div className={cls.card}>
                            <div className={cls.cardHeader}>
                                <h2 className={cls.cardTitle}>🎯 O'quvchilar natijalari ulushi (yillik)</h2>
                                <span className={cls.cardBadge}>tez kunda</span>
                            </div>
                            <div className={cls.comingSoon}>
                                <span className={cls.comingSoonIcon}>🔧</span>
                                <span className={cls.comingSoonText}>Bu bo'lim ustida ish olib borilmoqa</span>
                            </div>
                        </div>
                    </div>
                </>

            )}

            {buttonActive === "Kunlik Dars Rejasi Hisoboti" && (
                <LessonPlanDailyReportPage/>
            )}
            {buttonActive === "Moliyaviy statistika" && (
                <FinanceDashboardPage/>
            )}

        </div>
    );
};



