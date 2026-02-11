import React, {useState} from 'react';
import {Table} from "shared/ui/table";
import cls from './teacherSalaryList.module.sass';
import {Link} from "shared/ui/link";
import {Button} from "shared/ui/button";
import {useTheme} from "shared/lib/hooks/useTheme";
import {SchoolTeacherCountDayModal} from "features/teacherModals";
import {useNavigate} from "react-router";
import {useSelector} from "react-redux";
import {getTeacherSalaryLoading} from "../../model/selectors/selectors";
import {DefaultPageLoader} from "../../../../shared/ui/defaultLoader";

export const TeacherSalaryList = ({currentTableData, currentPage, PageSize}) => {
    const safeData = Array.isArray(currentTableData) ? currentTableData : [currentTableData];
    const {theme} = useTheme()
    const navigation = useNavigate()
    const themes = theme === "app_school_theme"
    const [editMode, setEditMode] = useState(false)
    const [teacherData, setTeacherData] = useState(null)
    const loading = useSelector(getTeacherSalaryLoading)


    const renderStudents = () => {
        return safeData.map((item, index) => (
            <tr key={index + 1}>
                <td>{(currentPage - 1) * PageSize + index + 1}</td>
                <td onClick={() => navigation(`giveTeacherSalaryPage/${item?.id}`)}>{item?.total_salary}</td>
                <td>{item?.taken_salary}</td>
                <td>{item?.remaining_salary}</td>
                <td>{item?.month_date}</td>
                {
                    themes ? <td><Button
                        onClick={() => {
                            setEditMode(() => !editMode)
                            setTeacherData(item)
                        }}
                        extraClass={cls.buttonHelper}

                    >
                        <i className={"fas fa-pencil"}></i>
                    </Button></td> : null
                }
            </tr>
        ));
    };

    return (
        <>

            <Table>
                <thead className={cls.theadBody}>
                <tr>
                    <th>№</th>
                    <th>Umumiy oylik</th>
                    <th>Olingan oylik</th>
                    <th>Qolgan oylik</th>
                    <th>Sana</th>
                    {
                        themes ? <th>Edit</th> : null
                    }
                </tr>
                </thead>
                <tbody>
                {loading ? <DefaultPageLoader/> : renderStudents()}
                </tbody>
            </Table>
            <SchoolTeacherCountDayModal setEditMode={setEditMode} editMode={editMode} teacherData={teacherData}/>
        </>

    );
};
