import {useDispatch, useSelector} from "react-redux";
import {
    getAttendance,
    getAttendanceList,
    getLoading
} from "../../../profilePage/model/selector/groupAttendanceSelector";
import cls from "./groupAttendance.module.sass";
import {Select} from "shared/ui/select";
import {Table} from "shared/ui/table";
import React, {useCallback, useEffect, useState} from "react";
import {Button} from "shared/ui/button";
import {Modal} from "shared/ui/modal";
import {fetchGroupAttendend, getAttendanceThunk} from "entities/groups/model/slice/groupsAttendanceThunk";
import {useParams} from "react-router";
import {API_URL, headers, useHttp} from "shared/api/base";
import {DefaultPageLoader} from "../../../../shared/ui/defaultLoader";
import {Form} from "../../../../shared/ui/form";
import {Textarea} from "../../../../shared/ui/textArea";
import {useForm} from "react-hook-form";
import {getBranch} from "../../../../features/branchSwitcher";


export const GroupAttendance = () => {


    const [attended, setAttended] = useState(false)
    const [activeModal, setActiveModal] = useState(false)

    const [month, setMonths] = useState(null)

    const [year, setYear] = useState(null)
    const attendanceList = useSelector(getAttendanceList)
    const loading = useSelector(getLoading)

    // const {id} = useParams()
    const {id} = useSelector(getBranch)

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchGroupAttendend(id))
    }, [])


    const checkTrueFalse = (data) => {
        if (data) {
            return data?.map(item => {
                
                if (item.status === true) {
                    return (
                        <td className="date true">
                            <i style={{color: "green", fontSize: "3rem"}} className={` fas fa-check`}></i>
                        </td>
                    )
                }
                if (item.status === false) {
                    return (
                        <td>
                            <div className={cls.th}>
                                <i className={`fas fa-times ${cls.check}`}></i>
                                {item.reason ?
                                    <div className={cls.popup}>
                                        {item.reason}
                                    </div>
                                    :
                                    null
                                }
                            </div>
                        </td>
                    )
                }
                if (item.status === "") {
                    return (
                        <td className="date true"></td>
                    )
                }
            })
        }

    }

    const renderTable = () => {
        return attendanceList?.students?.students?.map((item, i) => (
            <tr>
                <td>{i + 1}</td>
                <td>{item?.name} {item?.surname}</td>
                {/*<td/>*/}

                {checkTrueFalse(item.days)}

            </tr>
        ))
    }


    const render = renderTable()
    return (
        <div className={cls.attendance}>
            <div className={cls.attendance_header}>
                <h2>Davomat </h2>
                <div className={cls.attendance_end}>
                    <div className={cls.attendance_end_select}>
                        <Select extraClass={cls.select}
                                options={attendanceList?.students?.years?.map(item => item?.year)}
                                onChangeOption={setYear}
                                defaultValue={attendanceList?.students?.years[0]?.year}
                        />
                        {
                            year ?
                                <Select
                                    extraClass={cls.select}
                                    options={attendanceList?.students?.years?.filter(item => item?.year === +year)[0]?.month}
                                    onChangeOption={setMonths}
                                    defaultValue={attendanceList?.students?.years[0]?.month}
                                />
                                : null
                        }
                    </div>
                    <div onClick={() => setActiveModal(!activeModal)} className={`${cls.attendance_plus} fa fa-plus`}/>
                </div>
            </div>

            <div>
                <Table>
                    <thead>
                    <tr>
                        <th/>
                        <th>Ism Familya</th>
                        {attendanceList?.students?.days.map(item => <th>{item}</th>)}
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? <DefaultPageLoader/> : render}
                    </tbody>
                </Table>
            </div>

            <Attendance active={activeModal} setActive={setActiveModal}/>
        </div>
    );
};


export const Attendance = ({active, setActive}) => {

    const {id} = useParams()
    const dispatch = useDispatch()


    const {request} = useHttp()
    const [attendendModal, setAttendendModal] = useState(false)
    const [reason, setReason] = useState("")
    const [activeModal, setActiveModal] = useState(false)
    const [studentId, setStudentId] = useState()

    const {register, handleSubmit, setValue} = useForm()

    const [students, setStudents] = useState([])

    useEffect(() => {
        dispatch(getAttendanceThunk(id))
    }, [])

    const groupId = id


    const studentAttendance = useSelector(getAttendance)


    const [day, setDay] = useState(null)

    const onChangeDate = (data) => {
        setDay(data)

        const res = {
            date: `${studentAttendance.month_number}-${data}`,
        }

        // console.log(res , groupId)
        request(`${API_URL}Attendance/school-to-attend-days/${groupId}/`, "POST", JSON.stringify(res), headers())
            .then(res => {

                setStudents(res.students)
            })
            .catch(err => {
                console.log(err)
            })
    }


    const onClickYes = (id) => {
        setStudents(students => {
            return students.map(item => {

                if (item.id === id) {

                    return {...item, attended: true, typeChecked: "yes", reason: "", scores: {},}
                }
                return item
            })

        })
    }

    const renderTable = () => {
        if (students?.length > 0) {
            return students?.map((item, i) => {
                if (!item.attended) {
                    return (
                        <tr>
                            <td>{i + 1}</td>
                            <td>{item?.name} {item?.surname}</td>
                            <td>
                                <div className={cls.attendance_icon}>
                                    <i onClick={() => onClickYes(item?.id)}
                                       className={`${cls.attendance_check} fa fa-check`}></i>

                                    <div
                                        onClick={() => {
                                            setActiveModal(true)
                                            setStudentId(item.id)
                                        }}
                                        className="check__btn no"
                                    >
                                        <i className={`${cls.attendance_times} fa fa-times`}/>
                                    </div>

                                </div>
                            </td>
                        </tr>
                    )
                }
            })
        } else {
            return (
                <>
                    <td/>
                    <td> {day ?"Bu kunda hamma studentlar davomat qilingan" : "Studentlar yo'q (kun tanlang)" }</td>

                </>
            )
        }
    }

    const returnStudent = (id) => {
        setStudents(students => {
            return students.map(item => {
                if (item.id === id) {

                    return {...item, attended: false}
                }
                return item
            })
        })
    }
    const renderCheckedStudents = useCallback(() => {

        if (students?.length >= 0) {


            return students.map(item => {

                if (item.attended) {

                    return (
                        <div className={cls.checkedStudents__item} onClick={() => returnStudent(item.id)}>
                            <div className={cls.infoStudent}>
                                <div className={cls.info}>
                                    <span>{item.name}</span>
                                    <span>{item.surname}</span>
                                </div>

                                <div className={cls.typeChecked}>
                                    {

                                        item.typeChecked === "yes"
                                            ?
                                            <i className={`fas fa-plus-circle ${cls.green} `}/>
                                            :
                                            <i className={`fas fa-minus-circle ${cls.red}`}/>
                                    }
                                </div>

                            </div>
                            {
                                item.reason ?
                                    <div className={cls.reason}>{item.reason}</div> : null
                            }
                        </div>
                    )
                }
            })
        } else {
            return <h1>Studentlar yoq</h1>
        }
    }, [students])

    const updateStatusStudent = ({id, requestType, requestMsg,}) => {
        setStudents(students => {
            return students.map(item => {
                if (id === item.id) {
                    return {...item, requestType: requestType, requestMsg: requestMsg}
                }
                return item

            })
        })
    }

    const onSubmitAbsent = (data) => {

        setValue("reason" , "")
        setStudents(students => {
            return students.map(item => {
                if (item.id === studentId) {
                    return {...item, attended: true, typeChecked: "no", reason: data.reason, date: {day}, scores: {}}
                }
                return item
            })
        })
        setActiveModal(false)
    }
    const onCheckedStudents = (e) => {
        e.preventDefault()

        students.map(student => {
            if (student.attended) {
                const data = {

                    date: `${studentAttendance.month_number}-${day}`,
                    students: [{...student, status: !student.reason}],
                    group: Number(groupId),
                    teacher: studentAttendance.teachers
                    // teacherId
                }

                const studentId = data?.students?.map(item => item.id)

                updateStatusStudent({id: student.id, requestType: "loading",})
                request(`${API_URL}Attendance/to_attend_school/${studentId}/`, "POST", JSON.stringify(data), headers())
                    .then(res => {
                        setStudents(students => students.filter(item => item.id !== res.id))

                        setAttendendModal(false)
                    })
                    .catch(err => {
                        console.log(err, "err")
                    })
            }
        })
    }


    const render = renderTable()
    const renderCheckedStudent = renderCheckedStudents()

    return (
        <>
            <Modal active={active} setActive={setActive}>

                <div className={cls.attendanceModal}>

                    <h2>{studentAttendance?.month}</h2>
                    <div className={cls.attendanceModal_header}>

                        {/*<Select extraClass={cls.select} options={studentAttendance?.map(item => item?.month)}/>*/}
                        <Select extraClass={cls.select} options={studentAttendance?.weekdays}
                                onChangeOption={onChangeDate} defaultValue={day}/>
                        <Button onClick={() => setAttendendModal(true)}>
                            Davomat qilinganlar
                        </Button>
                    </div>

                </div>
                <div>
                    <Table>
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Ism Familiya</th>
                            <th/>
                        </tr>
                        </thead>
                        <tbody>
                        {render}
                        </tbody>
                    </Table>
                </div>
            </Modal>
            <Modal active={attendendModal} setActive={setAttendendModal}>
                <h2 className={cls.attended_title}>Davomat qilinganlar</h2>

                <div className={cls.attendedModal}>
                    <div className="checkedStudents">
                        {students?.filter(item => item?.attended)?.length === 0 ?
                            <h1>Studentlar davomat qilinmagan</h1> : null}
                    </div>
                    {renderCheckedStudent}
                    {students?.filter(item => item?.attended)?.length === 0 ? null :
                        <Button extraClass={cls.button} type={day ? "" : "disabled"}
                                onClick={onCheckedStudents}>Kritish</Button>}
                </div>
            </Modal>


            <Modal id={"1"} active={activeModal} setActive={setActiveModal}>
                <div className={cls.text}>Izoh qoldirish <br/> <div>( student kemaganligi haqida )</div> </div>
                <div className={cls.absent}>
                    <Form onSubmit={handleSubmit(onSubmitAbsent)}>
                        <Textarea
                            register={register}
                            name={"reason"}
                            id="comment"
                        />
                        {/*<Button onClick={onSubmitAbsent}>Click</Button>*/}
                    </Form>
                </div>
            </Modal>
        </>
    )
}


