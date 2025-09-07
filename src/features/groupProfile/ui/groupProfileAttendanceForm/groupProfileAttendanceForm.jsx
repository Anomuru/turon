import React, {memo, useEffect, useState} from 'react';

import {EditableCard} from "shared/ui/editableCard";
import {Modal} from "shared/ui/modal";
import {Form} from "shared/ui/form";
import {Table} from "shared/ui/table";
import {Select} from "shared/ui/select";

import cls from "./groupProfileAttendanceForm.module.sass";
import {useNavigate, useParams} from "react-router";
import {API_URL, headers, ParamUrl, useHttp} from "shared/api/base.js";
import {useDispatch, useSelector} from "react-redux";
import {getSchoolAttendance, getSchoolAttendanceList} from "entities/profile/groupProfile/model/groupProfileThunk.js";
import {getAttendance, getAttendanceList} from "entities/profile/groupProfile/model/groupProfileSelector.js";
import classNames from "classnames";
import {Input} from "shared/ui/input/index.js";
import {useForm} from "react-hook-form";
import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {createAttendance, deleteAttendance} from "entities/profile/groupProfile/model/groupProfileSlice.js";
import {Button} from "shared/ui/button/index.js";
import {ConfirmModal} from "shared/ui/confirmModal/index.js";

export const GroupProfileAttendanceForm = memo(({attendance, setAttendance, studentData}) => {


    const {register, handleSubmit, setValue} = useForm()
    const {request} = useHttp()
    const {id} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const dateAttendance = useSelector(getAttendance)
    const attendanceList = useSelector(getAttendanceList)
    const branch = useSelector(getUserBranchId)

    const [active, setActive] = useState(false)
    const [isChange, setIsChange] = useState(false)
    const [isDelete, setIsDelete] = useState(false)
    const [attendanceYears, setAttendanceYears] = useState([])
    const [selectedYear, setSelectedYear] = useState(null)
    const [attendanceMonth, setAttendanceMonth] = useState([])
    const [selectedMonth, setSelectedMonth] = useState(null)
    const [selectedDays, setSelectedDays] = useState([])
    const [status, setStatus] = useState(false)

    useEffect(() => {
        if (id)
            dispatch(getSchoolAttendance({id}))
    }, [id])

    useEffect(() => {
        if (id && selectedYear && selectedMonth)
            dispatch(getSchoolAttendanceList({
                group_id: id,
                year: selectedYear,
                month: selectedMonth
            }))
    }, [id, selectedYear, selectedMonth])

    useEffect(() => {
        if (dateAttendance && dateAttendance.length) {
            // console.log(dateAttendance, "dateAttendance")
            const lastYear = dateAttendance[dateAttendance?.length - 1]?.year
            const yearMonths = dateAttendance.filter(item => item.year === lastYear)[0]?.months
            const lastMonth = yearMonths[yearMonths?.length - 1]
            setAttendanceYears(dateAttendance?.map(item => item?.year))
            setAttendanceMonth(yearMonths?.map(item => item?.month))
            setSelectedYear(lastYear)
            setSelectedMonth(lastMonth?.month)
            setSelectedDays(lastMonth?.days)
        }
    }, [dateAttendance])


    const onCreate = (data) => {
        console.log(active, "active")
        const res = {
            ...data,
            status,
            day: `${selectedYear}-${selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth}-${active?.day < 10 ? `0${active?.day}` : active?.day}`,
            year: selectedYear,
            month: selectedMonth,
            student_id: active?.student,
            group_id: id
        }
        request(`${API_URL}Attendance/attendance/create/`, "POST", JSON.stringify(res), headers())
            .then(res => {
                if (attendanceList && attendanceList.days?.length) {
                    dispatch(createAttendance({...res, studentId: active?.student}))
                } else {
                    dispatch(getSchoolAttendanceList({
                        group_id: id,
                        year: selectedYear,
                        month: selectedMonth
                    }))
                }
                setActive(false)
                setStatus(false)
                setValue("reason", "")
            })
    }

    const onDelete = async () => {
        try {
            await request(
                `${API_URL}Attendance/attendance/${isChange?.id}/delete/`,
                "DELETE",
                null,
                headers()
            );
        } catch (err) {
            console.error("Ошибка при удалении:", err);
        }
        dispatch(deleteAttendance(isChange));
        setIsDelete(false);
        setIsChange(false);
        setValue("reason", "");
    };

    const onChange = async (data) => {
        try {
            await onDelete();

            const res = {
                ...data,
                status,
                day: `${selectedYear}-${selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth}-${isChange?.day < 10 ? `0${isChange?.day}` : isChange?.day}`,
                year: selectedYear,
                month: selectedMonth,
                student_id: isChange?.student,
                group_id: id,
            };

            const response = await request(
                `${API_URL}Attendance/attendance/create/`,
                "POST",
                JSON.stringify(res),
                headers()
            );

            dispatch(createAttendance({...response, studentId: isChange?.student}));
            setIsChange(false);
            setStatus(false);
            setValue("reason", "");
        } catch (error) {
            console.error("Ошибка при изменении:", error);
        }
    };


    const renderAttendance = (limit = 3) => {
        let data = [];
        let isAttendance = false;

        if (attendanceList && attendanceList?.days?.length) {
            data = attendanceList?.students;
            isAttendance = true;
        } else {
            data = studentData;
        }

        return data?.map((item, index) => (
            <tr key={item?.student?.id || index}>
                <td>{index + 1}</td>
                <td>{item?.student?.name ?? item?.user?.name} {item?.student?.surname ?? item?.user?.surname}</td>

                {
                    isAttendance
                        ? Object.values(item?.days)?.map((i, idx) => {
                            if (idx >= limit && !attendance) return null;
                            return (
                                <td
                                    key={idx}
                                    className={cls.day}
                                    onClick={() => {
                                        if (i?.status === null) {
                                            setActive({
                                                day: Object.keys(item?.days)[idx],
                                                student: item?.student?.id
                                            });
                                        } else {
                                            setIsChange({
                                                day: Object.keys(item?.days)[idx],
                                                student: item?.student?.id,
                                                id: i?.id
                                            });
                                        }
                                    }}
                                >
                                    {
                                        i?.status === null ? null :
                                            i?.status ? (
                                                <i className="fas fa-check" style={{color: "#22C55E"}}/>
                                            ) : (
                                                <i className="fas fa-times" style={{color: "#F43F5E"}}/>
                                            )
                                    }
                                </td>
                            );
                        })
                        : selectedDays?.map((day, idx) => {
                            if (idx >= limit && !attendance) return null;
                            return (
                                <td
                                    key={idx}
                                    className={cls.day}
                                    onClick={() =>
                                        setActive({day, student: item?.id})
                                    }
                                />
                            );
                        })
                }
            </tr>
        ));
    };


    const render = renderAttendance()

    return (
        <>
            <EditableCard
                extraClass={cls.attendance}
                onClick={() => {
                    setAttendance(!attendance)
                    // navigate(`attendance`)
                }}
            >
                <div className={cls.attendance__header}>
                    <h1>Davomat</h1>
                    <Select
                        titleOption={"Yil"}
                        extraClass={cls.select}
                        onChangeOption={setSelectedYear}
                        options={attendanceYears}
                        defaultValue={selectedYear}
                    />
                    <Select
                        titleOption={"Oy"}
                        extraClass={cls.select}
                        onChangeOption={setSelectedMonth}
                        options={attendanceMonth}
                        defaultValue={selectedMonth}
                    />
                </div>
                <div
                    className={classNames(cls.attendance__container, {
                        [cls.active]: attendance
                    })}
                >
                    <Table>
                        <thead style={{top: 0}}>
                        <tr>
                            <th>№</th>
                            <th>Ism Familya</th>
                            {
                                attendanceList?.days ?
                                    attendanceList?.days?.map((item, index) => {
                                        if (index >= 3 && !attendance) return null
                                        return (
                                            <th>
                                                <div className={cls.days}>
                                                    <h2>{item}</h2>
                                                    {/*<p>{item.day}</p>*/}
                                                </div>
                                            </th>
                                        )
                                    })
                                    : selectedDays?.map((item, index) => {
                                        if (index >= 3 && !attendance) return null
                                        return (
                                            <th>
                                                <div className={cls.days}>
                                                    <h2>{item}</h2>
                                                    {/*<p>{item.day}</p>*/}
                                                </div>
                                            </th>
                                        )
                                    })
                            }
                        </tr>
                        </thead>
                        <tbody>
                        {render}
                        </tbody>
                    </Table>
                </div>
            </EditableCard>
            <Modal
                active={active}
                setActive={setActive}
            >
                <h1>Davomat qilish</h1>
                <Form extraClassname={cls.create} onSubmit={handleSubmit(onCreate)}>
                    <div className={cls.create__checkbox}>
                        <h2>O'quvchi darsda qatnashdimi</h2>
                        <Input
                            extraClassName={cls.checkbox}
                            type={"checkbox"}
                            // register={register}
                            name={"status"}
                            onChange={() => setStatus(!status)}
                            value={status}
                        />
                    </div>
                    {
                        status ? null
                            : <Input
                                required
                                placeholder={"Sabab"}
                                register={register}
                                name={"reason"}
                            />
                    }
                </Form>
            </Modal>
            <Modal
                active={isChange}
                setActive={setIsChange}
            >
                <h1>Davomatni o'zgartirish</h1>
                <Form id={"change"} typeSubmit extraClassname={cls.create} onSubmit={handleSubmit(onChange)}>
                    <div className={cls.create__checkbox}>
                        <h2>O'quvchi darsda qatnashdimi</h2>
                        <Input
                            extraClassName={cls.checkbox}
                            type={"checkbox"}
                            // register={register}
                            name={"status"}
                            onChange={() => setStatus(!status)}
                            value={status}
                        />
                    </div>
                    {
                        status ? null
                            : <Input
                                required
                                placeholder={"Sabab"}
                                register={register}
                                name={"reason"}
                            />
                    }
                    <div className={cls.create__btns}>
                        <Button
                            btnType="button"
                            type={"danger"}
                            onClick={() => setIsDelete(true)}
                        >
                            O'chirish
                        </Button>
                        <Button>O'zgartirish</Button>
                    </div>
                </Form>
            </Modal>
            <ConfirmModal
                active={isDelete}
                setActive={setIsDelete}
                onClick={onDelete}
            />
        </>
    )
})
