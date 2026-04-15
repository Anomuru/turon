import React, {useEffect, useMemo, useState} from "react";
import cls from "./studentProfileQuarter.module.sass";
import {Select} from "shared/ui/select";
import {Table} from "shared/ui/table";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {studentQuarterShowReducer} from "entities/profile/studentProfile/model/slice/studentProfileQuarterSlice";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";

import {
    getStudentAcademicYear,
    getStudentQuarterData,
    getStudentQuarterDataLoading,
    getStudentTerm
} from "entities/profile/studentProfile/model/selectors/studentProfileQuarterSelector";

import {
    fetchAcademicData,
    fetchAcademicTerm,
    fetchAcademicYear
} from "entities/profile/studentProfile/model/thunk/studentProfileQuarterThunk";

import {DefaultPageLoader} from "shared/ui/defaultLoader";
import {API_URL, useHttp} from "shared/api/base";

import {
    BarChart, Bar, LineChart, Line,
    XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import {Button} from "shared/ui/button/index.js";

const reducers = {
    studentQuarterShowSlice: studentQuarterShowReducer
};

export const StudentProfileQuarter = ({group_id}) => {

    const quarter = useSelector(getStudentTerm);
    const academicYear = useSelector(getStudentAcademicYear);
    const loading = useSelector(getStudentQuarterDataLoading);
    const data = useSelector(getStudentQuarterData);

    const [selectAcademicYear, setSelectAcademicYear] = useState(null);
    const [selectQuarter, setSelectQuarter] = useState(null);
    const [subjectSelect, setSubjectSelect] = useState();

    const [view, setView] = useState("cards"); // table | cards | detail | statistics
    const [selectedSubject, setSelectedSubject] = useState(null);

    const dispatch = useDispatch();
    const {id} = useParams();
    const {request} = useHttp();

    const [subject, setSubject] = useState();

    // ---------------- FETCH ----------------
    useEffect(() => {
        if (group_id?.[0]?.id) {
            request(`${API_URL}terms/group-subjects/${group_id[0].id}/`)
                .then(setSubject)
                .catch(console.log);
        }
    }, []);

    useEffect(() => {
        if (subject) setSubjectSelect("all");
    }, [subject]);

    useEffect(() => {
        dispatch(fetchAcademicYear());
    }, []);

    useEffect(() => {
        if (academicYear) setSelectAcademicYear(academicYear[0]?.academic_year);
    }, [academicYear]);

    useEffect(() => {
        if (selectAcademicYear) {
            dispatch(fetchAcademicTerm(selectAcademicYear));
        }
    }, [selectAcademicYear]);

    useEffect(() => {
        if (quarter) setSelectQuarter(quarter[0]?.id);
    }, [quarter]);

    useEffect(() => {
        if (selectQuarter && id) {
            dispatch(fetchAcademicData({
                termId: selectQuarter,
                academicYear: selectAcademicYear,
                groupId: id,
                subject: subjectSelect
            }));
        }
    }, [selectQuarter, selectAcademicYear, subjectSelect]);

    // ---------------- HELPERS ----------------
    const getColor = (score) => {
        if (score >= 70) return "#10b981";
        if (score >= 50) return "#f59e0b";
        return "#ef4444";
    };

    const rankedSubjects = useMemo(() => {
        if (!data?.subjects) return [];
        return [...data.subjects]
            .sort((a, b) => b.average_result - a.average_result)
            .map((item, i) => ({...item, rank: i + 1}));
    }, [data]);

    const allTests = [];
    data?.subjects?.forEach(s => {
        s.assignments?.forEach(a => {
            if (!allTests.includes(a.test_name)) {
                allTests.push(a.test_name);
            }
        });
    });

    // ---------------- UI ----------------
    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.quarter}>

                {/* FILTERS */}
                <div className={cls.quarter__select}>
                    <Select defaultValue={selectAcademicYear} onChangeOption={setSelectAcademicYear}
                            options={academicYear}/>
                    <Select defaultValue={selectQuarter} onChangeOption={setSelectQuarter}
                            options={quarter}/>
                    <Select defaultValue={subjectSelect} onChangeOption={setSubjectSelect}
                            options={subject && [{name: "Hammasi", id: "all"}, ...subject]}/>
                </div>

                {/* NAV */}
                <div className={cls.nav}>
                    {/*<Button onClick={() => setView("table")}>Table</Button>*/}
                    <Button onClick={() => setView("cards")}>Cards</Button>
                    <Button onClick={() => setView("statistics")}>Statistics</Button>
                </div>

                <h2>Umumiy natija: {data?.total_result}</h2>

                {loading && <DefaultPageLoader/>}

                {/* ---------------- TABLE ---------------- */}
                {view === "table" && data && (
                    <Table>
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Fan</th>
                            {allTests.map(t => <th key={t}>{t}</th>)}
                            <th>Ball</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data?.subjects?.map((s, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{s.subject_name}</td>
                                {allTests.map(test => {
                                    const a = s.assignments.find(x => x.test_name === test);
                                    return <td key={test}>{a ? a.calculated_result : "-"}</td>;
                                })}
                                <td>{s.average_result}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )}

                {/* ---------------- CARDS ---------------- */}
                {view === "cards" && (
                    <div className={cls.cards}>
                        {data?.subjects?.map((s, i) => (
                            <div key={i}
                                 className={cls.card}
                                 onClick={() => {
                                     setSelectedSubject(s);
                                     setView("detail");
                                 }}
                                 style={{borderTop: `4px solid ${getColor(s.average_result)}`}}
                            >
                                <h3>{s.subject_name}</h3>
                                <h1 style={{color: getColor(s.average_result)}}>
                                    {Math.round(s.average_result)}%
                                </h1>
                                <p>{s.assignments.length} ta test</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* ---------------- DETAIL ---------------- */}
                {view === "detail" && selectedSubject && (
                    <div>
                        <Button onClick={() => setView("cards")}>← Back</Button>

                        <h2>{selectedSubject.subject_name}</h2>

                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={selectedSubject.assignments.map(a => ({
                                    name: a.test_name,
                                    score: a.percentage
                                }))}
                            >
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Tooltip/>
                                <Line dataKey="score" stroke="#6366f1"/>
                            </LineChart>
                        </ResponsiveContainer>

                        <Table>
                            <thead>
                            <tr>
                                <th>Test</th>
                                <th>%</th>
                                <th>Ball</th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedSubject.assignments.map((a, i) => (
                                <tr key={i}>
                                    <td>{a.test_name}</td>
                                    <td>{a.percentage}%</td>
                                    <td>{a.calculated_result}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>
                )}

                {/* ---------------- STATISTICS ---------------- */}
                {view === "statistics" && (
                    <div>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={rankedSubjects}>
                                <XAxis dataKey="subject_name"/>
                                <YAxis/>
                                <Tooltip/>
                                <Bar dataKey="average_result" fill="#6366f1"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

            </div>
        </DynamicModuleLoader>
    );
};