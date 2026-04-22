import React, { useState, useMemo, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import { Select } from 'shared/ui/select/index.js';
import cls from './Statistics.module.sass';
import { getSubjectsSummary, getStudentRankings, getSubjectDynamics } from './performanceUtils';

export const Statistics = ({ data, onBack }) => {

    // 📊 DATA
    const subjectsSummary = useMemo(() => getSubjectsSummary(data) || [], [data]);
    const studentRankings = useMemo(() => getStudentRankings(data) || [], [data]);

    // 🟢 default subject set (data kelgandan keyin)
    const [selectedSubject, setSelectedSubject] = useState('');

    useEffect(() => {
        if (subjectsSummary.length > 0) {
            setSelectedSubject(subjectsSummary[0].name);
        }
    }, [subjectsSummary]);

    // 📈 dynamics
    const dynamicsData = useMemo(() =>
            getSubjectDynamics(data, selectedSubject) || [],
        [data, selectedSubject]
    );

    // 📊 SORT (IMMUTABLE FIX)
    const sortedSubjects = useMemo(() => {
        return [...subjectsSummary].sort((a, b) => b?.average - a?.average);
    }, [subjectsSummary]);

    // 🎯 SELECT OPTIONS FIX
    const subjectOptions = useMemo(() => {
        return subjectsSummary.map(s => ({
            value: s.name,
            label: s.name
        }));
    }, [subjectsSummary]);

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28'];

    return (
        <div className={cls.statsContainer}>

            {/* HEADER */}
            <div className={cls.header}>
                <button className={cls.backBtn} onClick={onBack}>← Ortga</button>
                <h2 className={cls.pageTitle}>Sinf statistikasi</h2>
            </div>

            <div className={cls.grid}>

                {/* 1. SUBJECT RANKING */}
                <section className={cls.section}>
                    <h2 className={cls.sectionTitle}>Fanlar reytingi (O'rtacha ball)</h2>

                    <div className={cls.chartWrapper}>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={sortedSubjects}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />

                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        color: '#1e293b'
                                    }}
                                />

                                <Bar dataKey="average" radius={[6, 6, 0, 0]}>
                                    {sortedSubjects.map((entry, index) => (
                                        <Cell key={index} fill={colors[index % colors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* 2. STUDENT RANKING */}
                <section className={cls.section}>
                    <h2 className={cls.sectionTitle}>O'quvchilar reytingi (Mean Average)</h2>

                    <div className={cls.rankingTableWrapper}>
                        <table className={cls.rankingTable}>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>O'quvchi</th>
                                <th style={{ textAlign: 'right' }}>O'rtacha</th>
                            </tr>
                            </thead>

                            <tbody>
                            {studentRankings.map((student, index) => (
                                <tr key={student.id} className={index < 3 ? cls.topStudent : ''}>
                                    <td className={cls.rank}>
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                                    </td>
                                    <td className={cls.name}>{student.name}</td>
                                    <td className={cls.score}>{student.average.toFixed(2)}%</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 3. DYNAMICS */}
                <section className={`${cls.section} ${cls.fullWidth}`}>

                    <div className={cls.sectionHeader}>
                        <h2 className={cls.sectionTitle}>O'sish dinamikasi</h2>

                        <div className={cls.filter}>
                            <Select
                                value={selectedSubject}
                                onChangeOption={setSelectedSubject}
                                options={subjectsSummary}
                            />
                        </div>
                    </div>

                    <div className={cls.chartWrapper}>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={dynamicsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis stroke="#64748b" />

                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        color: '#1e293b'
                                    }}
                                />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    name="O'rtacha ball (%)"
                                    stroke="#10b981"
                                    strokeWidth={4}
                                    dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </section>

            </div>
        </div>
    );
};