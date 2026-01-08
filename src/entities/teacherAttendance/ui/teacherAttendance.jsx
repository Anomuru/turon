import { getUserBranchId } from "entities/profile/userProfile/index.js";
import { fetchGroupsAttendance } from "entities/teacherAttendance/model/teacherAttendanceThunk.js";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { DefaultPageLoader } from "shared/ui/defaultLoader/index.js";
import { Input } from "shared/ui/input/index.js";
import { Table } from "shared/ui/table/index.js";

import cls from "./teacherAttendance.module.sass";

export const TeacherAttendance = () => {
    const dispatch = useDispatch();

    const { attendance, loading } = useSelector(
        (state) => state.teacherAttendanceSlice
    );
    const userBranchId = useSelector(getUserBranchId);

    const [selectedDate, setSelectedDate] = useState("");

    const { id } = useParams();

    // 🔹 default oy + yil
    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        setSelectedDate(`${year}-${month}`);
    }, []);

    useEffect(() => {
        if (selectedDate && userBranchId) {
            const [year, month] = selectedDate.split("-");

            dispatch(
                fetchGroupsAttendance({
                    userBranchId,
                    year,
                    month,
                    id,
                })
            );
        }
    }, [selectedDate, userBranchId]);

    const render = () =>
        attendance?.map((item, i) => (
            <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.day}</td>
                <td>{item.entry_time}</td>
                <td>{item.leave_time}</td>
            </tr>
        ));

    return (
        <div className={cls.studentAttendance}>
            <div className={cls.studentAttendance__header}>
                <div className={cls.selects}>
                    <Input
                        type="month"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
            </div>

            <div className={cls.studentAttendance__container}>
                {loading ? (
                    <DefaultPageLoader />
                ) : (
                    <Table>
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Kuni</th>
                            <th>Kirish vaqti</th>
                            <th>Chiqish vaqti</th>
                        </tr>
                        </thead>
                        <tbody>{render()}</tbody>
                    </Table>
                )}
            </div>
        </div>
    );
};
