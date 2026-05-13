import React, { useEffect, useState } from 'react';
import cls from './observationShowPage.module.sass';
import { API_URL, headers, useHttp } from 'shared/api/base.js';

export const ObservationShowPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(new Set());
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [scoreFilter, setScoreFilter] = useState('all');
    const [sortCol, setSortCol] = useState(null);
    const [sortDir, setSortDir] = useState(1);
    const [cycle, setCycle] = useState([]);
    const [cycleId, setCycleId] = useState(null);

    const branchId = localStorage.getItem('branchId');
    const { request } = useHttp();

    useEffect(() => {
        request(`${API_URL}Observation/schedule/cycles/?branch_id=${branchId}`, 'GET', null, headers())
            .then(res => {
                setCycle(res);
                setCycleId(res[0]?.id ?? null);
            });
    }, []);

    useEffect(() => {
        if (!cycleId) return;
        setLoading(true);
        fetch(`${API_URL}Observation/observation/weekly/?cycle=${cycleId}&branch=${branchId}`, {
            method: 'GET',
            headers: headers(),
        })
            .then(res => res.json())
            .then(json => { setData(json); setLoading(false); })
            .catch(() => setLoading(false));
    }, [cycleId]);

    if (loading) return <div className={cls.loading}><span className={cls.spinner} />Yuklanmoqda...</div>;
    if (!data) return <div className={cls.error}>Ma'lumot topilmadi</div>;

    const teachers = data.teachers || [];

    const getStatus = t => {
        if (t.completed_count === 0) return 'none';
        if (t.completed_count >= t.total_observers_required) return 'done';
        return 'pending';
    };

    const scoreColor = s => {
        if (s === null) return 'var(--score-null)';
        if (s >= 4) return 'var(--score-high)';
        if (s >= 3) return 'var(--score-mid)';
        if (s >= 2) return 'var(--score-low)';
        return 'var(--score-fail)';
    };

    const filtered = teachers.filter(t => {
        if (search && !t.teacher_name.toLowerCase().includes(search.toLowerCase())) return false;
        const st = getStatus(t);
        if (statusFilter !== 'all' && st !== statusFilter) return false;
        if (scoreFilter !== 'all') {
            if (scoreFilter === 'null' && t.weekly_avg_score !== null) return false;
            if (scoreFilter !== 'null' && t.weekly_avg_score !== parseFloat(scoreFilter)) return false;
        }
        return true;
    });

    const sorted = [...filtered].sort((a, b) => {
        if (!sortCol) return 0;
        let av, bv;
        if (sortCol === 'name') { av = a.teacher_name; bv = b.teacher_name; }
        else if (sortCol === 'completed') { av = a.completed_count; bv = b.completed_count; }
        else if (sortCol === 'pending') { av = a.pending_count; bv = b.pending_count; }
        else if (sortCol === 'score') { av = a.weekly_avg_score ?? -1; bv = b.weekly_avg_score ?? -1; }
        if (typeof av === 'string') return sortDir * av.localeCompare(bv);
        return sortDir * (av - bv);
    });

    const handleSort = col => {
        if (sortCol === col) setSortDir(d => d * -1);
        else { setSortCol(col); setSortDir(1); }
    };

    const toggleExpand = id => {
        setExpanded(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const withScore = teachers.filter(t => t.weekly_avg_score !== null);
    const avgScore = withScore.length
        ? (withScore.reduce((s, t) => s + t.weekly_avg_score, 0) / withScore.length).toFixed(1)
        : '—';
    const totalObs = teachers.reduce((s, t) => s + t.completed_count, 0);
    const started = teachers.filter(t => t.completed_count > 0).length;

    const sortArrow = col => sortCol === col ? (sortDir === 1 ? ' ↑' : ' ↓') : '';

    const statusLabel = st =>
        st === 'done' ? 'Tugallangan' : st === 'pending' ? 'Jarayonda' : 'Boshlanmagan';

    return (
        <div className={cls.main}>

            {/* Cycle info bar */}
            <div className={cls.cycleBar}>
                <span className={cls.cyclePill}>
                    Tsikl <strong>#{data.cycle_id}</strong>
                </span>
                <span className={cls.cyclePill}>{data.start_date} – {data.end_date}</span>
                <span className={cls.cyclePill}>
                    Filial <strong>#{data.branch_id}</strong>
                </span>
            </div>

            {/* Summary metrics */}
            <div className={cls.summary}>
                {[
                    { label: "Jami o'qituvchilar", value: teachers.length },
                    { label: 'Boshlagan', value: started },
                    { label: 'Jami kuzatuvlar', value: totalObs },
                    { label: "O'rtacha ball", value: avgScore },
                ].map(m => (
                    <div key={m.label} className={cls.metric}>
                        <div className={cls.metricLabel}>{m.label}</div>
                        <div className={cls.metricValue}>{m.value}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className={cls.filters}>
                <input
                    type="text"
                    placeholder="O'qituvchi nomi bo'yicha qidirish..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className={cls.searchInput}
                />
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className={cls.select}
                >
                    <option value="all">Barcha holat</option>
                    <option value="done">Tugallangan</option>
                    <option value="pending">Jarayonda</option>
                    <option value="none">Boshlanmagan</option>
                </select>
                <select
                    value={scoreFilter}
                    onChange={e => setScoreFilter(e.target.value)}
                    className={cls.select}
                >
                    <option value="all">Barcha ball</option>
                    <option value="4">Ball: 4</option>
                    <option value="3">Ball: 3</option>
                    <option value="2">Ball: 2</option>
                    <option value="1">Ball: 1</option>
                    <option value="null">Ball yo'q</option>
                </select>
                <select
                    value={cycleId ?? ''}
                    onChange={e => setCycleId(Number(e.target.value))}
                    className={cls.select}
                >
                    {cycle.map(item => (
                        <option key={item.id} value={item.id}>{item.start_date}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className={cls.tableWrap}>
                <table className={cls.table}>
                    <thead>
                    <tr>
                        <th className={cls.thToggle} />
                        <th className={cls.sortable} onClick={() => handleSort('name')}>
                            O'qituvchi{sortArrow('name')}
                        </th>
                        <th className={cls.sortable} onClick={() => handleSort('completed')}>
                            Bajarildi{sortArrow('completed')}
                        </th>
                        <th className={cls.sortable} onClick={() => handleSort('pending')}>
                            Kutilmoqda{sortArrow('pending')}
                        </th>
                        <th>Jarayon</th>
                        <th className={cls.sortable} onClick={() => handleSort('score')}>
                            O'rt. ball{sortArrow('score')}
                        </th>
                        <th>Holat</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sorted.length === 0 && (
                        <tr>
                            <td colSpan={7} className={cls.emptyCell}>
                                Hech narsa topilmadi
                            </td>
                        </tr>
                    )}
                    {sorted.map(t => {
                        const pct = t.total_observers_required > 0
                            ? Math.round((t.completed_count / t.total_observers_required) * 100)
                            : 0;
                        const st = getStatus(t);
                        const sc = t.weekly_avg_score;
                        const isExp = expanded.has(t.teacher_id);
                        const allObs = t.observers || [];
                        const completedObs = allObs.filter(o => o.is_completed);
                        const pendingObs = allObs.filter(o => !o.is_completed);

                        return (
                            <React.Fragment key={t.teacher_id}>
                                <tr
                                    className={cls.row}
                                    onClick={() => toggleExpand(t.teacher_id)}
                                >
                                    <td>
                                        <div className={cls.expandBtn}>
                                            {isExp ? '▲' : '▼'}
                                        </div>
                                    </td>
                                    <td className={cls.teacherName}>{t.teacher_name}</td>
                                    <td>{t.completed_count} / {t.total_observers_required}</td>
                                    <td>{t.pending_count}</td>
                                    <td>
                                        <div className={cls.progressWrap}>
                                            <div className={cls.progressBar}>
                                                <div
                                                    className={cls.progressFill}
                                                    style={{
                                                        width: `${pct}%`,
                                                        background: scoreColor(sc),
                                                    }}
                                                />
                                            </div>
                                            <span className={cls.pct}>{pct}%</span>
                                        </div>
                                    </td>
                                    <td>
                                            <span
                                                className={cls.score}
                                                style={{ color: scoreColor(sc) }}
                                            >
                                                {sc !== null ? sc.toFixed(1) : '—'}
                                            </span>
                                    </td>
                                    <td>
                                            <span className={`${cls.badge} ${cls[`badge_${st}`]}`}>
                                                {statusLabel(st)}
                                            </span>
                                    </td>
                                </tr>

                                {isExp && (
                                    <tr className={cls.detailRow}>
                                        <td colSpan={7}>
                                            <div className={cls.detailInner}>
                                                {allObs.length === 0 && (
                                                    <span className={cls.noObs}>
                                                            Kuzatuvlar ma'lumoti mavjud emas
                                                        </span>
                                                )}
                                                {completedObs.map(o => (
                                                    <span key={o.observer_id} className={`${cls.obsChip} ${cls.obsChipDone}`}>
                                                            <span className={cls.obsDot} />
                                                        {o.observer_name}
                                                        {o.observation_avg !== null
                                                            ? ` · ${o.observation_avg.toFixed(1)}`
                                                            : ''}
                                                        </span>
                                                ))}
                                                {pendingObs.map(o => (
                                                    <span key={o.observer_id} className={`${cls.obsChip} ${cls.obsChipPending}`}>
                                                            <span className={cls.obsDot} />
                                                        {o.observer_name}
                                                        </span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};