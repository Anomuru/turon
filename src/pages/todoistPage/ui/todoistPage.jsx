import { useState, useCallback, useMemo, useEffect } from "react"
import classNames from "classnames"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"

import { API_URL, headers, headersImg, useHttp } from "shared/api/base"
import { Button } from "shared/ui/button"
import { Modal } from "shared/ui/modal"
import { Form } from "shared/ui/form"
import { Textarea } from "shared/ui/textArea"
import { Input } from "shared/ui/input"
import { Select } from "shared/ui/select"
import { getUserBranchId } from "entities/profile/userProfile"
import { fetchTeachersData, getTeacherData, getStatusList } from "entities/oftenUsed"
import { fetchEmployersData } from "entities/employer/model/slice/employersThunk"
import { onAddAlertOptions } from "features/alert/model/slice/alertSlice"
import { getTasks, getTaskLoading } from "../model/todoistSelector"

import styles from "./todoistPage.module.sass"
import { getEmployersData } from "entities/employer/model/selector/employersSelector"
import { ConfirmModal } from "shared/ui/confirmModal"

// Mock users
const USERS = [
    { id: "1", name: "Мария Иванова" },
    { id: "2", name: "Иван Петров" },
    { id: "3", name: "Анна Сидорова" },
    { id: "4", name: "Петр Федоров" },
    { id: "5", name: "Ольга Смирнова" },
]

// Current user (mock)
const CURRENT_USER_ID = "1"

// Status configuration
const STATUS_CONFIG = {
    notStarted: { label: "Не начато", color: "gray" },
    inProgress: { label: "В процессе", color: "blue" },
    blocked: { label: "Блокировано", color: "red" },
    completed: { label: "Выполнено", color: "green" },
}

const FILTERS = [
    { id: "myTasks", label: "Мои задачи" },
    { id: "created", label: "Созданные мною" },
    { id: "review", label: "На проверку" },
    { id: "overdue", label: "Просроченные" },
    { id: "today", label: "Сегодня" },
    { id: "week", label: "На этой неделе" },
]

export const TodoistPage = () => {

    const { register, handleSubmit } = useForm()
    const dispatch = useDispatch()
    const { request } = useHttp()

    // const { data, statusList, loading } = useSelector(state => state.todoistSlice)
    // const { id } = useSelector(state => state.me)
    // const { teachers } = useSelector(state => state.teachers)
    // const { employees } = useSelector(state => state.employees)

    const getUserBranch = useSelector(getUserBranchId)
    const getTeachers = useSelector(getTeacherData)
    const getEmployees = useSelector(getEmployersData)
    const statusList = useSelector(getStatusList)
    const tasksList = useSelector(getTasks)
    const taskLoading = useSelector(getTaskLoading)

    const [tasks, setTasks] = useState([])

    const [updatedTaskId, setUpdatedTaskId] = useState(null)
    const [activeFilter, setActiveFilter] = useState("myTasks")
    const [showModal, setShowModal] = useState(false)
    const [showCommentsModal, setShowCommentsModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(true)
    const [editingTask, setEditingTask] = useState(null)
    const [selectedTaskForComments, setSelectedTaskForComments] = useState(null)
    const [commentText, setCommentText] = useState("")
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [deadline, setDeadline] = useState("")
    const [status, setStatus] = useState(null)
    const [executor, setExecutor] = useState(null)
    const [reviewer, setReviewer] = useState(null)
    const [comment, setComment] = useState("")
    const [teachersList, setTeachersList] = useState([])
    const [employeesList, setEmployeesList] = useState([])


    useEffect(() => {

        request(`${API_URL}Tasks/missions/?`, "GET", null, headers())
    }, [])

    useEffect(() => {
        if (getUserBranch) {
            // dispatch(fetchTeachersByLocationWithoutPagination({ locationId }))
            // dispatch(fetchEmployeesWithoutPagination({ locationId }))
            dispatch(fetchTeachersData(getUserBranch))
            dispatch(fetchEmployersData({ branch: getUserBranch }))
        }
        // dispatch()
    }, [getUserBranch])

    useEffect(() => {
        if (getTeachers) {
            setTeachersList(getTeachers.map(item => ({
                name: `${item.name} ${item.surname} (${item.subject[0]})`,
                id: item.user_id
            })))
        }
    }, [getTeachers])

    useEffect(() => {
        if (getEmployees) {
            setEmployeesList(getEmployees.map(item => ({
                name: `${item.name} ${item.surname} (${item.job})`,
                id: item.user_id
            })))
        }
    }, [getEmployees])


    const CreateTask = (createData) => {
        let URL;
        let METHOD;

        if (updatedTaskId) {
            URL = `Tasks/missions/${updatedTaskId}/`
            METHOD = "PATCH"
        } else {
            URL = `Tasks/missions/`
            METHOD = "POST"
        }

        dispatch(loadingTask())

        const postData = {
            ...createData,
            title,
            description,
            deadline,
            status,
            executor,
            reviewer,
            location: locationId,
            creator: id
        }

        request(`${BackUrl}${URL}`, METHOD, JSON.stringify(postData), headers())
            .then(res => {
                if (updatedTaskId) {
                    dispatch(updateTask(res))
                } else {
                    dispatch(addTask(res))
                }
                // dispatch(onAddAlertOptions({
                //     type: "success",
                //     msg: updatedTaskId ? "Task kiritildi" : "Task kiritildi",
                //     status: true
                // }))
            })
            .catch(err => {
                // dispatch(onAddAlertOptions({
                //     type: "error",
                //     msg: "Xatolik yuz berdi",
                //     status: true
                // }))
            })
    }

    const addComment = (commentData) => {
        dispatch(loadingTask())

        const patchData = { comment }

        request(`${BackUrl}Tasks/missions/${updatedTaskId}/`, "PATCH", JSON.stringify(patchData), headers())
            .then(res => {
                dispatch(updateTask(res))
            })
            .catch(err => {
                // dispatch(onAddAlertOptions({
                //     type: "error",
                //     msg: "Xatolik yuz berdi",
                //     status: true
                // }))
            })
    }

    const getConfirm = (ans) => {
        if (ans === "yes") {
            request(`${BackUrl}Tasks/missions/${updatedTaskId}/`, "DELETE", null, headers())
                .then(res => {
                    dispatch(deleteTask(updatedTaskId))
                    setConfirmModal(false)
                    setUpdatedTaskId(null)
                })
                .catch(err => {
                    // dispatch(onAddAlertOptions({
                    //     type: "error",
                    //     msg: "Xatolik yuz berdi",
                    //     status: true
                    // }))
                })
        } else {

            setConfirmModal(false)
            setUpdatedTaskId(null)
        }
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const formatTime = (timestamp) => {
        const date = new Date(timestamp)
        return date.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const render = () => {
        return tasksList.map((task) => (
            <div key={task.id} className={styles.taskCard}>
                <div className={styles.taskHeader}>
                    <div className={styles.taskTitle}>{task.title}</div>
                    <div className={`${styles.status} ${styles[`status_${task.status}`]}`}>
                        {STATUS_CONFIG[task.status].label}
                    </div>
                </div>

                <p className={styles.taskDescription}>{task.description}</p>

                <div className={styles.taskMeta}>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Дедлайн:</span>
                        <span className={styles.metaValue}>{formatDate(task.deadline)}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Исполнитель:</span>
                        <span className={styles.metaValue}>{ }</span>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Проверяющий:</span>
                        <span className={styles.metaValue}>{ }</span>
                    </div>
                </div>

                <div className={styles.taskActions}>
                    <button
                        className={styles.actionBtn}
                        onClick={() => {
                            setShowModal(true)
                            setTitle(task.title)
                            setDescription(task.description)
                            setDeadline(task.deadline)
                            setStatus(task.status)
                            setExecutor(task.executer.id)
                            setReviewer(task.reviewer.id)
                        }}
                    >
                        Edit
                    </button>
                    <button
                        className={`${styles.actionBtn} ${styles.secondary}`}
                        onClick={() => {
                            setShowCommentsModal(true)
                            setUpdatedTaskId(task.id)
                        }}
                    >
                        Comment ({task.comments.length})
                    </button>
                    <button
                        className={`${styles.actionBtn} ${styles.danger}`}
                        onClick={() => {
                            setConfirmModal(true)
                            setUpdatedTaskId(task.id)
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        ))
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>TaskManager</h1>
                <Button
                    extraClass={styles.createBtn}
                    onClick={() => setShowModal(true)}
                >
                    + Создать задачу
                </Button>
            </div>

            {/* Filters */}
            <div className={styles.filters}>
                {
                    FILTERS.map((filter) => (
                        <button
                            // type={"simple__add"}
                            key={filter.id}
                            className={`${styles.filterBtn} ${activeFilter === filter.id ? styles.active : ""}`}
                            onClick={() => setActiveFilter(filter.id)}
                        >
                            {filter.label}
                        </button>
                    ))
                }
            </div>

            {/* Tasks List */}
            <div className={styles.tasksList}>
                {
                    taskLoading
                        ? <DefaultLoader />
                        : tasksList.length === 0 ? (
                            <div className={styles.empty}>
                                <p>Нет задач в этом разделе</p>
                            </div>
                        ) : render()
                }
            </div>

            {/* Modal: Create/Edit Task */}

            <Modal
                active={showModal}
                setActive={
                    () => {
                        setShowModal(false)
                        setUpdatedTaskId(null)
                    }
                }
                extraClass={styles.modalAdd}
            >
                <h1>Create Task</h1>
                <Form
                    extraClassname={styles.modalAdd__form}
                    onSubmit={handleSubmit(CreateTask)}
                >
                    <Input
                        clazzLabel={classNames(styles.inputForm, styles.mainForm)}
                        placeholder={"Title"}
                        onChange={setTitle}
                        defaultValue={title}
                    // register={register}
                    // name={"title"}
                    />
                    <Textarea
                        clazzLabel={styles.mainForm}
                        placeholder={"Description"}
                        onChange={setDescription}
                        defaultValue={description}
                    // register={register}
                    // name={"description"}
                    />
                    <div className={styles.formContainer}>
                        <Input
                            clazzLabel={classNames(styles.inputForm, styles.formContainer__form)}
                            title={"Deadline"}
                            type={"date"}
                            onChange={setDeadline}
                            defaultValue={deadline}
                        // register={register}
                        // name={"deadline"}
                        />
                        <Select
                            clazzLabel={styles.formContainer__form}
                            title={"Status"}
                            onChangeOption={setStatus}
                            // register={register}
                            // name={"status"}
                            options={statusList}
                            defaultValue={status}
                        />
                    </div>
                    <div className={styles.formContainer}>
                        <Select
                            clazzLabel={styles.formContainer__form}
                            title={"Executor"}
                            onChangeOption={setExecutor}
                            // register={register}
                            // name={"executor"}
                            options={[...employeesList, ...teachersList]}
                            defaultValue={executor}
                        />
                        <Select
                            clazzLabel={styles.formContainer__form}
                            title={"Reviewer"}
                            onChangeOption={setReviewer}
                            // register={register}
                            // name={"reviewer"}
                            options={[...employeesList, ...teachersList]}
                            defaultValue={reviewer}
                        />
                    </div>
                </Form>
            </Modal>

            <Modal
                active={showCommentsModal}
                setActive={
                    () => {
                        setShowCommentsModal(false)
                        setUpdatedTaskId(null)
                    }
                }
                extraClass={styles.modalAdd}
            >
                <h1>Add comment</h1>
                <Form
                    extraClassname={styles.modalAdd__form}
                    onSubmit={handleSubmit(addComment)}
                >
                    <Textarea
                        clazzLabel={styles.mainForm}
                        placeholder={"Comment"}
                        onChange={setComment}
                    // register={register}
                    // name={"comment"}
                    />
                </Form>
            </Modal>

            {/* <Modal active={confirmModal} setActiveModal={() => setConfirmModal(false)}> */}
            <ConfirmModal
                setActive={setConfirmModal}
                text={"O'chirilsinmi?"}
                getConfirm={getConfirm}
            />
            {/* </Modal> */}
        </div>
    )
}

