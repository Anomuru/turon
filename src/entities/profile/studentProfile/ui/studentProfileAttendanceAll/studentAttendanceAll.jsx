import { memo, useEffect } from 'react';
import classNames from "classnames";

import { Table } from "shared/ui/table";
import { EditableCard } from "shared/ui/editableCard";

import cls from "./studentAttendanceAll.module.sass";
import { useDispatch, useSelector } from "react-redux";
import { getAllAttendances, getAllAttendanceDatas , getAllAttendancesData, studentProfileAttendanceAll } from "features/studentPayment";
import {StudentAttendanceAll} from "../../../../../features/studentProfileAttendanceAll";

export const StudentProfileAttendanceAll = memo(({ active, setActive, selectedGroup, selectedGroupName }) => {
    const pathArray = window.location.pathname.split('/');
    const lastId = pathArray[pathArray.length - 1];
    const dispatch = useDispatch();
    const allAttendanceData = useSelector(getAllAttendanceDatas);
    const mapData = allAttendanceData?.students || [];

    useEffect(() => {
        dispatch(studentProfileAttendanceAll(lastId));
    }, [lastId, dispatch]);
    const allDays = [...new Set(mapData.flatMap(student => student.days.map(day => day.day)))].sort((a, b) => a - b);

    const renderAttendance = (days) => {
        return allDays.map((day) => {
            const attendance = days.find(d => d.day === day);
            if (attendance) {
                return (
                    <td key={day}>
                        {attendance.status ? "✔️" : "❌"}
                    </td>
                );
            } else {
                return (
                    <td key={day}>
                        ❌
                    </td>
                );
            }
        });
    };

    return (
        <EditableCard
            extraClass={classNames(cls.totalAttendance, {
                [cls.active]: active === "allAttendance"
            })}
            titleType={"cross"}
            onClick={() => setActive("")}
        >
            <div className={cls.totalAttendance__container}>
                <h1>Student Davomatlari</h1>
                <div className={cls.totalAttendance__selectors}>
                    <StudentAttendanceAll />
                </div>
                <div className={cls.totalAttendance__table}>
                    <Table>
                        <thead>
                        <tr>
                            <th>Gruppa fani</th>
                            {allDays.map(day => (
                                <th key={day}>{day}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {mapData.map((student, index) => (
                            <tr key={index}>
                                <td>{student.name}</td>
                                {renderAttendance(student.days)}
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </EditableCard>
    );
});
