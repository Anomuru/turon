import React, {useEffect, useState} from 'react';
import './classGrades.sass';
import {API_URL, useHttp} from "shared/api/base.js";
import {useParams} from "react-router";
const data2 = {
    "term": {
        "start": "2026-03-31",
        "end": "2026-06-02",
        "name": 4
    },
    "subject_scores": [
        {
            "subject": "Matematika",
            "students": [
                { "id": 585, "name": "Mohinur Obidjonova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 554, "name": "Otabek Ulug'bekov", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 1232, "name": "Iymona Dilmurodova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 1149, "name": "Rustamov Imronbek", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 1111, "name": "Samiraxon Erkinbekova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 616, "name": "Shahrizoda Tilapova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] }
            ]
        },
        {
            "subject": "Ingliz tili",
            "students": [
                { "id": 585, "name": "Mohinur Obidjonova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 554, "name": "Otabek Ulug'bekov", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 1232, "name": "Iymona Dilmurodova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 1149, "name": "Rustamov Imronbek", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 1111, "name": "Samiraxon Erkinbekova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 616, "name": "Shahrizoda Tilapova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] }
            ]
        },
        {
            "subject": "Rus tili",
            "students": [
                { "id": 585, "name": "Mohinur Obidjonova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 554, "name": "Otabek Ulug'bekov", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 1232, "name": "Iymona Dilmurodova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 1149, "name": "Rustamov Imronbek", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 1111, "name": "Samiraxon Erkinbekova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 616, "name": "Shahrizoda Tilapova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] }
            ]
        },
        {
            "subject": "Ona tili va Adabiyot",
            "students": [
                { "id": 585, "name": "Mohinur Obidjonova", "average_score": 5.0, "attendance_percentage": 100.0, "total_lessons": 1, "attended_lessons": 1, "history": [{ "day": "2026-04-20", "status": true, "homework": 5, "activeness": 5, "average": 5 }] },
                { "id": 554, "name": "Otabek Ulug'bekov", "average_score": 5.0, "attendance_percentage": 100.0, "total_lessons": 1, "attended_lessons": 1, "history": [{ "day": "2026-04-20", "status": true, "homework": 5, "activeness": 5, "average": 5 }] },
                { "id": 1232, "name": "Iymona Dilmurodova", "average_score": 5.0, "attendance_percentage": 100.0, "total_lessons": 1, "attended_lessons": 1, "history": [{ "day": "2026-04-20", "status": true, "homework": 5, "activeness": 5, "average": 5 }] },
                { "id": 1149, "name": "Rustamov Imronbek", "average_score": 5.0, "attendance_percentage": 100.0, "total_lessons": 1, "attended_lessons": 1, "history": [{ "day": "2026-04-20", "status": true, "homework": 5, "activeness": 5, "average": 5 }] },
                { "id": 1111, "name": "Samiraxon Erkinbekova", "average_score": 5.0, "attendance_percentage": 100.0, "total_lessons": 1, "attended_lessons": 1, "history": [{ "day": "2026-04-20", "status": true, "homework": 5, "activeness": 5, "average": 5 }] },
                { "id": 616, "name": "Shahrizoda Tilapova", "average_score": 0, "attendance_percentage": 0.0, "total_lessons": 1, "attended_lessons": 0, "history": [{ "day": "2026-04-20", "status": false, "homework": 0, "activeness": 0, "average": 0 }] }
            ]
        },
        {
            "subject": "Digital literacy",
            "students": [
                { "id": 585, "name": "Mohinur Obidjonova", "average_score": 0, "attendance_percentage": 0.0, "total_lessons": 1, "attended_lessons": 0, "history": [{ "day": "2026-04-24", "status": false, "homework": 0, "activeness": 0, "average": 0 }] },
                { "id": 554, "name": "Otabek Ulug'bekov", "average_score": 3.0, "attendance_percentage": 100.0, "total_lessons": 1, "attended_lessons": 1, "history": [{ "day": "2026-04-24", "status": true, "homework": 3, "activeness": 3, "average": 3 }] },
                { "id": 1232, "name": "Iymona Dilmurodova", "average_score": 3.0, "attendance_percentage": 100.0, "total_lessons": 1, "attended_lessons": 1, "history": [{ "day": "2026-04-24", "status": true, "homework": 3, "activeness": 3, "average": 3 }] },
                { "id": 1149, "name": "Rustamov Imronbek", "average_score": 3.0, "attendance_percentage": 100.0, "total_lessons": 1, "attended_lessons": 1, "history": [{ "day": "2026-04-24", "status": true, "homework": 3, "activeness": 3, "average": 3 }] },
                { "id": 1111, "name": "Samiraxon Erkinbekova", "average_score": 3.0, "attendance_percentage": 100.0, "total_lessons": 1, "attended_lessons": 1, "history": [{ "day": "2026-04-24", "status": true, "homework": 3, "activeness": 3, "average": 3 }] },
                { "id": 616, "name": "Shahrizoda Tilapova", "average_score": 3.0, "attendance_percentage": 100.0, "total_lessons": 1, "attended_lessons": 1, "history": [{ "day": "2026-04-24", "status": true, "homework": 3, "activeness": 3, "average": 3 }] }
            ]
        },
        {
            "subject": "Jismoniy Tarbiya",
            "students": [
                { "id": 585, "name": "Mohinur Obidjonova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 554, "name": "Otabek Ulug'bekov", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 1232, "name": "Iymona Dilmurodova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 1149, "name": "Rustamov Imronbek", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 1111, "name": "Samiraxon Erkinbekova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 616, "name": "Shahrizoda Tilapova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] }
            ]
        },
        {
            "subject": "Science",
            "students": [
                { "id": 585, "name": "Mohinur Obidjonova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 554, "name": "Otabek Ulug'bekov", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 1232, "name": "Iymona Dilmurodova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 1149, "name": "Rustamov Imronbek", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 1111, "name": "Samiraxon Erkinbekova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 616, "name": "Shahrizoda Tilapova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] }
            ]
        },
        {
            "subject": "Web Dasturchilik",
            "students": [
                { "id": 585, "name": "Mohinur Obidjonova", "average_score": 4.0, "attendance_percentage": 100.0, "total_lessons": 1, "attended_lessons": 1, "history": [{ "day": "2026-04-23", "status": true, "homework": 4, "activeness": 4, "average": 4 }] },
                { "id": 554, "name": "Otabek Ulug'bekov", "average_score": 3.0, "attendance_percentage": 100.0, "total_lessons": 1, "attended_lessons": 1, "history": [{ "day": "2026-04-23", "status": true, "homework": 3, "activeness": 3, "average": 3 }] },
                { "id": 1232, "name": "Iymona Dilmurodova", "average_score": 3.0, "attendance_percentage": 100.0, "total_lessons": 1, "attended_lessons": 1, "history": [{ "day": "2026-04-23", "status": true, "homework": 3, "activeness": 3, "average": 3 }] },
                { "id": 1149, "name": "Rustamov Imronbek", "average_score": 3.0, "attendance_percentage": 100.0, "total_lessons": 1, "attended_lessons": 1, "history": [{ "day": "2026-04-23", "status": true, "homework": 3, "activeness": 3, "average": 3 }] },
                { "id": 1111, "name": "Samiraxon Erkinbekova", "average_score": 3.0, "attendance_percentage": 100.0, "total_lessons": 1, "attended_lessons": 1, "history": [{ "day": "2026-04-23", "status": true, "homework": 3, "activeness": 3, "average": 3 }] },
                { "id": 616, "name": "Shahrizoda Tilapova", "average_score": 0, "attendance_percentage": 0.0, "total_lessons": 1, "attended_lessons": 0, "history": [{ "day": "2026-04-23", "status": false, "homework": 0, "activeness": 0, "average": 0 }] }
            ]
        },
        {
            "subject": "Robotics",
            "students": [
                { "id": 585, "name": "Mohinur Obidjonova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 554, "name": "Otabek Ulug'bekov", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 1232, "name": "Iymona Dilmurodova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 1149, "name": "Rustamov Imronbek", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 1111, "name": "Samiraxon Erkinbekova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] },
                { "id": 616, "name": "Shahrizoda Tilapova", "average_score": 0, "attendance_percentage": 0, "total_lessons": 0, "attended_lessons": 0, "history": [] }
            ]
        }
    ],
    "overall_rating": [
        { "id": 554, "name": "Otabek Ulug'bekov", "total_average": 3.7, "rank_class": 1, "rank_branch": 33 },
        { "id": 1232, "name": "Iymona Dilmurodova", "total_average": 3.7, "rank_class": 4, "rank_branch": 24 },
        { "id": 1149, "name": "Rustamov Imronbek", "total_average": 3.7, "rank_class": 3, "rank_branch": 25 },
        { "id": 1111, "name": "Samiraxon Erkinbekova", "total_average": 3.7, "rank_class": 2, "rank_branch": 31 },
        { "id": 585, "name": "Mohinur Obidjonova", "total_average": 3.0, "rank_class": 5, "rank_branch": 46 },
        { "id": 616, "name": "Shahrizoda Tilapova", "total_average": 1.0, "rank_class": 6, "rank_branch": 104 }
    ]
};
export const FlowGrades = () => {
    const [data , setJsonData] = useState(data2)

    const {request} = useHttp()
    const {id} = useParams()
    useEffect(() => {
        request(`${API_URL}Group/group-flow-rating/?flow_id=${id}&is_flow=True`)
            .then(res => {
                console.log(res)
                setJsonData(res)
            })
    }, []);


    const [activeTab, setActiveTab] = useState('overall');
    const [selectedSubject, setSelectedSubject] = useState(null);

    const getScoreClass = (score) => {
        if (score === 0) return 'score-none';
        if (score >= 4.5) return 'score-excellent';
        if (score >= 4) return 'score-good';
        if (score >= 3) return 'score-average';
        return 'score-poor';
    };

    const getRankBadge = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>O'quvchilar Natijalari</h1>
                    <div className="term-info">
                        <span className="term-badge">{data.term.name}-chorak</span>
                        <span className="term-dates">{data.term.start} - {data.term.end}</span>
                    </div>
                </div>
            </header>

            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'overall' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overall')}
                >
                    Umumiy Natijalar
                </button>
                <button
                    className={`tab ${activeTab === 'subjects' ? 'active' : ''}`}
                    onClick={() => setActiveTab('subjects')}
                >
                    Fanlar bo'yicha
                </button>
            </div>

            {activeTab === 'overall' && (
                <div className="overall-section">
                    <div className="stats-grid">
                        {data.overall_rating.map((student, index) => (
                            <div key={student.id} className={`student-card ${getScoreClass(student.total_average)}`}>
                                <div className="card-header">
                                    <div className="rank-badge">{getRankBadge(student.rank_class)}</div>
                                    <div className="student-name">{student.name}</div>
                                </div>
                                <div className="card-body">
                                    <div className="stat">
                                        <span className="stat-label">O'rtacha ball</span>
                                        <span className="stat-value">{student.total_average.toFixed(1)}</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">Sinfda</span>
                                        <span className="stat-value">{student.rank_class}-o'rin</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">Filialda</span>
                                        <span className="stat-value">{student.rank_branch}-o'rin</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'subjects' && (
                <div className="subjects-section">
                    <div className="subject-selector">
                        {data.subject_scores.map((subjectData, index) => (
                            <button
                                key={index}
                                className={`subject-btn ${selectedSubject === index ? 'active' : ''}`}
                                onClick={() => setSelectedSubject(index)}
                            >
                                {subjectData.subject}
                            </button>
                        ))}
                    </div>

                    {selectedSubject !== null && (
                        <div className="subject-details">
                            <h2>{data.subject_scores[selectedSubject].subject}</h2>
                            <div className="table-container">
                                <table className="students-table">
                                    <thead>
                                    <tr>
                                        <th>№</th>
                                        <th>O'quvchi</th>
                                        <th>O'rtacha ball</th>
                                        <th>Davomat</th>
                                        <th>Darslar soni</th>
                                        <th>Qatnashgan</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {data.subject_scores[selectedSubject].students.map((student, index) => (
                                        <tr key={student.id} className={getScoreClass(student.average_score)}>
                                            <td>{index + 1}</td>
                                            <td className="student-name-cell">{student.name}</td>
                                            <td>
                          <span className={`score-badge ${getScoreClass(student.average_score)}`}>
                            {student.average_score.toFixed(1)}
                          </span>
                                            </td>
                                            <td>
                                                <div className="attendance-bar">
                                                    <div
                                                        className="attendance-fill"
                                                        style={{width: `${student.attendance_percentage}%`}}
                                                    ></div>
                                                    <span className="attendance-text">{student.attendance_percentage.toFixed(0)}%</span>
                                                </div>
                                            </td>
                                            <td>{student.total_lessons}</td>
                                            <td>{student.attended_lessons}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {data.subject_scores[selectedSubject].students.some(s => s.history.length > 0) && (
                                <div className="history-section">
                                    <h3>Darslar tarixi</h3>
                                    {data.subject_scores[selectedSubject].students
                                        .filter(s => s.history.length > 0)
                                        .map(student => (
                                            <div key={student.id} className="history-card">
                                                <h4>{student.name}</h4>
                                                <div className="history-items">
                                                    {student.history.map((record, idx) => (
                                                        <div key={idx} className={`history-item ${record.status ? 'present' : 'absent'}`}>
                                                            <span className="history-date">{record.day}</span>
                                                            <span className="history-status">{record.status ? '✓ Qatnashdi' : '✗ Qatnashmadi'}</span>
                                                            {record.status && (
                                                                <>
                                                                    <span className="history-score">Uy ishi: {record.homework}</span>
                                                                    <span className="history-score">Faollik: {record.activeness}</span>
                                                                    <span className="history-score">O'rtacha: {record.average}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

