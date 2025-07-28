import {AnimatedMulti} from "features/workerSelect";
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {editTeacherThunk} from "../../../../entities/teachers";
import {Modal} from "shared/ui/modal";
import {Input} from "shared/ui/input";
import {getTeacherId} from "../../../../entities/teachers";
import cls from './teacherEdit.module.sass'
import {Button} from "../../../../shared/ui/button";
import {onAddAlertOptions} from "../../../alert/model/slice/alertSlice";
import {Select} from "../../../../shared/ui/select";

import {fetchCategories, fetchSubjectsData, getClassTypeData, getSubjectsData , getCategories} from "entities/oftenUsed";
import {HexColorPicker} from "react-colorful";
import {API_URL, headers, useHttp} from "shared/api/base";


export const TeacherEdit = ({isOpen, onClose, onUpdate, teacherId}) => {
    const dispatch = useDispatch();
    const teacherID = useSelector(getTeacherId);
    const categories = useSelector(getCategories)
    const classTypes = useSelector(getClassTypeData)
    const subjects = useSelector(getSubjectsData)

    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [teacherSalaryType, setTeacherSalaryType] = useState('');
    const [phone, setNumber] = useState('')
    const [age, setAge] = useState('')
    const [money, setMoney] = useState(null)
    const [classType, setClassType] = useState('')
    const [selectedSubjects, setSelectedSubjects] = useState([])
    const [colorChange, setColorChange] = useState("black")
    const [classTime, setClassTime] = useState()
    const [classSalary, setClassSalary] = useState()
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);

    const subjectOptions = subjects?.map(subject => ({
        value: subject?.id,
        label: subject?.name,
    }));

    const {request} = useHttp()

    useEffect(() => {
        if (username && username !== teacherID?.user?.username) {
            const checkUsername = async () => {
                try {
                    const response = await request(`${API_URL}Users/username-check/`, "POST", JSON.stringify({username}), headers());

                    const data = await response
                    if (data.exists === true) {
                        setUsernameMessage(<p className={cls.errorMess}>
                            <i className="fa-solid fa-circle-exclamation" style={{color: "#f15c5c"}}></i>
                            Username band
                        </p>);
                        setIsUsernameAvailable(false);
                    } else if (data.exists === false) {
                        setUsernameMessage(<p className={cls.successMess}>
                            <i className="fa-solid fa-circle-check"></i>
                            Username bo'sh
                        </p>);
                        setIsUsernameAvailable(true);
                    }
                } catch (error) {
                    console.error('Error checking username:', error);
                    setUsernameMessage('Error checking username');
                    setIsUsernameAvailable(false);
                }
            };

            checkUsername();
        } else {
            setUsernameMessage(<p>Username kiriting</p>);
            setIsUsernameAvailable(false);
        }
    }, [username,teacherID]);


    useEffect(() => {
        dispatch(fetchSubjectsData())
    }, [])

    useEffect(() => {
        if (teacherID) {
            setMoney(teacherID?.salary_percentage)
            setClassTime(teacherID?.working_hours)
            setName(teacherID.user?.name)
            setSurname(teacherID.user?.surname)
            setNumber(teacherID.user?.phone)
            setAge(teacherID.user?.birth_date)
            setTeacherSalaryType(teacherID?.teacher_salary_type)
            setClassType(teacherID?.class_type)
            setClassSalary(teacherID?.class_salary)
            setUsername(teacherID?.user?.username)
            setFatherName(teacherID?.user?.father_name)
            setSelectedSubjects(
                teacherID?.subject?.map(subject => ({
                    value: subject?.id,
                    label: subject?.name,
                }))
            )

        }
    }, [teacherID])

    const handleEditTeacher = () => {
        if (!teacherID) return;
        const updateTeacher = {
            user: {
                name,
                surname,
                phone,
                age,
                username,
                father_name: fatherName
            },
            teacher_salary_type: teacherSalaryType,
            class_type: classType,
            subject: selectedSubjects.map(item => item?.value),
            color: colorChange,
            working_hours: +classTime,
            salary_percentage: +money,
            class_salary: classSalary
        };

        dispatch(editTeacherThunk({id: (teacherID.id), updateTeacher}))
            .then(() => {
                onUpdate(updateTeacher)
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: "Ma'lumot muvofaqqiyatli o'zgartirildi"
                }))
                onClose()
            })
    }

    if (!isOpen) return null


    return (
        <Modal
            active={isOpen}
            setActive={onClose}
        >
            <div className={cls.filter}>
                <h1>Ma'lumotlarni o'zgartirish</h1>
                <div className={cls.filter__container}>
                    <div className={cls.filter__age}>
                        <Input
                            type={"text"}
                            title={usernameMessage && <p className={cls.mess}>{usernameMessage}</p>}
                            extraClassName={cls.filter__input}
                            placeholder={"Username"}
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            // value={selectedFrom}
                        />
                        <Input
                            type={"text"}
                            title={"Ism"}
                            extraClassName={cls.filter__input}
                            placeholder={"Ism"}
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            // value={selectedFrom}
                        />
                        <Input
                            type={"text"}
                            title={"Familiya"}
                            extraClassName={cls.filter__input}
                            placeholder={"Familiya"}
                            onChange={(e) => setSurname(e.target.value)}
                            value={surname}
                            // value={selectedFrom}
                        />
                        <Input
                            type={"text"}
                            title={"Otasing ismi"}
                            extraClassName={cls.filter__input}
                            placeholder={"Otasing ismi"}
                            onChange={(e) => setFatherName(e.target.value)}
                            value={fatherName}
                            // value={selectedFrom}
                        />
                        <Input
                            type={"number"}
                            title={"Tel raqami"}
                            extraClassName={cls.filter__input}
                            placeholder={"Tel raqami"}
                            onChange={(e) => setNumber(e.target.value)}
                            value={phone}
                            // value={selectedTo}
                        />

                        <Input
                            type={"date"}
                            extraClassName={cls.inputAge}
                            placeholder={"Tug'ilgan yili"}
                            title={"Tug'ilgan yili"}
                            onChange={(e) => setAge(e.target.value)}
                            value={age}
                            // value={selectedFrom}
                        />
                        <Input
                            type={"number"}
                            extraClassName={cls.inputAge}
                            placeholder={"Ustama foiz"}
                            title={"Ustama foiz"}
                            onChange={(e) => setMoney(e.target.value)}
                            value={money}
                        />
                        <AnimatedMulti
                            options={subjectOptions}
                            onChange={setSelectedSubjects}
                            extraClass={cls.multiSelect}
                            value={selectedSubjects}
                            fontSize={15}
                        />
                        <Select
                            extraClass={cls.extraClasses}
                            name={"category"}
                            options={categories}
                            defaultValue={teacherSalaryType?.id ?? teacherSalaryType}
                            onChangeOption={setTeacherSalaryType}
                            title={"Toifa"}
                        />
                        <Select
                            extraClass={cls.extraClasses}
                            name={"class_type"}
                            options={classTypes}
                            onChangeOption={setClassType}
                            title={"Sinf"}
                            defaultValue={classType}

                        />
                        <Input
                            type={"number"}
                            title={"Darslik soat"}
                            extraClassName={cls.filter__input}
                            placeholder={"Darslik soat"}
                            onChange={(e) => setClassTime(e.target.value)}
                            value={classTime}
                            // value={selectedTo}
                        />
                        <Input
                            type={"number"}
                            title={"Sinfdan oylik"}
                            extraClassName={cls.filter__input}
                            placeholder={"Darslik soat"}
                            onChange={(e) => setClassSalary(e.target.value)}
                            value={classSalary}
                            // value={selectedTo}
                        />

                        <div>
                            <div style={{display: "flex" , gap: "1rem" , alignItems: "center" , marginBottom: "10px"}}><h3>Rang qushish :</h3> <div style={{backgroundColor: colorChange ? colorChange : "black" , width: "30px" , height: "30px" , borderRadius: "5px" , boxShadow: colorChange === "#ffffff" ? "0 0 5px 0" : null}}></div></div>
                            <HexColorPicker style={{width: "30rem", height: "15rem"}} color={colorChange}
                                            onChange={setColorChange}/>
                        </div>
                    </div>


                    <div style={{display: "flex", gap: "5px"}}>
                        {/*<a href={API_URL_DOC+} download><Button> Resume Saqlab olish</Button></a>*/}

                        <Button>Resume O'zgartirish</Button>
                    </div>

                    <div className={cls.filter__switch}>
                        <div></div>
                        <Button extraClass={cls.submitBtn} type={"submit"} children={"Button"}
                                onClick={handleEditTeacher}/>
                    </div>

                </div>
            </div>
        </Modal>
    );
}