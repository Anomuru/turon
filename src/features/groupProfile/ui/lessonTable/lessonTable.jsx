import styles from './lessonTable.module.sass';
import React, { useEffect, useState } from "react";
import { API_URL, headers, useHttp } from "shared/api/base.js";
import { useParams } from "react-router";
import { Input } from "shared/ui/input/index.js";
import { DefaultPageLoader } from "shared/ui/defaultLoader/index.js";
import classNames from "classnames";
import { onAddAlertOptions } from "features/alert/index.js";
import { useDispatch } from "react-redux";

export const LessonsTable = () => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const [lessonsData, setLessonsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [date, setDate] = useState(today);
    const { request } = useHttp();
    const dispatch = useDispatch();

    useEffect(() => {
        setLoading(true);
        // request(`${API_URL}Attendance/attendance/group-attendance/194/?date=2026-01-08` , "GET" , null , headers())
        request(`${API_URL}Attendance/attendance/group-attendance/${id}/?date=${date}`, "GET", null, headers())
            .then(res => {
                setLessonsData(res || []);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, [date, id]);

    const onChange = ({ studentId, currentStatus, lessonId }) => {
        const body = {
            status: !currentStatus,
            student_id: studentId,
            lesson_id: lessonId
        };
        setLessonsData(prev =>
            prev.map(lesson => {
                if (lesson.lesson_id !== lessonId) return lesson;

                return {
                    ...lesson,
                    students: lesson.students.map(st =>
                        st.student_id === studentId
                            ? { ...st, status_class_type: !currentStatus }
                            : st
                    )
                };
            })
        );
        // request(`${API_URL}Attendance/attendance/change-status/`, "POST", JSON.stringify(body), headers())
        //     .then(res => {
        //         dispatch(onAddAlertOptions({
        //             type: "success",
        //             status: true,
        //             msg: res?.msg || "Muvaffaqiyatli o‘zgartirildi"
        //         }));
        //
        //         // UI ni darhol update qilamiz
        //
        //     })
        //     .catch(err => {
        //         console.log(err);
        //         dispatch(onAddAlertOptions({
        //             type: "error",
        //             status: true,
        //             msg: "Xatolik yuz berdi"
        //         }));
        //     });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>📚 Darslar Jadvali</h1>
                    <p>{date}</p>
                </div>
                <Input
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                    type="date"
                />
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>O'quvchi</th>
                        <th>Xona</th>
                        <th>O'qituvchi</th>
                        <th>Uy ishi</th>
                        <th>Faollik</th>
                        <th>O'rtacha</th>
                        <th></th>
                    </tr>
                    </thead>

                    {loading ? (
                        <tbody>
                        <tr>
                            <td colSpan="8">
                                <DefaultPageLoader />
                            </td>
                        </tr>
                        </tbody>
                    ) : (
                        <tbody>
                        {lessonsData?.map((lesson) => (
                            <React.Fragment key={lesson.lesson_id}>
                                {/* Group header */}
                                <tr className={styles.groupRow}>
                                    <td colSpan="8">
                                        <div className={styles.groupHeader}>
                                            {lesson.subject} - {lesson.time}
                                        </div>
                                    </td>
                                </tr>

                                {/* Students */}
                                {lesson.students.map((student, index) => (
                                    <tr key={student.student_id}>
                                        <td className={styles.numberCell}>{index + 1}</td>
                                        <td className={styles.studentCell}>{student.student_name}</td>
                                        <td className={styles.roomCell}>{lesson.room}</td>
                                        <td className={styles.teacherCell}>
                                            {lesson.teacher_name || (
                                                <span className={styles.noTeacher}>Tayinlanmagan</span>
                                            )}
                                        </td>
                                        <td className={styles.scoreCell}>{student.homework}</td>
                                        <td className={styles.scoreCell}>{student.activeness}</td>
                                        <td className={styles.scoreCell}>{student.average}</td>
                                        <td>
                                            <div
                                                // onClick={() =>
                                                //     onChange({
                                                //         studentId: student.student_id,
                                                //         currentStatus: student.status_class_type,
                                                //         lessonId: lesson.lesson_id
                                                //     })
                                                // }
                                                className={classNames(styles.checkbox__minus, {
                                                    [styles.active]: student.status
                                                })}
                                            >
                                                {student.status ? (
                                                    <i className="fa fa-check" />
                                                ) : (
                                                    <i className="fa fa-times" />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
};
