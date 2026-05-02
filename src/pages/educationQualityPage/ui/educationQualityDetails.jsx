import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
    fetchEducationQualityStatistics,
    fetchTermsList,
    setSelectedTerm,
    setSelectedSubject,
    setSelectedClass,
    setSelectedTeacher,
    clearFilters,
    selectEducationQualityLoading,
    selectEducationQualityTermInfo,
    selectEducationQualityChartData,
    selectEducationQualityTerms,
    selectEducationQualitySubjects,
    selectEducationQualityClasses,
    selectEducationQualityTeachers,
    selectEducationQualitySelectedTerm,
    selectEducationQualitySelectedSubject,
    selectEducationQualitySelectedClass,
    selectEducationQualitySelectedTeacher,
} from 'entities/educationQuality';
import { fetchClassSubjects, getClassesForClassTypes } from 'entities/class/model/thunk/classThunk';
import { fetchTeachersData } from 'entities/teachers/model/teacherThunk';
import cls from './educationQualityDetails.module.sass';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7', '#ec4899', '#84cc16'];

export const EducationQualityDetails = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    // User branch ID
    const userBranchId = localStorage.getItem("branchId");

    const loading = useSelector(selectEducationQualityLoading);
    const termInfo = useSelector(selectEducationQualityTermInfo);
    const chartData = useSelector(selectEducationQualityChartData);
    const terms = useSelector(selectEducationQualityTerms);
    const subjects = useSelector(selectEducationQualitySubjects);
    const allClasses = useSelector(selectEducationQualityClasses);
    const allTeachers = useSelector(selectEducationQualityTeachers);
    const selectedTerm = useSelector(selectEducationQualitySelectedTerm);
    const selectedSubject = useSelector(selectEducationQualitySelectedSubject);
    const selectedClass = useSelector(selectEducationQualitySelectedClass);
    const selectedTeacher = useSelector(selectEducationQualitySelectedTeacher);

    useEffect(() => {
        dispatch(fetchTermsList());
        dispatch(fetchClassSubjects());
        if (userBranchId) {
            dispatch(fetchTeachersData({ userBranchId }));
            dispatch(getClassesForClassTypes({ branchId: userBranchId, id: 1 }));
        }
    }, [dispatch, userBranchId]);

    useEffect(() => {
        if (selectedTerm) {
            dispatch(fetchEducationQualityStatistics({
                termId: selectedTerm,
                subjectId: selectedSubject,
                classId: selectedClass,
                teacherId: selectedTeacher,
                branchId: userBranchId
            }));
        }
    }, [dispatch, selectedTerm, selectedSubject, selectedClass, selectedTeacher]);

    // Filter classes by selected subject
    const filteredClasses = useMemo(() => {
        if (!selectedSubject || !allClasses) return [];

        const filtered = allClasses.filter(classItem => {
            // Check if class has the selected subject
            if (classItem.subjects && Array.isArray(classItem.subjects)) {
                const hasSubject = classItem.subjects.some(subj =>
                    subj.subject_id === parseInt(selectedSubject) || subj.subject_name === parseInt(selectedSubject)
                );
                return hasSubject;
            }
            // Alternative: if subjects is stored differently
            if (classItem.subject_ids && Array.isArray(classItem.subject_ids)) {
                const hasSubject = classItem.subject_ids.includes(parseInt(selectedSubject));
                return hasSubject;
            }
            return false;
        });

        return filtered;
    }, [selectedSubject, allClasses]);

    // Filter teachers by selected subject
    const filteredTeachers = useMemo(() => {
        if (!selectedSubject || !allTeachers) return [];

        const filtered = allTeachers.filter(teacher => {
            // Check if teacher teaches the selected subject
            if (teacher.subject && Array.isArray(teacher.subject)) {
                const hasSubject = teacher.subject.some(subj =>
                    subj.id === parseInt(selectedSubject) || subj === parseInt(selectedSubject)
                );
                return hasSubject;
            }
            // Alternative: if subject is stored as single value
            if (teacher.subject) {
                const hasSubject = teacher.subject === parseInt(selectedSubject) || teacher.subject.id === parseInt(selectedSubject);
                return hasSubject;
            }
            // Alternative: if subject_ids array exists
            if (teacher.subject && Array.isArray(teacher.subject)) {
                const hasSubject = teacher.subject.includes(parseInt(selectedSubject));
                return hasSubject;
            }
            return false;
        });

        return filtered;
    }, [selectedSubject, allTeachers]);

    const handleFilterChange = (filterType, value) => {
        const newParams = new URLSearchParams(searchParams);

        if (filterType === 'term') {
            dispatch(setSelectedTerm(value));
            newParams.set('term_id', value);
        } else if (filterType === 'subject') {
            dispatch(setSelectedSubject(value || null));
            if (value) newParams.set('subject_id', value);
            else newParams.delete('subject_id');
            newParams.delete('class_id');
            newParams.delete('teacher_id');
        } else if (filterType === 'class') {
            dispatch(setSelectedClass(value || null));
            if (value) newParams.set('class_id', value);
            else newParams.delete('class_id');
        } else if (filterType === 'teacher') {
            dispatch(setSelectedTeacher(value || null));
            if (value) newParams.set('teacher_id', value);
            else newParams.delete('teacher_id');
        }

        setSearchParams(newParams);
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
        setSearchParams({ term_id: selectedTerm });
    };

    const getChartTitle = () => {
        if (selectedTeacher) return "O'qituvchi bo'yicha natijalar";
        if (selectedSubject) return "Sinflar bo'yicha natijalar";
        return "Fanlar bo'yicha natijalar";
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className={cls.tooltip}>
                    <p className={cls.tooltipLabel}>{payload[0].payload.label}</p>
                    <p className={cls.tooltipValue}>
                        <span className={cls.tooltipDot} style={{ background: payload[0].fill }} />
                        Reyting: <strong>{payload[0].value.toFixed(2)}</strong>
                    </p>
                </div>
            );
        }
        return null;
    };

    // Display classes and teachers based on subject selection
    const displayClasses = selectedSubject ? filteredClasses : allClasses || [];
    const displayTeachers = selectedSubject ? filteredTeachers : allTeachers || [];

    return (
        <div className={cls.container}>
            <div className={cls.header}>
                <div>
                    <h1 className={cls.title}>Ta'lim Sifati - Batafsil</h1>
                    {termInfo && (
                        <p className={cls.subtitle}>
                            {termInfo.quarter}-chorak | {termInfo.academic_year} o'quv yili
                        </p>
                    )}
                </div>
            </div>

            <div className={cls.filtersCard}>
                <div className={cls.filtersHeader}>
                    <h3 className={cls.filtersTitle}>Filterlar</h3>
                    {(selectedSubject || selectedClass || selectedTeacher) && (
                        <button className={cls.clearBtn} onClick={handleClearFilters}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Tozalash
                        </button>
                    )}
                </div>

                <div className={cls.filtersGrid}>
                    <div className={cls.filterGroup}>
                        <label className={cls.filterLabel}>Chorak</label>
                        <select
                            className={cls.filterSelect}
                            value={selectedTerm || ''}
                            onChange={(e) => handleFilterChange('term', e.target.value)}
                        >
                            {terms.map(term => (
                                <option key={term.id} value={term.id}>
                                    {term.quarter}-chorak ({term.start_date} - {term.end_date})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={cls.filterGroup}>
                        <label className={cls.filterLabel}>Fan</label>
                        <select
                            className={cls.filterSelect}
                            value={selectedSubject || ''}
                            onChange={(e) => handleFilterChange('subject', e.target.value)}
                        >
                            <option value="">Barcha fanlar</option>
                            {subjects.map(subject => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={cls.filterGroup}>
                        <label className={cls.filterLabel}>
                            Sinf {selectedSubject && `(${displayClasses.length})`}
                        </label>
                        <select
                            className={cls.filterSelect}
                            value={selectedClass || ''}
                            onChange={(e) => handleFilterChange('class', e.target.value)}
                            disabled={!selectedSubject}
                        >
                            <option value="">
                                {selectedSubject
                                    ? `Barcha sinflar (${displayClasses.length})`
                                    : 'Avval fan tanlang'}
                            </option>
                            {displayClasses.map(classItem => (
                                <option key={classItem.id} value={classItem.id}>
                                    {classItem.class_number || classItem.class_name}-{classItem.color}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={cls.filterGroup}>
                        <label className={cls.filterLabel}>
                            O'qituvchi {selectedSubject && `(${displayTeachers.length})`}
                        </label>
                        <select
                            className={cls.filterSelect}
                            value={selectedTeacher || ''}
                            onChange={(e) => handleFilterChange('teacher', e.target.value)}
                        >
                            <option value="">
                                {selectedSubject
                                    ? `Barcha o'qituvchilar (${displayTeachers.length})`
                                    : "Barcha o'qituvchilar"}
                            </option>
                            {displayTeachers.map(teacher => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.user?.name || teacher.name || `${teacher.user?.surname || ''} ${teacher.user?.name || ''}`}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className={cls.loaderWrapper}>
                    <div className={cls.spinner}></div>
                </div>
            ) : chartData && chartData.data && chartData.data.length > 0 ? (
                <div className={cls.chartCard}>
                    <div className={cls.chartHeader}>
                        <h3 className={cls.chartTitle}>{getChartTitle()}</h3>
                        <div className={cls.chartLegend}>
                            <div className={cls.legendItem}>
                                <div className={cls.legendDot} style={{ background: '#6366f1' }} />
                                <span>O'rtacha reyting</span>
                            </div>
                        </div>
                    </div>

                    <div className={cls.chartWrapper}>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                data={chartData.data}
                                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                            >
                                <defs>
                                    {chartData.data.map((_, index) => (
                                        <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.9} />
                                            <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.6} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="label"
                                    angle={-45}
                                    textAnchor="end"
                                    height={100}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                />
                                <YAxis
                                    domain={[0, 5]}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    label={{ value: 'Reyting', angle: -90, position: 'insideLeft', fill: '#64748b' }}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                    {chartData.data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={`url(#gradient${index})`} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className={cls.statsGrid}>
                        <div className={cls.statCard}>
                            <div className={cls.statIcon} style={{ background: '#dbeafe' }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div className={cls.statContent}>
                                <p className={cls.statLabel}>O'rtacha</p>
                                <p className={cls.statValue}>
                                    {(chartData.data.reduce((sum, d) => sum + d.value, 0) / chartData.data.length).toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className={cls.statCard}>
                            <div className={cls.statIcon} style={{ background: '#dcfce7' }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className={cls.statContent}>
                                <p className={cls.statLabel}>Eng yuqori</p>
                                <p className={cls.statValue}>
                                    {Math.max(...chartData.data.map(d => d.value)).toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className={cls.statCard}>
                            <div className={cls.statIcon} style={{ background: '#fee2e2' }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                </svg>
                            </div>
                            <div className={cls.statContent}>
                                <p className={cls.statLabel}>Eng past</p>
                                <p className={cls.statValue}>
                                    {Math.min(...chartData.data.map(d => d.value)).toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className={cls.statCard}>
                            <div className={cls.statIcon} style={{ background: '#fef3c7' }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div className={cls.statContent}>
                                <p className={cls.statLabel}>Jami</p>
                                <p className={cls.statValue}>{chartData.data.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={cls.emptyState}>
                    <svg className={cls.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className={cls.emptyText}>Ma'lumot topilmadi</p>
                    <p className={cls.emptySubtext}>Boshqa filter tanlab ko'ring</p>
                </div>
            )}
        </div>
    );
};
