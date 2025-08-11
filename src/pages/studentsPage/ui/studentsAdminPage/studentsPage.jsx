
import {ClassAddForm} from "features/classProfile";
import {StudentCreateClass} from "features/studentCreateClass";
import React, { useCallback, useEffect, useMemo, useState} from "react";

import {useDispatch, useSelector} from "react-redux";

import {
    DeletedStudents,
    NewStudents,
    Students,
    fetchOnlyStudyingStudentsData,
    fetchOnlyDeletedStudentsData,
    getNewStudentsData,
    getStudyingStudents,
    getOnlyDeletedStudents, fetchOnlyNewStudentsData,
} from "entities/students";
import {StudentsHeader} from "entities/students";
import {StudentsFilter} from "features/filters/studentsFilter";

import {Pagination} from "features/pagination";
import {useNavigate} from "react-router";
import {DefaultPageLoader} from "shared/ui/defaultLoader";
import {Modal} from "shared/ui/modal";
import {Form} from "shared/ui/form";
import {Select} from "shared/ui/select";
import {fetchTeachersData, getTeachers} from "entities/teachers";
import {useForm} from "react-hook-form";
import {

    getLoadingStudyingStudents, getTotalCount
} from "entities/students/model/selector/studentsSelector";
import {fetchStudentsByClass} from "entities/students/model/studentsThunk";
import {Radio} from "shared/ui/radio";
import {Input} from "shared/ui/input";
import {useTheme} from "shared/lib/hooks/useTheme";
import {getSearchValue} from "features/searchInput";

import {useSearchParams} from "react-router-dom";

import {useHttp} from "shared/api/base";
import {
    savePageTypeToLocalStorage,
    getPageTypeFromLocalStorage,

} from "features/pagesType";
import {
    fetchLanguagesData,
    fetchClassColorData,
    fetchClassNumberData,
    getClassNumberData,
    getClassColorData,
    getLanguagesData
} from "entities/oftenUsed"

import cls from "./students.module.sass"
import {getTeachersSelect} from "entities/oftenUsed/model/oftenUsedSelector";
import {fetchTeachersForSelect} from "entities/oftenUsed/model/oftenUsedThunk";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {studentsReducer} from "entities/students/model/studentsSlice.js";
import {getUserBranchId} from "entities/profile/userProfile/index.js";

const studentsFilter = [
    {name: "new_students", label: "New Students"},
    {name: "studying_students", label: "Studying Students"},
    {name: "deleted_students", label: "Deleted Students"},
];

const branches = [
    {name: "chirhciq"},
    {name: "gazalkent"},
    {name: "xo'jakent"},
];


const initialReducers = {
    newStudents: studentsReducer
};

export const StudentsPage = () => {

    const dispatch = useDispatch()
    const [searchParams] = useSearchParams();
    const {register, handleSubmit} = useForm();
    const userBranchId = useSelector(getUserBranchId)


    const search = useSelector(getSearchValue);
    const schoolClassNumbers = useSelector(getClassNumberData);
    const schoolClassColors = useSelector(getClassColorData);
    const teachers = useSelector(getTeachersSelect);
    const languages = useSelector(getLanguagesData);
    const studyingStudents = useSelector(getStudyingStudents);
    const newStudents = useSelector(getNewStudentsData);
    const deletedStudents = useSelector(getOnlyDeletedStudents)
    const loadingStudents = useSelector(getLoadingStudyingStudents);


    const [selectedColor, setSelectedColor] = useState(null)


    const [selectedRadio, setSelectedRadio] = useState(getPageTypeFromLocalStorage("selectedRadio") || studentsFilter[0].name);
    const [data, setData] = useState({})
    const [selectColor, setSelectColor] = useState();
    const [colorError, setColorError] = useState(false);
    const [selectTeacher, setSelectTeacher] = useState();
    const [activeModal, setActiveModal] = useState(false);
    const [active, setActive] = useState("");
    const [isFilter, setIsFilter] = useState("");
    const [currentTableData, setCurrentTableData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFormBtn, setActiveFormBtn] = useState(true)

    const totalCount = useSelector(getTotalCount)

    let PageSize = useMemo(() => 50, []);


    const searchedUsers = useMemo(() => {
        let filteredStudents = [];
        switch (selectedRadio) {
            case "new_students":
                filteredStudents = newStudents?.slice();
                break;
            case "studying_students":
                filteredStudents = studyingStudents?.slice();
                break;
            case "deleted_students":
                filteredStudents = deletedStudents?.slice();
                break;
            default:
                filteredStudents = [];
        }

        // setCurrentPage(1);

        if (!search) return filteredStudents;

        return filteredStudents.filter(item =>
            (item.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
                item.user?.surname?.toLowerCase().includes(search.toLowerCase()) ||
                item?.student?.user?.name.toLowerCase().includes(search.toLowerCase()) ||
                item?.student?.user?.surname.toLowerCase().includes(search.toLowerCase()))
        );
    }, [newStudents, studyingStudents, deletedStudents, search, selectedRadio, isFilter]);

    useEffect(() => {
        if (userBranchId) {
            dispatch(fetchTeachersForSelect(userBranchId))
            dispatch(fetchLanguagesData())
        }
    }, [userBranchId])


    useEffect(() => {
        if (userBranchId) {
            // dispatch(fetchSchoolStudents({userBranchId}))
            dispatch(fetchClassColorData())
            dispatch(fetchClassNumberData({branch: userBranchId}))
        }
    }, [userBranchId])

    const onSubmit = (data) => {
        if (!selectColor && schoolClassColors.length <= 3) {
            setColorError(true)
            return null
        }
        const res = {
            ...data,
            teacher: [+selectTeacher],
            // students: selectStudents,
            color: data?.color ?? selectColor,
            branch: userBranchId,
            create_type: "school",
        }
        setData(res)
        setActive("post")
    }

    const onSubmitFilteredByClass = (data) => {
        setActiveFormBtn(schoolClassNumbers.filter(item => item.id === +data)[0]?.price === 0 || !schoolClassNumbers.filter(item => item.id === +data)[0]?.price)
        dispatch(fetchStudentsByClass({branch: userBranchId, number: data}))
    }


    //
    // useEffect(() => {
    //     if (!userBranchId) return;
    //
    //     switch (selectedRadio) {
    //         case "new_students":
    //             dispatch(fetchOnlyNewStudentsData({userBranchId: userBranchId}));
    //             break;
    //         case "studying_students":
    //             dispatch(fetchOnlyStudyingStudentsData({userBranchId: userBranchId}));
    //             break;
    //         case "deleted_students":
    //             dispatch(fetchOnlyDeletedStudentsData({id: userBranchId}));
    //             break;
    //         default:
    //             break;
    //     }
    // }, [dispatch, selectedRadio, userBranchId]);

    useEffect(() => {

        const type = searchParams.get("type")


        if (type) {
            setSelectedRadio(type)
        }
    }, [searchParams])

    useEffect(() => {
        savePageTypeToLocalStorage("selectedRadio", selectedRadio);
    }, [selectedRadio]);


    const handleChange = (value) => {
        setSelectedRadio(value);
    };



    const renderStudents = useCallback(() => {
        switch (selectedRadio) {
            // case "new_students":
            //
            //     return (
            //         <NewStudents
            //             branchId={userBranchId}
            //
            //             // currentTableData={searchedUsers.slice((currentPage - 1) * PageSize, currentPage * PageSize)}
            //             currentTableData={currentTableData}
            //         />
            //     );
            // case "deleted_students":
            //
            //     return <DeletedStudents
            //         // currentTableData={searchedUsers.slice((currentPage - 1) * PageSize, currentPage * PageSize)}
            //         currentTableData={currentTableData}
            //     />;
            case "studying_students":
                return <Students
                    // currentTableData={searchedUsers.slice((currentPage - 1) * PageSize, currentPage * PageSize)}
                    currentTableData={studyingStudents}
                />;
            default:
                return null;
        }
    }, [loadingStudents, selectedRadio, currentTableData])

    const renderNewStudents = renderStudents()


    const types = useMemo(() => {
        return [
            {
                name: "Yangi o'quvchilar",
                type: "new_students"
            },
            {
                name: "O'chirilgan o'quvchilar",
                type: "deleted_students"
            },
            {
                name: "O'qiyotgan o'quvchilar",
                type: "studying_students"
            }
        ]
    }, [])

    console.log(studyingStudents, "studyingStudents")

    return (

        <DynamicModuleLoader reducers={initialReducers}>


            <StudentsHeader
                // selected={selected}
                // setSelected={setSelected}
                // branches={branches}
                // active={active}
                setActive={setActive}
                onChange={handleChange}
                selectedRadio={selectedRadio}
                // setSelectedRadio={setSelectedRadio}
                peoples={studentsFilter}
                // theme={__THEME__ === "app_school_theme"}
                onClick={setActiveModal}
            />

            <div className={cls.tableMain}>
                {loadingStudents === true ? <DefaultPageLoader/> : renderNewStudents}
            </div>
            <Pagination
                totalCount={totalCount}
                currentPage={currentPage}
                pageSize={PageSize}
                onPageChange={page => {
                    setCurrentPage(page)
                }}
                type={"custom"}
            />


            <StudentsFilter
                currentPage={currentPage}
                pageSize={PageSize}
                active={active === "filter"}
                setActive={setActive}
                activePage={selectedRadio}
                setIsFilter={setIsFilter}
                branchId={userBranchId}
            />
            <Modal
                active={activeModal === "create"}
                setActive={setActiveModal}
            >
                <div className={cls.modal}>
                    <h1>Sinf yaratish</h1>
                    <Form
                        onSubmit={handleSubmit(onSubmit)}
                        extraClassname={cls.modal__form}
                        typeSubmit={activeFormBtn ? "" : "inside"}
                    >
                        <Select
                            required
                            extraClass={cls.modal__select}
                            title={"O'qituvchi"}
                            options={teachers}
                            onChangeOption={setSelectTeacher}
                        />
                        <Select
                            required
                            extraClass={cls.modal__select}
                            title={"Til"}
                            options={languages}
                            register={register}
                            name={"language"}
                        />
                        <Select
                            required
                            extraClass={cls.modal__select}
                            title={"Sinf raqami"}
                            options={schoolClassNumbers}
                            register={register}
                            onChangeOption={onSubmitFilteredByClass}
                            name={"class_number"}
                        />
                        {
                            colorError ? <span className={cls.modal__error}>Sinfga rang tanlang</span> : null
                        }
                        {
                            schoolClassColors.length <= 3 ?
                                <div className={cls.modal__radios}>
                                    {
                                        schoolClassColors?.map(item => {
                                            return (
                                                <div className={cls.modal__inner}>
                                                    <Radio
                                                        extraClasses={cls.modal__item}
                                                        onChange={() => {
                                                            setSelectColor(item.id)
                                                            setColorError(false)
                                                        }}
                                                        checked={selectColor === item.id}
                                                        name={"color"}
                                                    />
                                                    {
                                                        item.name
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                :
                                <Select
                                    required
                                    extraClass={cls.modal__select}
                                    title={"Sinf rangi"}
                                    name={"color"}
                                    options={schoolClassColors}
                                    register={register}
                                    // onChangeOption={setSelectedColor}
                                />
                        }
                    </Form>
                </div>
            </Modal>
            <ClassAddForm
                branch={userBranchId}
                setActive={setActiveModal}
                active={activeModal === "add"}
            />
            <StudentCreateClass
                deactiveModal={setActiveModal}
                setActive={setActive}
                active={active === "post"}
                data={data}
                branch={userBranchId}
            />


        </DynamicModuleLoader>
    )
}