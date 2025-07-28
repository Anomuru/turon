import {getBranch} from "features/branchSwitcher";
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
import {MultiPage} from "widgets/multiPage/ui/MultiPage/MultiPage";
import {useParams} from "react-router-dom";
import {API_URL, headers, useHttp} from "shared/api/base";

import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import {onDelete} from "entities/teachers/model/teacherSlice";
import {getDeletedTeacher} from "entities/teachers/model/selector/teacherSelector";

import {EmployerCategoryPage} from "../../employeesPage";
import {ConfirmModal} from "../../../shared/ui/confirmModal";


export const TeachersPage = () => {
    const {theme} = useTheme()
    const loading = useSelector(getTeacherLoading)
    const search = useSelector(getSearchValue)
    const teachersData = useSelector(getTeachers)
    const deletedTeacher = useSelector(getDeletedTeacher)
    const filteredTeachersData = useSelector(getTeachersWithFilter)
    const dispatch = useDispatch()
    const {id} = useSelector(getBranch)
    const userBranchId = id


    useEffect(() => {
        if (!userBranchId) return;
        dispatch(fetchTeachersData({userBranchId}))

    }, [dispatch, userBranchId])


    let PageSize = useMemo(() => 30, [])
    const [currentTableData, setCurrentTableData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState()
    const [active, setActive] = useState()
    const [activeSwitch, setActiveSwitch] = useState(false)
    const [activeDelete, setActiveDelete] = useState({})
    const [activeCategory, setActiveCategory] = useState(false)

    const [activeModal, setActiveModal] = useState(false)
    const [isFilter, setIsFilter] = useState(false)

    const {request} = useHttp()

    const searchedUsers = useMemo(() => {
        const filteredHeroes = isFilter ? filteredTeachersData.slice() : teachersData.slice()
        setCurrentPage(1)
        if (!search) return filteredHeroes
        return filteredHeroes.filter(item =>
            (item?.name?.toLowerCase().includes(search.toLowerCase()) ||
                item?.surname?.toLowerCase().includes(search.toLowerCase()))
        );
    }, [teachersData, filteredTeachersData, setCurrentPage, search, isFilter])


    const searchedUsersDel = useMemo(() => {
        const filteredHeroes = isFilter ? filteredTeachersData.slice() : deletedTeacher.slice()
        setCurrentPage(1)
        if (!search) return filteredHeroes
        return filteredHeroes.filter(item =>
            (item?.name?.toLowerCase().includes(search.toLowerCase()) ||
                item?.surname?.toLowerCase().includes(search.toLowerCase()))
        );
    }, [deletedTeacher, filteredTeachersData, setCurrentPage, search, isFilter])
    const types = [
        {
            name: "O'qituvchilar",
            type: "teachers"
        }
    ];

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
        <MultiPage types={types} page={"teachers"}>
            <div className={cls.teacher}>

                <div className={cls.teacher__filter}>
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

                    <h2>{activeCategory ? "Toifa " : activeSwitch ? "Deleted Teachers" : "Teachers"}</h2>
                    {activeCategory ?
                        <EmployerCategoryPage extraClass={cls.categoryItem}/>
                        :
                        activeSwitch ?
                            <DeletedTeachers
                                data={searchedUsersDel.slice((currentPage - 1) * PageSize, currentPage * PageSize)}
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
                                data={searchedUsers.slice((currentPage - 1) * PageSize, currentPage * PageSize)}
                                // data={currentTableData}
                            />
                    }
                </div>

                <Pagination
                    setCurrentTableData={setCurrentTableData}
                    users={activeSwitch ? searchedUsersDel : searchedUsers}
                    search={search}
                    setCurrentPage={setCurrentPage}
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
                />
            </div>

            <ConfirmModal setActive={setActiveModal} active={activeModal} onClick={onClick}   type={"danger"}/>
        </MultiPage>

    )
}