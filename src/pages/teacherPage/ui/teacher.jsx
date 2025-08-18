import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {TeacherFilter} from "features/filters/teacherFilter";
import {Pagination} from "features/pagination";
import {getSearchValue} from "features/searchInput";
import {DeletedTeachers, Teachers} from "entities/teachers";
import {Button} from "shared/ui/button";
import cls from "./teacher.module.sass";
import {getTeachers} from "entities/teachers";
import {useTheme} from "shared/lib/hooks/useTheme";
import {getTeachersWithFilter} from "entities/teachers";
import {getTeacherLoading} from "entities/teachers";
import {fetchTeachersData} from "entities/teachers";

import {API_URL, headers, useHttp} from "shared/api/base";

import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import {onDelete} from "entities/teachers/model/teacherSlice";
import {getDeletedTeacher, getTotalCount} from "entities/teachers/model/selector/teacherSelector";

import {EmployerCategoryPage} from "../../employeesPage";
import {ConfirmModal} from "../../../shared/ui/confirmModal";
import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";



const reducers = {

}

export const TeachersPage = () => {
    const {theme} = useTheme()
    const loading = useSelector(getTeacherLoading)
    const search = useSelector(getSearchValue)
    const teachersData = useSelector(getTeachers)
    const deletedTeacher = useSelector(getDeletedTeacher)
    const filteredTeachersData = useSelector(getTeachersWithFilter)
    const dispatch = useDispatch()
    const teacherStatus = localStorage.getItem("teacherStatus")

    const totalCount = useSelector(getTotalCount)

    let PageSize = useMemo(() => 50, [])
    const [currentTableData, setCurrentTableData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState()
    const [active, setActive] = useState()
    const [activeSwitch, setActiveSwitch] = useState(teacherStatus === "true" )
    const [activeDelete, setActiveDelete] = useState({})
    const [activeCategory, setActiveCategory] = useState(false)

    const [activeModal, setActiveModal] = useState(false)
    const [isFilter, setIsFilter] = useState(false)

    const {request} = useHttp()




    const onClick = () => {
        const id = activeDelete.id
        request(`${API_URL}Teachers/teachers/delete/${id}/`, "DELETE", null, headers())
            .then(res => {
                if(res.status) {
                    dispatch(onDelete(id))
                }
                dispatch(onAddAlertOptions({
                    type: res.status ? "success" : "danger",
                    status: true,
                    msg: res.msg
                }))
                setActiveModal(false)
            })
            .catch(err => {
                dispatch(onAddAlertOptions({
                    type: "danger",
                    status: true,
                    msg: err.msg
                }))
            })
    }

    return (

            <DynamicModuleLoader reducers={reducers}>
                <div className={cls.teacher}>

                    <div className={cls.teacher__filter} style={{justifyContent: activeCategory ? "end" : "space-between"}}>
                        {activeCategory ? null :
                            <Button
                                status={"filter"}
                                extraClass={cls.extraCutClassFilter}
                                onClick={() => setActive(!active)}
                                type={"filter"}
                            >
                                Filter
                            </Button>}
                        <div className={cls.header_btn}>
                            {activeCategory ? null :
                                <Button type={"login"} status={"timeTable"}>
                                    time table
                                </Button>
                            }
                            <Button extraClass={cls.category} type={"simple"} onClick={() => setActiveCategory(!activeCategory)}>Toifa</Button>
                        </div>
                    </div>
                    <div className={cls.table}>

                        <h2>{activeCategory ? "Toifa " : activeSwitch === true ? "Deleted Teachers" : "Teachers"}</h2>
                        {activeCategory ?
                            <EmployerCategoryPage extraClass={cls.categoryItem}/>
                            :
                            activeSwitch === true ?
                                <DeletedTeachers
                                    data={filteredTeachersData}
                                    // data={teachersData}
                                    // data={searchedUsers}
                                />
                                :
                                <Teachers

                                    setActiveDelete={setActiveDelete}
                                    setActiveModal={setActiveModal}

                                    // onClick={onClick}
                                    theme={theme === "app_school_theme"}
                                    loading={getTeacherLoading}
                                    data={filteredTeachersData}
                                    // data={currentTableData}
                                />
                        }
                    </div>


                    <Pagination
                        totalCount={totalCount}
                        search={search}
                        currentPage={currentPage}
                        pageSize={PageSize}
                        onPageChange={page => {
                            setCurrentPage(page)
                        }}
                        type={"custom"}
                    />

                    <TeacherFilter
                        setIsFilter={setIsFilter}
                        activeSwitch={activeSwitch}
                        setActiveSwitch={setActiveSwitch}
                        setActive={setActive}
                        active={active}
                        currentPage={currentPage}
                        pageSize={PageSize}
                    />
                </div>

                <ConfirmModal setActive={setActiveModal} active={activeModal} onClick={onClick}   type={"danger"}/>
            </DynamicModuleLoader>


    )
}