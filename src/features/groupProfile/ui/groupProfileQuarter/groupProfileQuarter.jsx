import {useEffect, useState} from "react";
import styles from "./groupProfileQuarter.module.sass"
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {addTest, deleteTest, groupQuarterReducer} from "features/groupProfile/model/groupQuarterSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {getTerm, getTermData} from "features/groupProfile/model/groupQuarterSelector.js";
import {fetchTerm, fetchTermData} from "features/groupProfile/model/groupQuarterThunk.js";
import {Select} from "shared/ui/select/index.js";
import {Modal} from "shared/ui/modal/index.js";
import {Input} from "shared/ui/input/index.js";
import {useForm} from "react-hook-form";
import {Button} from "shared/ui/button/index.js";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import {ConfirmModal} from "shared/ui/confirmModal/index.js";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice.js";
import {Table} from "shared/ui/table/index.js";
import {DefaultLoader, DefaultPageLoader} from "shared/ui/defaultLoader/index.js";


const reducers = {
    groupQuarterSlice: groupQuarterReducer
}

export const GroupProfileQuarter = () => {
    //data accardion
    const data = useSelector(getTermData)
    //term select
    const term = useSelector(getTerm)
    const [selectedTerm, setSelectedTerm] = useState(null)
    //modal create test
    const [active, setActive] = useState(false)
    //fanni gruh || sinf lani id sini saqlash uchun
    const [activeItems, setActiveItems] = useState({})

    //delete items
    const [deleteActive, setDeleteActive] = useState(false)
    const [deletedItems, setDeletedItems] = useState({})
    //delete items


    const branchId = localStorage.getItem("branchId")

    //bu create uchun
    const {reset, register, handleSubmit} = useForm()
    const [assignments, setAssignments] = useState([]);




    //student geti
    const [viewActive, setViewActive] = useState(false)
    const [viewTest, setViewTest] = useState(null)

    const [loading , setLoading] = useState(false)

    const {request} = useHttp()
    useEffect(() => {
        if (term) {
            setSelectedTerm(term[0]?.id)
        }
    }, [term])

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTerm())
    }, [])

    useEffect(() => {

        if (selectedTerm && branchId) {
            dispatch(fetchTermData({termId: selectedTerm, branchId}))
        }

    }, [selectedTerm])

    useEffect(() => {
        if (viewTest) {
            setAssignments(
                viewTest?.data?.map((item) => ({
                    student_id: item.id,
                    percentage: Number(item.assignment) ?? 0,
                    test_id: viewTest.id
                    // score: item.assignment ?? 0,
                }))
            );
        }
    }, [viewTest]);

    useEffect(() => {
        if (viewActive === false) {
            setViewTest(null)

        }
    } , [viewActive])
    // fanni id && gruh ili sinf ni id sini olish uchun
    const onClick = (item, path) => {

        setActive(true);


        setActiveItems(
            path
        );
    };


    // fanni ichida testni create qilish uchun

    const onPostTerm = (data) => {

        const res = {
            ...data,
            term: selectedTerm,
            [activeItems[0]?.type]: activeItems[0]?.id,
            [activeItems[1]?.type]: activeItems[1]?.id,
            [activeItems[2]?.type]: activeItems[2]?.id,
        };


        request(`${API_URL}terms/create-test/`, "POST", JSON.stringify(res), headers())
            .then(res => {
                dispatch(addTest({
                    path: activeItems, // activeItems dagi id la
                    test: res     // shahzod dan kegan res
                }));
                dispatch(onAddAlertOptions({
                    status: true,
                    type: "success",
                    msg: "Test muvaffaqiyatli qo'shildi"
                }))
                setActive(false)
                reset()
            })
            .catch(err => console.log(err))

    }

    //delete test//
    const onDeleteId = (path, row) => {
        const groupId = path.find(p => p.type === "group")?.id;
        const subjectId = path.find(p => p.type === "subject")?.id;

        const data = {
            path,
            groupId,
            subjectId,
            testId: row.id
        };

        setDeleteActive(true);
        setDeletedItems(data);
    };

    const onDeleteTest = () => {

        request(`${API_URL}terms/delete-test/${deletedItems.testId}/`, "DELETE", null, headers())
            .then(() => {
                dispatch(deleteTest({
                    path: deletedItems.path,
                    testId: deletedItems.testId
                }));
                setDeleteActive(false);
                setDeletedItems(null);
                dispatch(onAddAlertOptions({
                    status: true,
                    type: "success",
                    msg: "Test muvaffaqiyatli o'chirildi"
                }))
            })
            .catch(err => console.log(err));
    };


    //getModal
    const onViewTest = (path, row) => {
        const groupId = path.find(p => p.type === "group")?.id;
        setLoading(true)
        request(`${API_URL}terms/student-assignment/${groupId}/${row.id}/`, "GET", null, headers())
            .then(res => {
                setViewTest({
                    id: row.id,
                    data: res
                });
                setLoading(false)
                setViewActive(true);
            })
            .catch(err => console.log(err));
    };

    console.log(viewTest)

    const onSubmitAssignments = () => {





        console.log(assignments)
        //
        request(`${API_URL}terms/assignment-create/`, "POST", JSON.stringify(assignments), headers())
            .then(() => {
                dispatch(onAddAlertOptions({
                    status: true,
                    type: "success",
                    msg: "Natijalar saqlandi"
                }))
                setViewActive(false)
            })
            .catch(err => console.log(err));
    };

    return (
        <DynamicModuleLoader reducers={reducers}>

            {loading ? <DefaultLoader/> : null}
            <div className={styles.quarter}>
                <div style={{alignSelf: "flex-end"}}>
                    <Select defaultValue={selectedTerm} options={term} onChangeOption={setSelectedTerm}/>
                </div>
                <Accordion onClick={onClick} items={data} onDeleteId={onDeleteId} onViewTest={onViewTest}/>
            </div>
            <Modal setActive={setActive} active={active}>
                <div style={{padding: "2rem"}}>
                    <Input name={"name"} placeholder={"Nomi"} register={register}/>

                    <Input name={"weight"} type={"number"} register={register} placeholder={"Foiz % "}/>
                    <Input name={"date"} type={"date"} register={register}/>
                    <Button onClick={handleSubmit(onPostTerm)}>Create</Button>
                </div>


            </Modal>

            <ConfirmModal setActive={setDeleteActive} active={deleteActive} onClick={onDeleteTest}/>

            <Modal typeIcon={true} setActive={setViewActive} active={viewActive}>
                {viewTest ? (

                    <div>
                        <div className={styles.tableStudent}>
                            <Table>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Ism Familya</th>
                                    <th>Foiz %</th>
                                </tr>
                                </thead>
                                <tbody>

                                {viewTest?.data?.map((item, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{item.name} {item.surname}</td>
                                        <td>
                                            <Input
                                                extraClassName={styles.input}
                                                type="number"
                                                defaultValue={item?.assignment !== null ? item?.assignment?.percentage : 0}
                                                onChange={(e) => {
                                                    const newValue = e.target.value;
                                                    setAssignments((prev) =>
                                                        prev.map((a, idx) =>
                                                            idx === i ? { ...a, percentage: Number(newValue) } : a
                                                        )
                                                    );
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </div>
                        <Button onClick={onSubmitAssignments}>Boholash</Button>
                    </div>

                ) : (
                    <p>Yuklanmoqda...</p>
                )}
            </Modal>

        </DynamicModuleLoader>
    );
}

function Accordion({items, onClick, parentId = null, path = [], onDeleteId, onViewTest}) {
    return (
        <div className={styles.accordion}>
            {items?.map((item, i) => (
                <AccordionItem
                    key={i}
                    item={item}
                    parentId={parentId}
                    path={[...path, {id: item?.id, title: item?.title, type: item.type}]}
                    onClick={onClick}
                    onDeleteId={onDeleteId}
                    onViewTest={onViewTest} // ✅ props forward
                />
            ))}
        </div>
    );
}

function AccordionItem({item, path, onClick, onDeleteId, onViewTest}) {
    const [open, setOpen] = useState(false);
    const hasChildren = !!item?.children;
    const hasTable = !!item?.tableData;

    return (
        <div className={styles.item}>
            <div className={styles.header}>
                <h3>{item.type === "group" ? "Sinf" : "Fan"} - {item?.title}</h3>
                <div style={{display: "flex", gap: "1rem"}}>
                    {hasTable && (
                        <i
                            onClick={() => onClick(item, path)}
                            style={{fontSize: "1.6rem", cursor: "pointer"}}
                            className="fa fa-plus"
                        />
                    )}
                    <i
                        onClick={() => setOpen(!open)}
                        style={{fontSize: "1.6rem", cursor: "pointer"}}
                        className={open ? "fa fa-chevron-down" : "fa fa-chevron-right"}
                    />
                </div>
            </div>

            {open && (
                <div className={styles.body}>
                    {hasTable && (
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nomi</th>
                                <th>Foiz %</th>
                                <th>Delete</th>
                            </tr>
                            </thead>
                            <tbody>
                            {item?.tableData?.map((row, idx) => (
                                <tr
                                    key={idx}
                                    onClick={() => onViewTest(path, row)}
                                    style={{cursor: "pointer"}}
                                >
                                    <td>{row?.id}</td>
                                    <td>{row?.name}</td>
                                    <td>{row?.weight}</td>
                                    <td style={{textAlign: "center", width: "2rem"}}>
                                        <i
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteId(path, row)
                                            }}
                                            style={{color: "red"}} className={"fa fa-trash"}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}

                    {hasChildren && (
                        <Accordion
                            items={item?.children}
                            parentId={item?.id}
                            path={path}
                            onClick={onClick}
                            onDeleteId={onDeleteId}
                            onViewTest={onViewTest} // ✅ recursive forward
                        />
                    )}
                </div>
            )}
        </div>
    );
}