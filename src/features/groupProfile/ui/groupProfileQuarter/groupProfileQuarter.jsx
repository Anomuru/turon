import {useEffect, useState} from "react";
import styles from "./groupProfileQuarter.module.sass"
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {
    addTest,
    deleteTest,
    groupQuarterReducer,
    updateTest
} from "features/groupProfile/model/makeQuarter/groupQuarterSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {getTerm, getTermData} from "features/groupProfile/model/makeQuarter/groupQuarterSelector.js";
import {fetchTerm, fetchTermData} from "features/groupProfile/model/makeQuarter/groupQuarterThunk.js";
import {Select} from "shared/ui/select/index.js";
import {Modal} from "shared/ui/modal/index.js";
import {Input} from "shared/ui/input/index.js";
import {useForm} from "react-hook-form";
import {Button} from "shared/ui/button/index.js";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import {ConfirmModal} from "shared/ui/confirmModal/index.js";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice.js";
import {Table} from "shared/ui/table/index.js";
import {DefaultLoader} from "shared/ui/defaultLoader/index.js";
import {getSelectedLocations} from "features/locations/index.js";

const reducers = {
    groupQuarterSlice: groupQuarterReducer
}

// optimizatsiya qilaman  (sardor)
export const GroupProfileQuarter = () => {
    const data = useSelector(getTermData)
    const term = useSelector(getTerm)
    const [selectedTerm, setSelectedTerm] = useState(null)

    const [active, setActive] = useState(false)
    const [activeItems, setActiveItems] = useState({})
    const branchId = localStorage.getItem("branchId")
    const selectedBranch = useSelector(getSelectedLocations);
    const branchForFilter = selectedBranch?.id;

    const {reset, register, handleSubmit} = useForm()
    const [assignments, setAssignments] = useState([]);
    const [viewActive, setViewActive] = useState(false)
    const [viewTest, setViewTest] = useState(null)
    const [loading, setLoading] = useState(false)

    const {request} = useHttp()
    const [quarterYear, setQuarterYear] = useState(null)
    const [quarterYearSelected, setQuarterYearSelected] = useState(null)

    useEffect(() => {
        if (quarterYear) {
            setQuarterYearSelected(quarterYear[0]?.academic_year)
        }
    }, [quarterYear])

    useEffect(() => {
        request(`${API_URL}terms/education-years/`, "GET", null, headers())
            .then(res => {
                setQuarterYear(res)
            })
    }, [])

    useEffect(() => {
        if (term) {
            setSelectedTerm(term[0]?.id)
        }
    }, [term])

    const dispatch = useDispatch()

    useEffect(() => {
        if (quarterYearSelected){
            dispatch(fetchTerm(quarterYearSelected))
        }
    }, [quarterYearSelected])

    useEffect(() => {
        if (selectedTerm && branchId) {
            dispatch(fetchTermData({termId: selectedTerm, branchId: branchForFilter}))
        }
    }, [selectedTerm, branchForFilter])

    useEffect(() => {
        if (viewTest) {
            setAssignments(
                viewTest.data.map(item => ({
                    student_id: item.id,
                    percentage: item.assignment?.percentage ?? item.assignment ?? 0,
                    test_id: viewTest.id,
                }))
            );
        }
    }, [viewTest]);

    useEffect(() => {
        if (viewActive === false) {
            setViewTest(null)
        }
    }, [viewActive])

    const onClick = (item, path) => {
        setActive(true);
        setActiveItems(path);
    };

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
                    path: activeItems,
                    test: res
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

    const onViewTest = (path, row) => {
        const groupId = path.find(p => p.type === "group")?.id;
        setLoading(true)
        request(`${API_URL}terms/student-assignment/${groupId}/${row.id}/`, "GET", null, headers())
            .then(res => {
                setViewTest({
                    id: row.id,
                    weight: row.weight,
                    data: res
                });
                setLoading(false)
                setViewActive(true);
            })
            .catch(err => console.log(err));
    };

    const onSubmitAssignments = () => {
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
                <div style={{alignSelf: "flex-end" , display: "flex" , gap: "2rem"}}>
                    <Select defaultValue={quarterYearSelected} options={quarterYear}
                            onChangeOption={setQuarterYearSelected}/>
                    <Select defaultValue={selectedTerm} options={term} onChangeOption={setSelectedTerm}/>
                </div>
                <Accordion selectedTerm={selectedTerm} onClick={onClick} items={data}  onViewTest={onViewTest}/>
            </div>

            {/* Create Modal */}
            <Modal setActive={setActive} active={active}>
                <div style={{padding: "2rem"}}>
                    <Input name={"name"} placeholder={"Nomi"} register={register}/>
                    <Input name={"weight"} type={"number"} register={register} placeholder={"Foiz % "}/>
                    <Input name={"date"} type={"date"} register={register}/>
                    <Button onClick={handleSubmit(onPostTerm)}>Create</Button>
                </div>
            </Modal>

            {/* View Test Modal */}
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
                                    <th>Natija</th>
                                </tr>
                                </thead>
                                <tbody>
                                {viewTest?.data?.map((item, i) => {
                                    const assignmentItem = assignments.find(a => a.student_id === item.id);

                                    const percentage =
                                        assignmentItem?.percentage ??
                                        item.assignment?.percentage ??
                                        item.assignment ??
                                        0;

                                    const result = (percentage * viewTest.weight) / 100;

                                    return (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{item.name} {item.surname}</td>
                                            <td>
                                                <Input
                                                    extraClassName={styles.input}
                                                    type="number"
                                                    value={percentage === 0 ? "" : Number(percentage)} // <-- nol oldini oladi
                                                    onChange={(e) => {
                                                        const newValue = e.target.value === "" ? 0 : Number(e.target.value);

                                                        setAssignments((prev) => {
                                                            const existingIndex = prev.findIndex((a) => a.student_id === item.id);

                                                            if (existingIndex >= 0) {
                                                                const updated = [...prev];
                                                                updated[existingIndex] = {
                                                                    ...updated[existingIndex],
                                                                    percentage: newValue,
                                                                };
                                                                return updated;
                                                            }

                                                            return [
                                                                ...prev,
                                                                {
                                                                    student_id: item.id,
                                                                    test_id: viewTest.id,
                                                                    percentage: newValue,
                                                                },
                                                            ];
                                                        });
                                                    }}
                                                />
                                            </td>
                                            <td>{isNaN(result) ? 0 : result.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </Table>
                        </div>
                        <Button onClick={onSubmitAssignments}>Boholash</Button>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </Modal>
        </DynamicModuleLoader>
    );
}


function Accordion({items, onClick, parentId = null, path = [], onDeleteId, onViewTest ,selectedTerm}) {
    return (
        <div className={styles.accordion}>
            {items?.map((item, i) => (
                <AccordionItem
                    selectedTerm={selectedTerm}
                    key={i}
                    item={item}
                    parentId={parentId}
                    path={[...path, {id: item?.id, title: item?.title, type: item.type}]}
                    onClick={onClick}
                    onViewTest={onViewTest}
                />
            ))}
        </div>
    );
}

function AccordionItem({item, path, onClick, onViewTest , selectedTerm}) {
    const [open, setOpen] = useState(false);
    const hasChildren = !!item?.children;
    const hasTable = !!item?.tableData;
    const {request} = useHttp()

    const [editActive, setEditActive] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [deleteActive, setDeleteActive] = useState(false);

    const dispatch = useDispatch();
    const {register, handleSubmit, reset} = useForm();

    const onEditId = (row) => {
        setEditItem({path, ...row});
        reset({
            name: row.name,
            weight: row.weight,
            date: row.date,
        });
        setEditActive(true);
    };

    const onUpdateTest = (data) => {
        const res = {
            group: path.find(p => p.type === "group")?.id,
            subject: path.find(p => p.type === "subject")?.id,
            name: data.name,
            weight: data.weight,
            date: data.date,
        };

        request(`${API_URL}terms/update-test/${editItem.id}/`, "PATCH", JSON.stringify({...res ,  term: selectedTerm,}), headers())
            .then((res) => {
                dispatch(updateTest({
                    path: editItem.path,
                    test: res,
                }));
                dispatch(onAddAlertOptions({
                    status: true,
                    type: "success",
                    msg: "Test muvaffaqiyatli yangilandi",
                }));
                setEditActive(false);
                setEditItem(null);
            })
            .catch((err) => console.log(err));
    };

    const onDeleteFromEdit = () => {
        setDeleteActive(true);
    };

    const onDeleteTest = () => {
        request(`${API_URL}terms/delete-test/${editItem.id}/`, "DELETE", null, headers())
            .then(() => {
                dispatch(deleteTest({
                    path: editItem.path,
                    testId: editItem.id,
                }));
                dispatch(onAddAlertOptions({
                    status: true,
                    type: "success",
                    msg: "Test o‘chirildi",
                }));
                setDeleteActive(false);
                setEditActive(false);
                setEditItem(null);
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className={styles.item}>
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen(!open);
                }}
                className={styles.header}
            >
                <h3>{item.type === "group" ? "Sinf" : "Fan"} - {item?.title}</h3>
                <div style={{display: "flex", gap: "1rem"}}>
                    {hasTable && (
                        <i
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick(item, path);
                            }}
                            style={{fontSize: "1.6rem", cursor: "pointer"}}
                            className="fa fa-plus"
                        />
                    )}
                    <i
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(!open);
                        }}
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
                                                onEditId(row);
                                            }}
                                            style={{cursor: "pointer"}}
                                            className="fa fa-pen"
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
                            onViewTest={onViewTest}
                            selectedTerm={selectedTerm}
                        />
                    )}
                </div>
            )}

            <Modal setActive={setEditActive} active={editActive}>
                <div style={{padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem"}}>
                    <Input name="name" placeholder="Nomi" register={register}/>
                    <Input name="weight" type="number" placeholder="Foiz %" register={register}/>
                    <Input name="date" type="date" register={register}/>

                    <div style={{display: "flex", justifyContent: "space-between", marginTop: "1rem"}}>
                        <Button onClick={handleSubmit(onUpdateTest)}>Update</Button>
                        <Button type={"danger"} onClick={handleSubmit(onDeleteFromEdit)} style={{background: "red", color: "#fff"}}>
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>

            <ConfirmModal
                active={deleteActive}
                setActive={setDeleteActive}
                onClick={onDeleteTest}
            />
        </div>
    );
}
