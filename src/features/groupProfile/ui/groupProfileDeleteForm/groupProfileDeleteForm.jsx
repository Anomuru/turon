import {
    getDebtStudents,
    getFilteredGroups,
    getGroupProfileFilteredStudents,
    getGroupProfileFilteredTeachers,
    getReasons,
    getStudyMonths
} from "entities/profile/groupProfile/model/groupProfileSelector";
import {
    fetchFilteredGroups,
    filteredStudents,
    getGroupDebtStudents,
    getGroupStudyMonth,
    getGroupStudyYears,
    moveGroup
} from "entities/profile/groupProfile/model/groupProfileThunk";
import {fetchTeachersData, getTeachers} from "entities/teachers";
import {getUserBranchId} from "entities/profile/userProfile/model/userProfileSelector";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import classNames from "classnames";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";

import {
    changeDebtStudent,
    changeGroupProfile,
    deleteDebtStudent,
    getGroupProfileData,
    getStudyYears
} from "entities/profile/groupProfile";
import {amountService, amountTypes} from "entities/profile/studentProfile";
import {useNavigate, useParams} from "react-router";
import {useTheme} from "shared/lib/hooks/useTheme";
import {ConfirmModal} from "shared/ui/confirmModal";
import {EditableCard} from "shared/ui/editableCard";
import {Modal} from "shared/ui/modal";
import {Form} from "shared/ui/form";
import {Button} from "shared/ui/button";
import {Input} from "shared/ui/input";
import {Radio} from "shared/ui/radio";
import {Select} from "shared/ui/select";
import {Table} from "shared/ui/table";

import cls from "./groupProfileDeleteForm.module.sass";
import defaultUserImg from "shared/assets/images/user_image.png";
import bank from "shared/assets/images/Bank.png";
import creditCard from "shared/assets/images/CreditCard.png";
import money from "shared/assets/images/Money.png";
import {API_URL, headers, useHttp} from "../../../../shared/api/base";
import {onMoveToGroup} from "entities/profile/groupProfile/model/groupProfileSlice";

const listPretcent = [-1, 34.8, 70.4]

const deleteTypeList = [
    {
        id: "deleted",
        name: "O'chirilganlar"
    },
    {
        id: "new_students",
        name: "Yangi o'quvchilar"
    }
]

export const GroupProfileDeleteForm = memo(({branch, system}) => {

    const {
        register,
        handleSubmit
    } = useForm()
    const {request} = useHttp()

    const {theme} = useTheme()
    const {id} = useParams()
    // const {id} = useSelector(getBranch)
    const dispatch = useDispatch()
    const navigation = useNavigate()
    const userSystem = JSON.parse(localStorage.getItem("selectedSystem")) // changed
    const userBranchId = useSelector(getUserBranchId)
    const data = useSelector(getGroupProfileData)
    const students = useSelector(getGroupProfileFilteredStudents)
    const teachers = useSelector(getGroupProfileFilteredTeachers)
    const schoolTeachers = useSelector(getTeachers)
    const groups = useSelector(getFilteredGroups)
    const reasons = useSelector(getReasons)
    const studyYears = useSelector(getStudyYears)
    const studyMonths = useSelector(getStudyMonths)
    const debtStudents = useSelector(getDebtStudents)

    const [isDeleted, setIsDeleted] = useState(false)
    const [dataDeleted, setDataDeleted] = useState(null)

    useEffect(() => {
        if (data && branch) {
            dispatch(filteredStudents({
                userBranchId: branch,
                group_id: data?.id,
                res: {ignore_students: data?.students.map(item => item.id)}
            }))
            dispatch(fetchTeachersData({userBranchId: branch}))
            dispatch(getGroupStudyYears({id: data?.id}))
        }
    }, [data, branch])

    const [active, setActive] = useState(false)
    const [activeModal, setActiveModal] = useState("")
    const [select, setSelect] = useState([])
    console.log(select)
    const [selectDeleteId, setSelectDeleteId] = useState(null)
    const [selectOpt, setSelectOpt] = useState(null)
    const [selectOptId, setSelectOptId] = useState(null)
    const [activeService, setActiveService] = useState(amountService[0])
    const [activePaymentType, setActivePaymentType] = useState(0)
    const [selectedId, setSelectedId] = useState([])

    const [selectedMonthId, setSelectedMonthId] = useState(null)
    const [selectedYearId, setSelectedYearId] = useState(null)
    const [selectedChange, setSelectedChange] = useState(null)
    const [activeMonthDebt, setActiveMonthDebt] = useState(false)
    const [activeDebt, setActiveDebt] = useState(false)
    const [canDelete, setCanDelete] = useState(false)

    const [searchValue, setSearchValue] = useState("")
    const [currentTeachersData, setCurrentTeachersData] = useState([])


    const searched = useMemo(() => {
        const filteredSlice = students?.slice()

        return filteredSlice?.filter(item =>
            item?.user?.name?.toLowerCase().includes(searchValue?.toLowerCase()) ||
            item?.user?.surname?.toLowerCase().includes(searchValue?.toLowerCase())
        )
    }, [students, searchValue])


    const onSubmitDelete = () => {
        const place = userSystem?.name === "center" ? "guruh" : "sinf"
        const selectedStudent = data?.students?.filter(item => item.id === selectDeleteId)[0]?.user
        const res = {
            ...dataDeleted,
            students: [selectDeleteId],
            update_method: "remove_students"
        }
        dispatch(changeGroupProfile({
            id,
            data: res,
            group_type: userSystem?.name
        }))
        dispatch(onAddAlertOptions({
            type: "success",
            status: true,
            msg: `${selectedStudent?.name} ${selectedStudent?.surname} ${place}dan o'chirildi`
        }))
        setIsDeleted(false)
    }

    const onDelete = (data) => {
        setDataDeleted(data)
        setIsDeleted(true)
    }

    const onSubmitMove = (data) => {
        let msg;

        if (theme === "app_school_theme" || userSystem?.name === "school") {
            const res = {
                ...data,
                students: select
            }



            request(`${API_URL}Group/filtered_students_move_to_class/?branch=${branch}&group=${id}`, "POST", JSON.stringify(res), headers())
               .then((res) =>{
                   dispatch(onAddAlertOptions({
                       type: "success",
                       status: true,
                       msg: "O'quvchilar sinfga o'tqazildi"

                   }))
                   dispatch(onMoveToGroup(select));
                   setSelect([])
                   setActive(false)
                   setActiveModal("")
               })



            // dispatch(moveToClass({branch, id, res}))
        } else {
            const res = {
                ...data,
                students: select
            }
            dispatch(moveGroup({id, res}))
            msg = `O'quvchilar boshqa guruhga o'tqazildi`
        }
        dispatch(onAddAlertOptions({
            type: "success",
            status: true,
            msg: msg
        }))
    }

    const onSubmitAddStudents = () => {

        const place = userSystem?.name === "center" ? "guruh" : "sinf"
        dispatch(changeGroupProfile({
            data: {
                students: selectedId,
                update_method: "add_students"
            },
            id,
            group_type: userSystem?.name
            // group_type: "center"
        }))
        dispatch(onAddAlertOptions({
            type: "success",
            status: true,
            msg: `O'quvchilar ${place}ga qo'shildi`
        }))
    }

    const onChangePaymentMonth = (data) => {
        console.log(data, "data")
        request(`${API_URL}Attendance/attendance_per_month_delete/${selectedChange?.attendance_id}/`, "PUT", JSON.stringify(data), headers())
            .then(res => {
                console.log(res)
                dispatch(changeDebtStudent({id: selectedChange.id, res}))
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: res.msg
                }))
                setActiveDebt(false)
            })
            .catch(err => console.log(err))
    }

    const onDeleteDebtMonth = () => {
        request(`${API_URL}Attendance/attendance_per_month_delete/${selectedChange.attendance_id}/`, "DELETE", null, headers())
            .then(res => {
                dispatch(deleteDebtStudent(selectedChange?.id))
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: res.msg
                }))
                setCanDelete(false)
                setActiveDebt(false)
                // dispatch(fetchStudentDebtorData(id))
                // dispatch(onDeleteDebtorData(changedData.id))

            })
    }

    const changeMonthId = useCallback((monthId) => {
        setSelectedMonthId(monthId)
        dispatch(getGroupDebtStudents({id: data?.id, res: {year: selectedYearId, month: monthId}}))
    }, [selectedYearId])

    const changeYearId = useCallback((id) => {
        setSelectedYearId(id)
        setSelectedMonthId(null)
        dispatch(getGroupStudyMonth({id: data?.id, res: id}))
        // request(`${API_URL}/${id}`, "POST")
        //     .then(res => console.log(res))
        //     .catch(err => console.log(err))
    }, [])

    const onFilterGroups = (id) => {
        dispatch(fetchFilteredGroups({id, group_id: data?.id}))
    }


    const renderDebtorData = useCallback(() => {
        if (selectedYearId && selectedMonthId)
            return debtStudents?.map((item, i) => {
                return (
                    <tr>
                        <td>{i + 1}</td>
                        <td
                            // onClick={() => {
                            //     setValue("payment_sum", item.discount_sum)
                            //     setValue("reason", item.discount_reason)
                            //     setActiveModal(true)
                            //     setItemChange(item.discount_id)
                            // }}
                        >
                            {item?.name} {item?.surname}
                        </td>
                        <td>{item?.total_debt}</td>
                        <td>{item?.remaining_debt}</td>
                        <td>{item?.charity}</td>
                        <td>{item?.discount}</td>
                        {/*<td>{item?.discount_sum}</td>*/}
                        <td>{item?.reason}</td>
                        {/*<td>{item?.cash}</td>*/}
                        {/*<td>{item?.click}</td>*/}
                        {/*<td>{item?.bank}</td>*/}
                        <td>
                            <i
                                onClick={() => {
                                    setActiveDebt(true)
                                    setSelectedChange(item)
                                }}
                                className="fas fa-pen"
                            />
                        </td>
                        {/*<td>*/}
                        {/*    <i*/}
                        {/*        onClick={() => {*/}
                        {/*            setChangedData(item.id)*/}
                        {/*            setCanDelete(true)*/}
                        {/*        }}*/}
                        {/*        style={{color: '#FF3737FF'}}*/}
                        {/*        className={`fa-solid fa-xmark `}*/}
                        {/*    ></i>*/}
                        {/*</td>*/}
                        {/*{*/}
                        {/*    job === "director" &&*/}
                        {/*    <td>*/}
                        {/*        <i*/}
                        {/*            onClick={() => {*/}
                        {/*                setChangedData(item)*/}
                        {/*                setCanChange(true)*/}
                        {/*                setValueChange("total_debt", item.total_debt)*/}
                        {/*            }}*/}
                        {/*            style={{color: '#484848'}}*/}
                        {/*            className={`fa-solid fa-pen `}*/}
                        {/*        ></i>*/}
                        {/*    </td>*/}
                        {/*}*/}
                    </tr>
                )
            })
    }, [debtStudents, selectedYearId, selectedMonthId])
    const handleSelect = (id) => {
        setSelect(prev => {
            const isSelected = prev.includes(id);
            return isSelected ? prev.filter(i => i !== id) : [...prev, id];
        });
    };
    useEffect(() => {
        setSelect(prev => prev.filter(id => students.some(student => student.id === id)));
    }, [students]);

    const renderStudents = () => {
        return data?.students?.map(item =>
            <tr>
                <td>
                    <div
                        className={cls.students__upper}
                        style={{backgroundColor: item.status}}
                    />
                </td>
                <td>
                    <img
                        onClick={() => navigation(`../students/profile/${item.id}`)}
                        src={defaultUserImg}
                        alt=""
                    />
                </td>
                <td>{item?.user?.name} {item?.user?.surname}</td>
                <td>
                    <div
                        className={classNames(cls.students__money, {
                            [cls.red]: item.status === "red",
                            [cls.yellow]: item.status === "yellow",
                        })}
                        onClick={() => setActiveModal("paymentModal")}
                    >
                        {item.debt}
                    </div>
                </td>
                {
                    active ?
                        <td>
                            <div className={cls.delete}>
                                <Input
                                    extraClassName={cls.delete__input}
                                    type={"checkbox"}
                                    onChange={() => {
                                        setSelect(prev => {
                                            if (prev.includes(item.id)) {
                                                return prev.filter(i => i !== item.id);
                                            } else {
                                                return [...prev, item.id];
                                            }
                                        });
                                    }}
                                />
                                <i
                                    className={classNames("fas fa-trash-alt", cls.delete__icon)}
                                    onClick={() => {
                                        setActiveModal("deleteModal")
                                        setSelectDeleteId(item?.id)
                                    }}
                                />
                            </div>
                        </td>
                        :
                        null
                }
            </tr>
        )
    }

    const renderStudentsData = () => {
        return searched?.map(item =>
            <tr>
                <td>
                    <img
                        src={defaultUserImg}
                        alt=""
                    />
                </td>
                <td>{item?.user?.name}</td>
                <td>{item?.user?.surname}</td>
                <td>
                    {/*{*/}
                    {/*    item?.subject?.map(i =>*/}
                    {/*        <div className={cls.addModal__subject}>*/}
                    {/*            {i?.name?.slice(0, 16)}*/}
                    {/*        </div>*/}
                    {/*    )*/}
                    {/*}*/}
                    {
                        item?.subject.length ?
                            <div className={cls.addModal__subject}>{item?.subject[0]?.name}</div> : null
                    }

                </td>
                <td>
                    <div className={cls.check}>
                        <Input
                            extraClassName={cls.check__input}
                            type={"checkbox"}
                            onChange={() => setSelectedId(prev => {
                                if (prev.filter(i => i === item.id)[0]) {
                                    return prev.filter(i => i !== item.id)
                                } else return [...prev, item.id]
                            })}
                        />
                        <div className={classNames(cls.status, {
                            [cls.active]: item?.extra_info?.status
                        })}>
                            <div className={classNames(cls.status__inner, {
                                [cls.active]: item?.extra_info?.status
                            })}/>
                        </div>
                    </div>
                </td>
            </tr>
        )
    }

    const renderAmountServiceTypes = useCallback(() => {
        return amountService.map(item =>
            <div className={cls.items__inner}>
                <Radio
                    extraClasses={cls.items__radio}
                    onChange={setActiveService}
                    value={item}
                    checked={item === activeService}
                />
                <p>{item}</p>
            </div>
        )
    }, [activeService])

    const renderAmountService = renderAmountServiceTypes()
    const render = renderStudents()
    const renderStudent = renderStudentsData()

    return (
        <>
            <EditableCard
                extraClass={cls.students}
                title={<i className="fas fa-edit"/>}
                onClick={() => setActive(!active)}
            >
                <div className={cls.students__title}>
                    <h1>O’quvchilar </h1>
                    <div className={cls.students__wrapperBtn}>
                        <i
                            className={classNames("fas fa-pen", cls.students__icon)}
                            onClick={() => setActiveMonthDebt(true)}
                        />
                        {
                            active ?
                                <div className={cls.students__wrapper}>
                                    <Button
                                        disabled={select?.length === 0}
                                        type={select?.length === 0 ? "disabled" : ""}
                                        extraClass={cls.students__btn}
                                        onClick={() => setActiveModal("changeModal")}
                                    >
                                        Move
                                    </Button>
                                    <Button
                                        extraClass={cls.students__btn}
                                        onClick={() => setActiveModal("addModal")}
                                    >
                                        Add
                                    </Button>

                                </div> : null
                        }
                    </div>
                </div>
                <div className={cls.students__list}>
                    <Table>
                        <tbody>
                        {render}
                        </tbody>
                    </Table>
                </div>
            </EditableCard>
            <Modal
                extraClass={cls.deleteForm}
                active={activeModal === "deleteModal"}
                setActive={setActiveModal}
            >
                <h1>O’chirish</h1>
                <Form
                    extraClassname={cls.deleteForm__form}
                    onSubmit={handleSubmit(onDelete)}
                    typeSubmit={""}
                >
                    <Select
                        extraClass={cls.deleteForm__select}
                        options={deleteTypeList}
                        title={"O'chirish uslubi"}
                        onChangeOption={setSelectOpt}
                        register={register}
                        name={"delete_type"}
                        required
                    />
                    {
                        selectOpt === "deleted" ?
                            <Select
                                extraClass={cls.deleteForm__select}
                                options={reasons}
                                title={"Sabablar"}
                                onChangeOption={setSelectOptId}
                                register={register}
                                name={"group_reason"}
                                required
                            /> : null
                    }
                    {
                        reasons?.filter(item =>
                            item?.id === +selectOptId)[0]?.name === "Boshqa" ||
                        selectOpt !== "deleted" ? <Input
                            extraClassName={cls.deleteForm__input}
                            placeholder={"Sabab"}
                            register={register}
                            name={"comment"}
                            required
                        /> : null
                    }
                    <Button extraClass={cls.deleteForm__btn}>Add</Button>
                </Form>
            </Modal>
            <Modal
                extraClass={cls.deleteForm}
                active={activeModal === "changeModal"}
                setActive={setActiveModal}
            >
                <h1>Boshqa guruhga qo’shish</h1>
                <Form
                    extraClassname={cls.deleteForm__form}
                    onSubmit={handleSubmit(onSubmitMove)}
                    typeSubmit={""}
                >
                    <Select
                        extraClass={cls.deleteForm__select}
                        options={userSystem?.name === "center" ? teachers : schoolTeachers}
                        title={"Teacher"}
                        onChangeOption={onFilterGroups}
                        // register={register}
                        // name={"teacher"}
                    />
                    <Select
                        extraClass={cls.deleteForm__select}
                        options={groups}
                        title={"Group"}
                        register={register}
                        name={"to_group_id"}
                    />
                    <Input
                        extraClassName={cls.deleteForm__input}
                        placeholder={"Sabab"}
                        register={register}
                        name={"reason"}
                    />
                    <Button extraClass={cls.deleteForm__btn}>Add</Button>
                </Form>
            </Modal>
            <Modal
                extraClass={cls.paymentForm}
                active={activeModal === "paymentModal"}
                setActive={setActiveModal}
            >
                <div className={cls.paymentForm__header}>
                    <h1>Umumiy Hisob</h1>
                    <div className={cls.items}>
                        <div className={cls.items__inner}>
                            <img src={money} alt=""/>
                            <p>12 000 000</p>
                        </div>
                        <div className={cls.items__inner}>
                            <img src={creditCard} alt=""/>
                            <p>11 000 000</p>
                        </div>
                        <div className={cls.items__inner}>
                            <img src={bank} alt=""/>
                            <p>11 000 000</p>
                        </div>
                    </div>
                </div>
                <div className={cls.paymentForm__content}>
                    <div className={cls.items}>
                        {renderAmountService}
                    </div>
                    <div className={cls.form}>
                        <h1>{activeService}</h1>
                        {
                            activeService === "To'lov"
                                ?
                                <>
                                    <div className={cls.items}>
                                        {
                                            amountTypes.map((item, index) =>
                                                <div
                                                    className={cls.items__inner}
                                                    onClick={() => setActivePaymentType(index)}
                                                >
                                                    <p>{item.name}</p>
                                                    <img src={item.image} alt=""/>
                                                </div>
                                            )
                                        }
                                        <div
                                            className={cls.items__active}
                                            style={{left: `${listPretcent[activePaymentType]}%`}}
                                        />
                                    </div>
                                    <Form onSubmit={handleSubmit()}>
                                        <div className={cls.form__inner}>
                                            <p>{activeService} miqdori</p>
                                            <Input
                                                register={register}
                                                name={"amount"}
                                                placeholder={"Summa"}
                                                // defaultValue={paymentSum}
                                                // onChange={(e) => setPaymentSum(e.target.value)}
                                                type={"number"}
                                            />

                                        </div>
                                    </Form>
                                </>
                                :
                                activeService === "Xayriya"
                                    ?
                                    <Form onSubmit={handleSubmit()}>
                                        <div className={cls.form__container}>
                                            <Select
                                                extraClass={cls.form__select}
                                            />
                                            <div className={cls.form__inner}>
                                                <p>{activeService} miqdori</p>
                                                <Input
                                                    register={register}
                                                    name={"amount"}
                                                    placeholder={"Summa"}
                                                    type={"number"}
                                                />
                                            </div>
                                        </div>
                                    </Form>
                                    :
                                    <Form onSubmit={handleSubmit()}>
                                        <div className={cls.form__inner}>
                                            <p>{activeService} miqdori</p>
                                            <Input
                                                register={register}
                                                name={"amount"}
                                                placeholder={"Summa"}
                                                type={"number"}
                                            />
                                        </div>
                                    </Form>
                        }
                    </div>
                </div>
            </Modal>
            <Modal
                active={activeModal === "addModal"}
                setActive={setActiveModal}
                extraClass={cls.addModal}
            >
                <Input
                    placeholder={"Search"}
                    onChange={(e) => setSearchValue(e.target.value)}
                    defaultValue={searchValue}
                />
                <div className={cls.addModal__container}>
                    <Table>
                        <thead>
                        <tr>
                            <th/>
                            <th>Ism</th>
                            <th>Familya</th>
                            {
                                system.name === "center" ? <th>Fanlar</th> : <th>Sinf</th>
                            }

                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {renderStudent}
                        </tbody>
                    </Table>
                </div>
                <Button
                    extraClass={cls.addModal__btn}
                    onClick={onSubmitAddStudents}
                >
                    Add
                </Button>
            </Modal>
            <Modal
                active={activeMonthDebt}
                setActive={setActiveMonthDebt}
                extraClass={cls.changeModal}
            >

                <div className={cls.changeModal__title}>
                    <h1>Oylik qarz o'zgartirish</h1>
                    <div className={cls.changeModal__wrapper}>
                        <Select
                            defaultValue={selectedYearId}
                            // extraClass={cls.changeModal__input}
                            onChangeOption={changeYearId}
                            options={studyYears}
                            keyValue={"year"}
                        />
                        <Select
                            status={!selectedYearId && !selectedMonthId ? "disabled" : null}
                            defaultValue={selectedMonthId ?? "clear"}
                            // extraClass={cls.changeModal__input}
                            onChangeOption={changeMonthId}
                            options={studyMonths}
                            keyValue={"month"}
                        />
                    </div>
                </div>
                <div className={cls.tableDebt}>
                    <Table>
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Full name</th>
                            <th>Umumiy qarz</th>
                            <th>Qolgan qarz</th>
                            <th>Xayriya</th>
                            <th>Chegirma</th>
                            <th>Chegirma sababi</th>
                            {/*<th>Cash</th>*/}
                            {/*<th>Click</th>*/}
                            {/*<th>Bank</th>*/}
                            {/*<th></th>*/}
                        </tr>
                        </thead>
                        <tbody>
                        {renderDebtorData()}
                        </tbody>
                    </Table>
                </div>

            </Modal>
            <Modal
                active={activeDebt}
                setActive={setActiveDebt}
                // extraClass={cls.changeModal}
            >
                <Form
                    onSubmit={handleSubmit(onChangePaymentMonth)}
                    extraClassname={cls.changeModal}
                    id={"changeForm"} typeSubmit={"outside"}
                >
                    <h1>Oylik qarz o'zgartirish</h1>
                    <Input
                        extraClassName={cls.changeModal__input}
                        value={selectedChange?.total_debt}
                        register={register}
                        name={"total_debt"}
                    />
                    <div className={cls.changeModal__btns}>
                        <Button
                            onClick={() => {
                                setCanDelete(true)

                            }}
                            type={"danger"} id={""}
                        >
                            O'chirish
                        </Button>
                        <Button id={"changeForm"}>
                            O'zgartirish
                        </Button>
                    </div>
                </Form>
                <ConfirmModal
                    title={`${selectedChange?.name} ${selectedChange?.surname} o'chirishni hohlaysizmi`}
                    setActive={setCanDelete}
                    active={canDelete}
                    onClick={onDeleteDebtMonth}
                    type={"danger"}
                />
            </Modal>
            <ConfirmModal
                type={"danger"}
                active={isDeleted}
                setActive={setIsDeleted}
                onClick={onSubmitDelete}
            />
        </>
    )
})
