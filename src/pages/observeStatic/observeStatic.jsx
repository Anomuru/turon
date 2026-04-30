import React, {useEffect, useMemo, useState} from 'react';
import './static.scss';
import {API_URL, headers, useHttp} from "shared/api/base.js";

export const TeacherDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [term, setTerm] = useState('1');

    const {request} = useHttp();
    const branchId = localStorage.getItem("branchId");

    const [teachers, setTeachers] = useState([]);

    console.log(term)
    useEffect(() => {
        request(`${API_URL}Observation/teacher_stats/?term_id=${term}&branch_id=${branchId}`, "GET", null, headers())
            .then(res => {
                setTeachers(res || []);
            })
            .catch(err => {
                console.log(err);
                setTeachers([]);
            });
    }, [term]);

    // 🔍 FILTER + SORT
    const filteredTeachers = useMemo(() => {
        let filtered = teachers.filter(item =>
            item?.teacher?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
            item?.teacher?.surname?.toLowerCase()?.includes(searchTerm.toLowerCase())
        );

        return filtered.sort((a, b) => {
            if (sortBy === 'name') {
                return (a?.teacher?.name || '').localeCompare(b?.teacher?.name || '');
            } else if (sortBy === 'surname') {
                return (a?.teacher?.surname || '').localeCompare(b?.teacher?.surname || '');
            }
            return (a?.teacher?.id || 0) - (b?.teacher?.id || 0);
        });
    }, [searchTerm, sortBy, teachers]);

    // 🔤 INITIALS
    const getInitials = (name = '', surname = '') => {
        return `${name[0] || ''}${surname[0] || ''}`.toUpperCase();
    };

    return (
        <div className="teacher-dashboard">
            <div className="dashboard-header">
                <div style={{marginLeft: 0}} className="header-content">
                    <h1 className="dashboard-title">O'qituvchilar ro'yxati</h1>
                    <p className="dashboard-subtitle">
                        Jami {teachers.length} ta o'qituvchi
                    </p>
                </div>

                <div className="header-controls">
                    {/* 🔍 SEARCH */}
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Ism yoki familiya bo'yicha qidirish..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    {/* 🔽 SORT */}
                    <div className="sort-control">
                        <label htmlFor="sort">Saralash:</label>
                        <select
                            id="sort"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="name">Ism bo'yicha</option>
                            <option value="surname">Familiya bo'yicha</option>
                            <option value="id">ID bo'yicha</option>
                        </select>
                    </div>
                    <div className="sort-control">
                        <label htmlFor="sort">Saralash chorak:</label>
                        <select
                            id="term"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            className="sort-select"
                        >
                            <option value="1">1-chorak</option>
                            <option value="2">2-chorak</option>
                            <option value="3">3-chorak</option>
                            <option value="4">4-chorak</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 📦 CARDS */}
            <div className="teacher-grid">
                {filteredTeachers.map(item => {
                    const { teacher, observation, lesson_plan } = item;

                    return (
                        <div key={teacher?.id} className="teacher-card">
                            <div className="card-header">
                                <div className="teacher-avatar">
                                    <span className="avatar-initials">
                                        {getInitials(teacher?.name, teacher?.surname)}
                                    </span>
                                </div>

                                <div className="teacher-info">
                                    <h3 className="teacher-name">
                                        {teacher?.name} {teacher?.surname}
                                    </h3>
                                    <span className="teacher-id">
                                        ID: {teacher?.id}
                                    </span>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className="info-row">
                                    <span className="info-label">Kuzatuvlar</span>
                                    <span className="info-value">
                                        {observation?.count > 0
                                            ? observation.count
                                            : 'Mavjud emas'}
                                    </span>
                                </div>

                                <div className="info-row">
                                    <span className="info-label">O'rtacha ball</span>
                                    <span className="info-value">
                                        {observation?.average != null
                                            ? observation.average.toFixed(1)
                                            : '—'}
                                    </span>
                                </div>

                                <div className="info-row">
                                    <span className="info-label">Dars rejasi</span>
                                    <span
                                        className={`status-badge ${
                                            lesson_plan ? 'status-active' : 'status-inactive'
                                        }`}
                                    >
                                        {lesson_plan ? 'Mavjud' : 'Kiritilmagan'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ❌ EMPTY */}
            {filteredTeachers.length === 0 && (
                <div className="empty-state">
                    <p className="empty-text">O'qituvchi topilmadi</p>
                    <p className="empty-hint">Boshqa qidiruv so'rovini kiriting</p>
                </div>
            )}
        </div>
    );
};