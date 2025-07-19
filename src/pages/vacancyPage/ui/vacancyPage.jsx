import {getVacancyLoading} from "features/vacancyModals/vacancyPageAdd/model/selectors/selectors";
import React, {useEffect, useMemo, useState} from "react";
import {Pagination} from "features/pagination";

import {Button} from "shared/ui/button";
import {DefaultPageLoader} from "shared/ui/defaultLoader";
import cls from "./vacancyPage.module.sass";
import {VacancyList} from "entities/vacancy/ui/vacancyList";
import {vacancyPageList} from "entities/vacancy/model";
import {VacancyPageEdit} from "features/vacancyModals/vacancyPageEdit";
import {VacancyAdd} from "entities/vacancy/ui/vacancyAdd";
import {useDispatch, useSelector} from "react-redux";
import {getVacancyJobs, fetchVacancyData} from "features/vacancyModals/vacancyPageAdd";
import {getSearchValue} from "features/searchInput";
import {getSystems} from "features/themeSwitcher";


export const VacancyPage = () => {
    const [active, setActive] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [modalActive, setModalActive] = useState(false);
    const search = useSelector(getSearchValue)
    let PageSize = useMemo(() => 10, [])
    const [currentTableData, setCurrentTableData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [modal, setModal] = useState(false);
    const [currentEditingVacancy, setCurrentEditingVacancy] = useState(null);
    const dispatch = useDispatch()
    const data = useSelector(getVacancyJobs)
    const loading = useSelector(getVacancyLoading)
    const systems = useSelector(getSystems)

    // const getVacancy = getVacancyData?.


    const searchedUsers = useMemo(() => {
        // if (!data?.jobs) return [];

        const filteredHeroes = data.slice()
        setCurrentPage(1);

        if (!search) return filteredHeroes;

        return filteredHeroes.filter(item =>
            item?.group?.name?.toLowerCase().includes(search.toLowerCase()) ||
            item?.system_id?.name?.toLowerCase().includes(search.toLowerCase())
        )

    }, [data, search]);


    useEffect(() => {
        dispatch(fetchVacancyData())
    }, [])

    const handleEditClick = (vacancy) => {
        setCurrentEditingVacancy(vacancy);
        setModal(true);
    };

    const handleVacancyChange = (updatedVacancy) => {
        setCurrentTableData(prevData =>
            prevData.map(vacancy =>
                vacancy.id === updatedVacancy.id ? updatedVacancy : vacancy
            )
        );
        setModal(false);
    };


    const addVacancy = (newVacancy) => {
        setCurrentTableData(prevData => [...prevData, {id: Date.now(), ...newVacancy}]);
    };
    if (loading) return <DefaultPageLoader/>

    return (
        <div className={cls.deletedGroups}>
            <div className={cls.mainContainer_filterPanelBox}>
            </div>
            <div className={cls.mainContainer_buttonPanelBox}>
                <div></div>
                <div className={cls.mainContainer_buttonPanelBox_leftCreateButton}>
                    <Button
                        extraClass={cls.buttonHelper}
                        onClick={() => setModalActive(true)}
                    >
                        <i className={"fas fa-plus"}></i>
                    </Button>
                    <Button
                        extraClass={cls.buttonHelper}
                        onClick={() => setEditMode(!editMode)}
                    >
                        <i className={"fas fa-pencil"}></i>
                    </Button>
                </div>
            </div>
            <div className={cls.mainContainer_tablePanelBox}>
                <VacancyList
                    currentTableData={currentTableData}
                    editMode={!editMode}
                    onEditClick={handleEditClick}
                />
            </div>
            <Pagination
                setCurrentTableData={setCurrentTableData}
                users={searchedUsers}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                pageSize={PageSize}
                onPageChange={page => {
                    setCurrentPage(page)
                }}
                type={"custom"}
            />
            <VacancyPageEdit
                setModal={setModal}
                modal={modal}
                vacancy={currentEditingVacancy}
                onSave={handleVacancyChange}
                systems={systems}
            />
            <VacancyAdd
                setActive={setModalActive}
                active={modalActive}
                addVacancy={addVacancy}
                systems={systems}
            />
        </div>
    );
};
