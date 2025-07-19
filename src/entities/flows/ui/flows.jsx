import {getCurseLevel} from "entities/students/model/studentsSlice";
import {FlowFilter} from "features/filters/flowFilter";
import {Table} from "shared/ui/table";
import cls from "pages/flowsPage/ui/flowsPage.module.sass";
import {Button} from "shared/ui/button";
import {useEffect, useState} from "react";
import {Modal} from "shared/ui/modal";
import {Input} from "shared/ui/input";
import {Select} from "shared/ui/select";
import {Textarea} from "shared/ui/textArea";
import {useForm} from "react-hook-form";
import {Form} from "shared/ui/form";
import {DefaultPageLoader} from "shared/ui/defaultLoader";
import {API_URL, headers, useHttp} from "shared/api/base";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";


export const Flows = ({currentTableData, teacherData, loading, levelData, getLevelData, setActive, branchId}) => {

    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        setValue
    } = useForm()
    const [activeFlow, setActiveFlow] = useState(false)
    const [addFlow, setAddFlow] = useState(false)
    const [filter, setFilter] = useState(false)

    const [selectedSubjects, setSelectedSubjects] = useState([])
    const dispatch = useDispatch()
    const {request} = useHttp()

    const [activeCheckbox, setActiveCheckBox] = useState(false)

    const createFlow = (data) => {
        const res = {
            ...data,
            activity: activeCheckbox,
            branch: branchId,
            // subject: teacherData.filter(item => item.id === +data?.teacher)[0]?.subject[0]?.id
        }

        localStorage.setItem("flowData", JSON.stringify(res))
        navigate("flow-list")
    }

    useEffect(() => {
        if (selectedSubjects) {
            setValue("subject", selectedSubjects[0]?.id)
        }
    }, [selectedSubjects])


    const renderFlowData = () => {
        return currentTableData?.map((item, i) => {
            return (
                <tr onClick={() => navigate(`./flowsProfile/${item?.id}`)}>
                    <td>{i + 1}</td>
                    <td>{item?.name}</td>
                    <td>
                        {item?.subject_name}
                        {
                            item?.level_name ? ` / ${item?.level_name}` : null
                        }
                    </td>
                    <td>{item?.student_count}</td>
                    <td>

                        {item?.teacher_name}
                        {item?.teacher_surname}

                    </td>
                </tr>
            )
        })
    }


    return (
        <div className={cls.flowMain}>
            <div className={cls.flow__filter}>
                <Button
                    onClick={() => setFilter(!filter)}
                    type={"simple-add"}
                >
                    Filter
                </Button>
                <div className={cls.flowMain__wrapper}>
                    <Button
                        onClick={() => setActiveFlow(!activeFlow)}
                        type={"simple"}
                    >
                        Create Flow
                    </Button>
                    <Button
                        type={"simple-add"}
                        onClick={() => setActive(true)}
                    >
                        Add Flow
                    </Button>
                </div>
            </div>
            <Table>
                <thead>
                <tr>
                    <th>No</th>
                    <th>Nomi</th>
                    <th>Fan Level</th>
                    <th>O'quvchi soni</th>
                    <th>O'qituvchisi</th>
                </tr>
                </thead>
                {loading === "loading" ? <DefaultPageLoader/> :
                    <tbody>
                    {renderFlowData()}
                    </tbody>
                }
            </Table>


            <Modal
                active={activeFlow}
                setActive={setActiveFlow}
                extraClass={cls.modal}
            >
                <h2>Create Flow</h2>
                <div className={cls.flowModal}>

                    <div className={cls.flowModalHeader}>
                        <h3>Activity</h3>
                        <Input onChange={() => setActiveCheckBox(!activeCheckbox)} type={"checkbox"}/>
                    </div>

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
                                        options={teacherData}
                                        onChangeOption={(e) => {
                                            if (e) {
                                                getLevelData(e)
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
            <Modal active={addFlow} setActive={setAddFlow}>
                <h2>Add Flow</h2>
                <div className={cls.flowModalForm}>
                    <Form typeSubmit={""}>
                        <Select/>
                        <Button type={"simple"}>Add</Button>
                    </Form>
                </div>

            </Modal>
            <FlowFilter
                active={filter}
                setActive={setFilter}
            />
        </div>
    );
};

