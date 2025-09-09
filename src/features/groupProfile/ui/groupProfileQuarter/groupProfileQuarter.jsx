import {useEffect, useState} from "react";
import styles from "./groupProfileQuarter.module.sass"
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {addTest, groupQuarterReducer} from "features/groupProfile/model/groupQuarterSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {getTerm, getTermData} from "features/groupProfile/model/groupQuarterSelector.js";
import {fetchTerm, fetchTermData} from "features/groupProfile/model/groupQuarterThunk.js";
import {Select} from "shared/ui/select/index.js";
import {Modal} from "shared/ui/modal/index.js";
import {Input} from "shared/ui/input/index.js";
import {useForm} from "react-hook-form";
import {Button} from "shared/ui/button/index.js";
import {API_URL, headers, useHttp} from "shared/api/base.js";


const reducers = {
    groupQuarterSlice: groupQuarterReducer
}

export const GroupProfileQuarter = () => {


    const data = useSelector(getTermData)
    const term = useSelector(getTerm)
    const [selectedTerm, setSelectedTerm] = useState(null)
    const [active, setActive] = useState(false)
    const [activeItems, setActiveItems] = useState({})
    const branchId = localStorage.getItem("branchId")
    const {reset, register, handleSubmit} = useForm()
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

    console.log(selectedTerm)


    const onClick = (item, path) => {

        setActive(true);


        setActiveItems(
            path
        );
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
                console.log(res)
                dispatch(addTest({
                    path: activeItems, // butun path
                    test: res     // serverdan kelgan test
                }));
                setActive(false)
                // reset()
            })
            .catch(err => console.log(err))

    }

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={styles.quarter}>
                <div style={{alignSelf: "flex-end"}}>
                    <Select defaultValue={selectedTerm} options={term} onChangeOption={setSelectedTerm}/>
                </div>
                <Accordion onClick={onClick} items={data}/>
            </div>
            <Modal setActive={setActive} active={active}>
                <div style={{padding: "2rem"}}>
                    <Input name={"name"} placeholder={"Nomi"} register={register}/>

                    <Input name={"weight"} type={"number"} register={register} placeholder={"Foiz % "}/>
                    <Input name={"date"} type={"date"} register={register}/>
                    <Button onClick={handleSubmit(onPostTerm)}>Create</Button>
                </div>


            </Modal>

        </DynamicModuleLoader>
    );
}

function Accordion({items, onClick, parentId = null, path = []}) {
    return (
        <div className={styles.accordion}>
            {items?.map((item, i) => (
                <AccordionItem
                    key={i}
                    item={item}
                    parentId={parentId}
                    path={[...path, {id: item?.id, title: item?.title, type: item.type}]}
                    onClick={onClick}
                />
            ))}
        </div>
    );
}

function AccordionItem({item, parentId, path, onClick}) {
    const [open, setOpen] = useState(false);

    const hasChildren = !!item?.children;
    const hasTable = !!item?.tableData;


    console.log(item , "item")
    return (
        <div className={styles.item}>
            <div className={styles.header}>
                <h3>{item.type === "group"  ?  "Guruh" : "Fan"} - {item?.title}</h3>
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
                            </tr>
                            </thead>
                            <tbody>
                            {item?.tableData?.map((row, idx) => (
                                <tr key={idx}>
                                    <td>{row?.id}</td>
                                    <td>{row?.name}</td>
                                    <td>{row?.weight}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}

                    {hasChildren && (
                        <Accordion
                            items={item?.children}
                            parentId={item?.id}
                            path={path} // 🔑 hozirgacha bo‘lgan yo‘lni uzatamiz
                            onClick={onClick}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
