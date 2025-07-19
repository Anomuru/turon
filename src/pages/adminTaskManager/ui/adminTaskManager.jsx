import {TaskManagerLeft, TaskManagerRight} from "features/taskManager";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {fetchAdminTaskManager, fetchBranch, fetchTaskManager} from "features/taskManager/modal/taskManagerThunk";
import {formatDate} from "shared/ui/formDate/formDate";
import {getBranch} from "features/branchSwitcher";
import {Select} from "../../../shared/ui/select";

import cls from "./adminTaskManager.module.sass";
import {AdminTaskManagerList} from "../../../entities/adminTaskManager";
import {fetchOperatorsData, getOperatorsData} from "../../../entities/oftenUsed";
import {Button} from "shared/ui/button";
import {Link} from "react-router-dom";


export const AdminTaskManager = () => {

    const dispatch = useDispatch()
    const {id} = useSelector(getBranch)
    const operators = useSelector(getOperatorsData)

    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedOperator, setSelectedOperator] = useState("all")

    const [taskType, setTaskType] = useState('progress')
    const formatted = formatDate(selectedDate)

    useEffect(() => {
        dispatch(fetchAdminTaskManager({
            operator_id: selectedOperator,
            date: formatted,
            branch: id,
            taskType: taskType
        }))
    }, [selectedOperator, formatted, taskType])

    useEffect(() => {
        dispatch(fetchBranch())
        dispatch(fetchOperatorsData())
    }, [])

    return (
        <div className={cls.container}>
            <div className={cls.box}>
                <div className={cls.box__header}>
                    <h1 className={cls.box__header_title}>
                        My Projects
                    </h1>
                    <Link to={"../filteredLeadsList"}>
                        <Button>
                            New Leads
                        </Button>
                    </Link>
                    <Select
                        defaultValue={selectedOperator}
                        onChangeOption={setSelectedOperator}
                        extraClass={cls.select}
                        title={"Operators"}
                        options={[...operators, {name: "Hammasi", id: "all"}]}
                    />
                </div>

                <div className={cls.box__sides}>
                    <AdminTaskManagerList setTaskType={setTaskType} taskType={taskType} formatted={formatted}/>
                    <TaskManagerRight selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
                </div>
            </div>
        </div>
    );
}