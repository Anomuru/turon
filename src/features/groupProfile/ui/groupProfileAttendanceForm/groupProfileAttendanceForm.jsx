import React, {memo, useEffect, useState, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router";
import classNames from "classnames";
import {useForm} from "react-hook-form";

import {EditableCard} from "shared/ui/editableCard";
import {Modal} from "shared/ui/modal";
import {Form} from "shared/ui/form";
import {Table} from "shared/ui/table";
import {Select} from "shared/ui/select";
import {Input} from "shared/ui/input";
import {Button} from "shared/ui/button";
import {ConfirmModal} from "shared/ui/confirmModal";

import {API_URL, headers, useHttp} from "shared/api/base";
import {
    getSchoolAttendance,
    getSchoolAttendanceList,
} from "entities/profile/groupProfile/model/groupProfileThunk";
import {
    getAttendance,
    getAttendanceList, getAttendanceListLoading,
} from "entities/profile/groupProfile/model/groupProfileSelector";
import {
    createAttendance,
    deleteAttendance, loadingAttendance,
} from "entities/profile/groupProfile/model/groupProfileSlice";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import {getUserBranchId} from "entities/profile/userProfile";

import cls from "./groupProfileAttendanceForm.module.sass";
import {DefaultLoader} from "shared/ui/defaultLoader/index.js";

export const GroupProfileAttendanceForm = memo(
    ({attendance, setAttendance, studentData}) => {
        const {register, handleSubmit, setValue} = useForm();
        const {request} = useHttp();
        const {id} = useParams();
        const dispatch = useDispatch();
        const navigate = useNavigate();

        const dateAttendance = useSelector(getAttendance);
        const attendanceList = useSelector(getAttendanceList);
        const attendanceListLoading = useSelector(getAttendanceListLoading);
        const branch = useSelector(getUserBranchId);

        const [active, setActive] = useState(null);
        const [isChange, setIsChange] = useState(null);
        const [isDelete, setIsDelete] = useState(false);

        const [attendanceYears, setAttendanceYears] = useState([]);
        const [selectedYear, setSelectedYear] = useState(null);
        const [attendanceMonth, setAttendanceMonth] = useState([]);
        const [selectedMonth, setSelectedMonth] = useState(null);
        const [selectedDays, setSelectedDays] = useState([]);

        const [status, setStatus] = useState(true);
        const [absentStudents, setAbsentStudents] = useState({});

        const today = new Date();
        const todayDay = today.getDate();

        const getAttendanceDays = useCallback((data) => {
            if (!attendanceList?.students?.length) return [];

            const daysObj = data || {};

            const entries = Object.entries(daysObj).map(([key, value]) => [Number(key), value]);
            if (attendance) return entries

            const todayIndex = entries.findIndex(([day]) => day === todayDay);

            if (todayIndex === -1) {
                return entries.slice(-3);
            }

            return entries.slice(todayIndex, todayIndex + 3);
        }, [attendanceList, todayDay, attendance]);


        const getSelectedDays = useCallback(() => {
            if (!attendanceList?.days?.length) return [];
            if (attendance) return attendanceList?.days;
            const todayIndex = attendanceList?.days.findIndex((d) => d === todayDay);
            if (todayIndex === -1) {
                return attendanceList?.days.slice(-3);
            }
            return attendanceList?.days.slice(todayIndex, todayIndex + 3);
        }, [attendanceList, todayDay, attendance]);


        const hideConfirmRow = (() => {
            const firstThreeDays = getSelectedDays().slice(0, 3);

            const filledCount = firstThreeDays.filter((d) =>
                attendanceList?.students
                    ? attendanceList.students.some((st) => st.days?.[d]?.id || st.days?.[d]?.status !== null)
                    : false
            ).length;

            if (filledCount === 3) return true;

            if (
                filledCount === 2 &&
                absentStudents?.date &&
                firstThreeDays.includes(String(absentStudents.date))
            ) {
                return true;
            }

            return false;
        })();


        const formatDayString = useCallback(
            (year, month, day) =>
                `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
            []
        );


        const upsertAbsentStudent = useCallback(
            ({studentId, day, newStatus, formReason = undefined, sourceStatus = undefined}) => {
                const dayString = formatDayString(selectedYear, selectedMonth, day);

                setAbsentStudents((prev) => {

                    if (prev.date && prev.date !== day) {
                        dispatch(
                            onAddAlertOptions({
                                type: "error",
                                status: true,
                                msg: "Boshqa kun tanlangan",
                            })
                        );
                        return prev;
                    }

                    const updated = [...(prev.students || [])];
                    const idx = updated.findIndex((st) => st.id === studentId);


                    let reasonToSet;
                    if (typeof sourceStatus !== "undefined") {
                        reasonToSet = sourceStatus ? formReason : "";
                    } else {
                        reasonToSet = formReason;
                    }

                    if (idx > -1) {
                        updated[idx] = {
                            ...updated[idx],
                            status: newStatus,
                            reason: !newStatus ? reasonToSet : "",
                        };
                    } else {
                        updated.push({
                            id: studentId,
                            status: newStatus,
                            reason: !newStatus ? reasonToSet : "",
                        });
                    }

                    return updated.length
                        ? {date: day, studentId, day: dayString, students: updated}
                        : {};
                });
            },
            [dispatch, formatDayString, selectedYear, selectedMonth]
        );

        const removeStudentFromAbsent = useCallback((studentId) => {
            setAbsentStudents((prev) => {
                const updated = prev.students?.filter((st) => st.id !== studentId) || [];
                return updated.length ? {...prev, students: updated} : {};
            });
        }, []);


        useEffect(() => {
            if (id) dispatch(getSchoolAttendance({id}));
        }, [id]);

        useEffect(() => {
            if (id && selectedYear && selectedMonth) {
                dispatch(
                    getSchoolAttendanceList({
                        group_id: id,
                        year: selectedYear,
                        month: selectedMonth,
                    })
                );
            }
        }, [id, selectedYear, selectedMonth]);

        useEffect(() => {
            if (dateAttendance?.length) {
                const lastYear = dateAttendance.at(-1)?.year;
                const yearMonths = dateAttendance.find((y) => y.year === lastYear)?.months;
                const lastMonth = yearMonths?.at(-1);

                setAttendanceYears(dateAttendance.map((item) => item.year));
                setAttendanceMonth(yearMonths?.map((m) => m.month));
                setSelectedYear(lastYear);
                setSelectedMonth(lastMonth?.month);
                setSelectedDays(lastMonth?.days);
            }
        }, [dateAttendance]);


        const onCreate = (data) => {

            upsertAbsentStudent({
                studentId: active?.student,
                day: active?.day,
                newStatus: false,
                formReason: data?.reason,
                sourceStatus: undefined,
            });

            setActive(null);
            setValue("reason", "");
        };

        const onDelete = async () => {
            try {
                await request(
                    `${API_URL}Attendance/attendance/${isChange?.id}/delete/`,
                    "DELETE",
                    null,
                    headers()
                );
                dispatch(deleteAttendance(isChange));
            } catch (err) {
                console.error("Ошибка при удалении:", err);
            }
            setIsDelete(false);
            setIsChange(null);
            setValue("reason", "");
        };

        const onChange = (data) => {

            upsertAbsentStudent({
                studentId: isChange?.student,
                day: isChange?.day,
                newStatus: status,
                formReason: data?.reason,
                sourceStatus: undefined,
            });

            setIsChange(null);
            setValue("reason", "");
            setStatus(true);
        };

        const onSubmitAll = () => {
            let prevStudents = [];
            const filtered = (absentStudents.students || []).filter((st) => st.status === false);
            const trueFiltered = (absentStudents.students || [])
                .filter((st) => st.status)
                .map((item) => item.id);

            if (attendanceList.students) {
                prevStudents = attendanceList.students
                    .filter((st) => st.student.id !== absentStudents.studentId && !trueFiltered.includes(st.student.id))
                    .filter((st) => st.days[absentStudents.date].status === false)
                    .map((item) => ({...item.days[absentStudents.date], id: item.student.id}));
            }

            const payload = {
                day: absentStudents.day,
                group_id: id,
                absent_students: [...filtered, ...prevStudents].map(({id, reason}) => ({
                    id,
                    reason,
                })),
            };

            dispatch(loadingAttendance())
            request(
                `${API_URL}Attendance/attendance/create-list/`,
                "POST",
                JSON.stringify(payload),
                headers()
            ).then((res) => {
                if (attendanceList?.students?.length) {
                    dispatch(createAttendance(res));
                } else {
                    dispatch(
                        getSchoolAttendanceList({
                            group_id: id,
                            year: selectedYear,
                            month: selectedMonth,
                        })
                    );
                }
                setAbsentStudents({});
            });
        };

        const renderAttendance = (limit = 3) => {
            const data = attendanceList?.students?.length ? attendanceList.students : studentData;
            const isAttendance = Boolean(attendanceList?.students?.length);

            return data?.map((item, index) => (
                <tr key={item?.student?.id || index}>
                    <td>{index + 1}</td>
                    <td>
                        {item?.student?.name ?? item?.user?.name}{" "}
                        {item?.student?.surname ?? item?.user?.surname}
                    </td>

                    {isAttendance
                        ? getAttendanceDays(item.days).map(([day, i], idx) => {
                            const isAbsent =
                                absentStudents?.students?.some((st) => st.id === item?.student?.id) &&
                                String(day) === String(absentStudents?.date);

                            if (idx >= limit && !attendance) return null;

                            const finalStatus = (() => {
                                const override = absentStudents?.students?.find(
                                    (st) => st.id === item?.student?.id && String(absentStudents?.date) === String(day)
                                );
                                if (override) return override.status;
                                return i?.status;
                            })();

                            return (
                                <td
                                    key={day}
                                    className={classNames(cls.day, {
                                        [cls.active]:
                                        (active?.student === item?.student?.id && String(day) === String(active?.day)) ||
                                        isAbsent,
                                    })}
                                    onClick={() => {
                                        if (i?.status === null) {
                                            if (!isAbsent) {
                                                if (absentStudents?.date && String(day) !== String(absentStudents?.date)) {
                                                    dispatch(
                                                        onAddAlertOptions({
                                                            type: "error",
                                                            status: true,
                                                            msg: "Boshqa kun tanlangan",
                                                        })
                                                    );
                                                } else {
                                                    setActive({day, student: item?.student?.id});
                                                }
                                            } else {
                                                setAbsentStudents((prev) => {
                                                    const updated = prev.students.filter((st) => st.id !== item?.student?.id);
                                                    return updated.length ? {...prev, students: updated} : {};
                                                });
                                            }
                                        } else {
                                            if (isAbsent) {
                                                setAbsentStudents((prev) => {
                                                    const updated = prev.students.filter((st) => st.id !== item?.student?.id);
                                                    return updated.length ? {...prev, students: updated} : {};
                                                });
                                            } else {
                                                if (absentStudents?.date && day !== String(absentStudents?.date)) {
                                                    dispatch(
                                                        onAddAlertOptions({
                                                            type: "error",
                                                            status: true,
                                                            msg: "Boshqa kun tanlangan",
                                                        })
                                                    );
                                                } else {
                                                    if (!i?.status) {
                                                        upsertAbsentStudent({
                                                            studentId: item?.student?.id,
                                                            day,
                                                            newStatus: !i?.status,
                                                            formReason: undefined,
                                                            sourceStatus: i?.status,
                                                        });
                                                    } else {
                                                        setIsChange({
                                                            day,
                                                            student: item?.student?.id,
                                                            id: i?.id,
                                                            status: i?.status,
                                                        });
                                                        setStatus(false);
                                                        if (i?.reason) setValue("reason", i?.reason);
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                >
                                    {(() => {
                                        if (finalStatus === null || finalStatus === undefined) return null;

                                        return finalStatus ? (
                                            <i className="fas fa-check" style={{color: "#22C55E"}}/>
                                        ) : (
                                            <i className="fas fa-times" style={{color: "#F43F5E"}}/>
                                        );
                                    })()}
                                </td>
                            );
                        })
                        : getSelectedDays().map((day, idx) => {
                            const isAbsent =
                                absentStudents?.students?.some((st) => st.id === item?.id)
                                && String(day) === String(absentStudents?.date);
                            if (idx >= limit && !attendance) return null;
                            return (
                                <td
                                    key={day}
                                    className={classNames(cls.day, {
                                        [cls.active]:
                                        (active?.student === item?.id && String(day) === String(active?.day)) || isAbsent
                                    })}
                                    onClick={() => {
                                        if (isAbsent) {
                                            setAbsentStudents((prev) => {
                                                const updated = prev.students.filter((st) => st.id !== item?.id);
                                                return updated.length ? {...prev, students: updated} : {};
                                            });
                                        } else {
                                            if (absentStudents?.date && day !== absentStudents?.date) {
                                                dispatch(
                                                    onAddAlertOptions({
                                                        type: "error",
                                                        status: true,
                                                        msg: "Boshqa kun tanlangan",
                                                    })
                                                );
                                            } else {
                                                setActive({day, student: item?.id})
                                            }
                                        }
                                    }}
                                >
                                    {
                                        isAbsent ? (
                                            <i className="fas fa-times" style={{color: "#F43F5E"}}/>
                                        ) : null
                                    }
                                </td>
                            );
                        })}
                </tr>
            ));
        };

        return (
            <>

                <EditableCard extraClass={cls.attendance} onClick={() => setAttendance(!attendance)}>
                    <div className={cls.attendance__header}>
                        <h1>Davomat</h1>
                        <Select
                            titleOption="Yil"
                            extraClass={cls.select}
                            onChangeOption={setSelectedYear}
                            options={attendanceYears}
                            defaultValue={selectedYear}
                        />
                        <Select
                            titleOption="Oy"
                            extraClass={cls.select}
                            onChangeOption={setSelectedMonth}
                            options={attendanceMonth}
                            defaultValue={selectedMonth}
                        />
                    </div>

                    <div className={classNames(cls.attendance__container, {[cls.active]: attendance})}>
                        <Table>
                            <thead style={{top: 0}}>
                            <tr>
                                <th>№</th>
                                <th>Ism Familya</th>

                                {
                                    getSelectedDays().map((day, index) =>
                                        index >= 3 && !attendance ? null : (
                                            <th key={day}>
                                                <div className={cls.days}>
                                                    <h2>{day}</h2>
                                                </div>
                                            </th>
                                        )
                                    )
                                }
                            </tr>
                            </thead>

                            <tbody>
                            {(!hideConfirmRow || attendance) && (
                                <tr className={cls.bottom}>
                                    <td/>
                                    <td/>
                                    {
                                        getSelectedDays().map((day, index) => {
                                            if (index >= 3 && !attendance) return null;

                                            const statusDay = attendanceList?.students
                                                ? attendanceList.students.filter((st) => st.days[day]?.id)
                                                : [];

                                            const shouldDisable =
                                                (absentStudents && +absentStudents.date === +day) ||
                                                !!statusDay.length;

                                            return shouldDisable ? (
                                                <td key={day}/>
                                            ) : (
                                                <td className={cls.btn} key={day}>
                                                    <Button
                                                        extraClass={cls.btn__inner}
                                                        onClick={() => {
                                                            const payload = {
                                                                day: formatDayString(selectedYear, selectedMonth, day),
                                                                group_id: id,
                                                                absent_students: [],
                                                            };

                                                            dispatch(loadingAttendance());

                                                            request(
                                                                `${API_URL}Attendance/attendance/create-list/`,
                                                                "POST",
                                                                JSON.stringify(payload),
                                                                headers()
                                                            ).then((res) => {
                                                                if (attendanceList?.students) {
                                                                    dispatch(createAttendance(res));
                                                                } else {
                                                                    dispatch(
                                                                        getSchoolAttendanceList({
                                                                            group_id: id,
                                                                            year: selectedYear,
                                                                            month: selectedMonth,
                                                                        })
                                                                    );
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        Tasdiqlash
                                                    </Button>
                                                </td>
                                            );
                                        })
                                    }
                                </tr>
                            )}
                            {renderAttendance()}
                            </tbody>

                        </Table>
                    </div>

                    {
                        attendanceListLoading
                            ? <DefaultLoader/>
                            :
                            <div className={cls.attendance__btns}>
                                <Button
                                    type={!absentStudents?.students?.length ? "disabled" : "danger"}
                                    disabled={!absentStudents?.students?.length}
                                    onClick={() => setAbsentStudents({})}
                                >
                                    Tozalash
                                </Button>
                                <Button
                                    disabled={!absentStudents?.students?.length}
                                    type={!absentStudents?.students?.length ? "disabled" : ""}
                                    onClick={onSubmitAll}
                                >
                                    Yuborish
                                </Button>
                            </div>
                    }
                </EditableCard>

                <Modal active={active} setActive={setActive}>
                    <h1>Davomat qilish</h1>
                    <Form extraClassname={cls.create} onSubmit={handleSubmit(onCreate)}>
                        <Input required placeholder="Sabab" register={register} name="reason"/>
                    </Form>
                </Modal>

                <Modal active={isChange} setActive={setIsChange}>
                    <h1>Davomatni o'zgартirish</h1>
                    <Form id="change" typeSubmit extraClassname={cls.create} onSubmit={handleSubmit(onChange)}>
                        <Input required placeholder="Sabab" register={register} name="reason"/>
                        <div className={cls.create__btns}>
                            {/*<Button btnType="button" type="danger" onClick={() => setIsDelete(true)}>*/}
                            {/*    O'chirish*/}
                            {/*</Button>*/}
                            <Button>O'zgартириш</Button>
                        </div>
                    </Form>
                </Modal>

                <ConfirmModal active={isDelete} setActive={setIsDelete} onClick={onDelete}/>
            </>
        );
    }
);
