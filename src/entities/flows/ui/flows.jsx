import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import React, {useEffect, useState} from "react";

import {FlowFilter} from "features/filters/flowFilter";
import {Table} from "shared/ui/table";
import {Button} from "shared/ui/button";
import {Modal} from "shared/ui/modal";
import {Input} from "shared/ui/input";
import {Select} from "shared/ui/select";
import {Textarea} from "shared/ui/textArea";
import {Form} from "shared/ui/form";
import {DefaultPageLoader} from "shared/ui/defaultLoader";
import {API_URL, headers, useHttp} from "shared/api/base";

import cls from "pages/flowsPage/ui/flowsPage.module.sass";
import {FlowAddForm} from "features/flow/index.js";
import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {ConfirmModal} from "shared/ui/confirmModal/index.js";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice.js";
import {deleteFlow} from "entities/flows/model/slice/flowsSlice.js";

function compareById(a, b) {
    return a.id - b.id;
}

export const Flows = ({
                          currentTableData,
                          teacherData,
                          loading,
                          levelData,
                          getLevelData,
                          setActive,
                          branchId,
                          setActiveFlow,
                          activeFlow,
                          active
                      }) => {

    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        setValue
    } = useForm()
    const userBranchId = useSelector(getUserBranchId)

    // const [activeFlow, setActiveFlow] = useState(false)
    // const [addFlow, setAddFlow] = useState(false)
    // const [filter, setFilter] = useState(false)
    const [selectedSubjects, setSelectedSubjects] = useState([])
    const [isPostTeacher, setIsPostTeacher] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)

    const dispatch = useDispatch()
    const {request} = useHttp()

    const [activeCheckbox, setActiveCheckBox] = useState(false)

    const createFlow = (data) => {
        let res;
        if (data.teacher === "none") {
            res = {
                name: data?.name,
                activity: activeCheckbox,
                branch: branchId,
            }
        } else {
            res = {
                ...data,
                activity: activeCheckbox,
                branch: branchId,
                // subject: teacherData.filter(item => item.id === +data?.teacher)[0]?.subject[0]?.id
            }
        }

        localStorage.setItem("flowData", JSON.stringify(res))
        navigate("flow-list")
    }

    useEffect(() => {
        if (selectedSubjects) {
            setValue("subject", selectedSubjects[0]?.id)
        }
    }, [selectedSubjects])

    const onSubmitDelete = () => {
        request(`${API_URL}Flow/flow-delete/${isDeleted}`, "DELETE", null, headers())
            .then(res => {
                // navigate(-1)
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: res?.msg
                }))
                dispatch(deleteFlow(isDeleted))
                setIsDeleted(false)
            })
            .catch(err => {
                dispatch(onAddAlertOptions({
                    type: "error",
                    status: true,
                    msg: "Databazada hatolik yuzberdi"
                }))
            })
        // dispatch(deleteGroupProfile({id}))
    }


    const renderFlowData = () => {
        return currentTableData && [...currentTableData]?.sort(compareById)?.map((item, i) => {
            return (
                <tr>
                    <td>{i + 1}</td>
                    <td onClick={() => navigate(`./flowsProfile/${item?.id}`)}>{item?.name}</td>
                    {
                        !item?.activity ? <td>
                            {item?.subject_name}
                            {
                                item?.level_name ? ` / ${item?.level_name}` : null
                            }
                        </td> : <td/>
                    }
                    <td>{item?.student_count}</td>
                    {!item?.activity ? <td>{`${item?.teacher_name} ${item?.teacher_surname}`}</td> : <td/>}
                    <td onClick={() => setIsDeleted(item?.id)}><i className="fas fa-times"/></td>
                </tr>
            )
        })
    }


    return (
        <div className={cls.flowMain}>
            {/*<div className={cls.flow__filter}>*/}
            {/*    <Button*/}
            {/*        onClick={() => setFilter(!filter)}*/}
            {/*        type={"simple-add"}*/}
            {/*    >*/}
            {/*        Filter*/}
            {/*    </Button>*/}
            {/*    <div className={cls.flowMain__wrapper}>*/}
            {/*        <Button*/}
            {/*            onClick={() => setActiveFlow(!activeFlow)}*/}
            {/*            type={"simple"}*/}
            {/*        >*/}
            {/*            Create Flow*/}
            {/*        </Button>*/}
            {/*        <Button*/}
            {/*            type={"simple-add"}*/}
            {/*            onClick={() => setActive(true)}*/}
            {/*        >*/}
            {/*            Add Flow*/}
            {/*        </Button>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className={cls.flowMain__table}>
                <Table>
                    <thead style={{top: "0"}}>
                    <tr>
                        <th>No</th>
                        <th>Nomi</th>
                        <th>Fan Level</th>
                        <th>O'quvchi soni</th>
                        <th>O'qituvchisi</th>
                        <th/>
                    </tr>
                    </thead>
                    {
                        loading === true ? <DefaultPageLoader/> :
                            <tbody>
                            {renderFlowData()}
                            </tbody>
                    }
                </Table>
            </div>


            <Modal
                active={activeFlow}
                setActive={setActiveFlow}
                extraClass={cls.modal}
            >
                <h2>Create Flow</h2>
                <div className={cls.flowModal}>

                    {
                        !isPostTeacher ?
                            <div className={cls.flowModalHeader}>
                                <h3>Activity</h3>
                                <Input onChange={() => setActiveCheckBox(!activeCheckbox)} type={"checkbox"}/>
                            </div> : null
                    }

                    <div className={cls.flowModalForm}>
                        <Form typeSubmit={""} onSubmit={handleSubmit(createFlow)} action="">
                            <Input
                                placeholder={"Nomi"}
                                register={register}
                                name={"name"}
                                required
                            />
                            {activeCheckbox ?
                                null
                                :
                                <>
                                    <Select
                                        title={"O'qituvchini tanlang"}
                                        options={[{id: "none", name: "O'qituvchi yo'q"}, ...teacherData]}
                                        onChangeOption={(e) => {
                                            if (e) {
                                                getLevelData(e)
                                                if (e === "none") {
                                                    setIsPostTeacher(false)
                                                } else {
                                                    setIsPostTeacher(true)
                                                }
                                            }
                                            setSelectedSubjects(teacherData.filter(item => item.id === +e)[0]?.subject)
                                        }}
                                        register={register}
                                        name={"teacher"}
                                    />
                                    {
                                        selectedSubjects?.length ? <Select
                                            title={"Fan"}
                                            options={selectedSubjects}
                                            register={register}
                                            name={"subject"}
                                            defaultValue={selectedSubjects[0]?.id}
                                        /> : null
                                    }
                                    {
                                        levelData?.length ? <Select
                                            title={"Level"}
                                            options={levelData}
                                            register={register}
                                            name={"level"}
                                        /> : null
                                    }
                                    <Textarea
                                        placeholder={"Koment"}

                                        register={register}
                                        name={"comment"}
                                    />
                                </>
                            }
                            <Button>Next</Button>
                        </Form>

                    </div>
                </div>
            </Modal>

            <FlowAddForm
                userBranchId={userBranchId}
                active={active}
                setActive={setActive}
            />

            <ConfirmModal
                type={"danger"}
                active={isDeleted}
                setActive={setIsDeleted}
                onClick={onSubmitDelete}
            />
        </div>
    );
};

