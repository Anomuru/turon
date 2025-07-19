import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import React, {memo, useState} from 'react';
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";

import {getUserBranchId} from "entities/profile/userProfile";
import {
    getCurseLevelData,
    getCurseTypesData
} from "entities/students";
import {useTheme} from "shared/lib/hooks/useTheme";
import {Modal} from "shared/ui/modal";
import {Form} from "shared/ui/form";
import {Input} from "shared/ui/input";
import {Select} from "shared/ui/select";
import {API_URL, headers, useHttp} from "shared/api/base";
import {getLanguagesData} from "entities/oftenUsed";

import cls from "./groupCreateForm.module.sass";

export const GroupCreateForm = memo((props) => {

    const {
        setActive,
        active,
        selectedStudents,
        selectedTeachers,
        selectedSubjectId,
        selectedTime
    } = props

    const {
        register,
        handleSubmit
    } = useForm()
    const {request} = useHttp()

    const branch = localStorage.getItem("selectedBranch")
    const {theme} = useTheme()
    const dispatch = useDispatch()
    const curseTypesData = useSelector(getCurseTypesData)
    const curseLevelData = useSelector(getCurseLevelData)
    // const userBranchId = useSelector(getUserBranchId)
    const languages = useSelector(getLanguagesData)

    const [createStatus, setCreateStatus] = useState(false)

    const onSubmit = (data) => {

        const res = {
            ...data,
            students: selectedStudents,
            teacher: selectedTeachers,
            subject: selectedSubjectId,
            branch: branch,
            time_table: selectedTime,
            create_type: theme === "app_center_theme" ? "center" : "school",
            system: 1
        }
        request(`${API_URL}Group/groups/create/`, "POST", JSON.stringify(res), headers())
            .then(res => {
                // console.log(res, "group create")
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: "Guruh yaratildi"
                }))
                // setCreateStatus(true)
                setActive(false)
            })
            .catch(err => console.log(err))
    }

    return (
        <Modal
            setActive={setActive}
            active={active}
        >
            <div className={cls.createGroup}>
                <div className={cls.createGroupTitle}>
                    <h2>Gruppa ochish</h2>
                </div>
                <div className={cls.createGroupForm}>
                    <Form>
                        <Input
                            extraClassName={cls.createGroupFormItem}
                            placeholder={"Gruppa nomi"}
                            register={register}
                            name={"name"}
                        />
                        <Select
                            extraClassName={cls.createGroupFormItem}
                            title={"Kurs turi"}
                            options={curseTypesData}
                            register={register}
                            name={"course_types"}
                            // onChangeOption={setSelectedCurseType}
                        />
                        {
                            curseLevelData?.length ? <Select
                                extraClassName={cls.createGroupFormItem}
                                title={"Kurs darajasi"}
                                options={curseLevelData}
                                register={register}
                                name={"level"}
                                // onChangeOption={setSelectedCurseLevel}
                            /> : null
                        }

                        <Select
                            extraClassName={cls.createGroupFormItem}
                            title={"Kurs tili"}
                            options={languages}
                            register={register}
                            name={"language"}
                            // onChangeOption={setSelectedCurseLanguage}
                        />
                        <Input
                            extraClassName={cls.createGroupFormItem}
                            placeholder={"Gruppa narxi"}
                            register={register}
                            name={"price"}
                            type={"number"}
                        />
                        <Input
                            extraClassName={cls.createGroupFormItem}
                            placeholder={"O'qituvchi ulushi"}
                            register={register}
                            name={"teacher_salary"}
                            type={"number"}
                        />
                    </Form>
                </div>
            </div>
        </Modal>
    )
})
