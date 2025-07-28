import {Table} from "shared/ui/table";
import {ClassModal} from "../classModal/classModal";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import cls from "./classTable.module.sass"
import {API_URL, headers, useHttp} from "shared/api/base";
import {useDispatch, useSelector} from "react-redux";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import {fetchClassSubjects} from "../../model/thunk/classThunk";
import {classNewItems, classSubjects} from "../../model/selector/classSelector";
import {classItem, updateClassItem} from "../../model/thunk/classThunk";
import {data} from "../../../calendar";
import {onChangeClassStatus, onDeleteSubject} from "../../model/slice/classSlice";
import classNames from "classnames";
import {ClassTableEdit} from "features/classModals/ui";


export const ClassTable = ({edit}) => {

    const [editClass, setEditClass] = useState(false)

    const [changedItem, setChangedItem] = useState({})

    const subjects = useSelector(classSubjects)
    const classItems = useSelector(classNewItems)

    const {request} = useHttp()
    const dispatch = useDispatch()
    const [selectedSubject, setSelectedSubject] = useState([])
    const [selectedClass, setSelectedClass] = useState(null);


    useEffect(() => {
        if (editClass) {
            const selected = classItems.find(item => item.id === editClass);
            setSelectedClass(selected);
        }
    }, [editClass, classItems]);


    // const onChangeClass = (data) => {

    //     const res = {
    //         subjects: selectedSubject.map(item => (
    //             // name: item.label,
    //             item.value
    //         )),
    //         ...data
    //     }
    //     const idClass = editClass
    //     //
    //     // setValue("curriculum_hours", "")
    //     // setValue("price", "")
    //     dispatch(updateClassItem({idClass, res}))
    //     setEditClass(!editClass)
    //     dispatch(classItem(1))
    //
    // }

    // const onDeleteSub = (id) => {
    //
    //     dispatch(onDeleteSubject(id))

    //
    // }

    // const checkedItem = (id) => {
    //     const filteredCheckbox = clickedCheckbox.filter(item => item !== id)
    //     setClickedCheckbox([...filteredCheckbox, id])
    // }



    const onChange = ({id , type}) => {

        const res = {
            status: !type,
            class_type_id: edit.id,
            class_number_id: id
        }

        request(`${API_URL}Class/class_number_update_status/`, "POST", JSON.stringify(res), headers())
            .then(res => {
                dispatch(onChangeClassStatus({id}))
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: res.msg
                }))

            })
            .catch(err => {
                console.log(err)
            })
    }
    // const sortItemsByStatus = (items) => {
    //     // return [...items].sort((a, b) => b.status - a.status);
    // };



    const renderTable = () => {
        return classItems.map((item, i) => {

            return <tr>
                <td>{i + 1}</td>
                <td>{item?.number}</td>
                <td>
                    <div className={cls.subject__main}>
                        {item?.subjects.map(itemSubject => (
                            <span className={cls.subject}> {itemSubject.name}-{itemSubject.hours}</span>
                        ))}
                    </div>
                </td>
                <td>{item.price}</td>
                <td style={{width: "3rem"}}>
                    <div className={cls.items}>

                        <div
                            onClick={() => onChange({id: item.id, type: item.status})}
                            className={classNames(cls.checkbox__minus , {
                                [cls.active] : item.status
                            })}
                        >
                            {
                                item.status ?
                                <i className={`fa fa-check `}/> :
                                <i className={`fa fa-minus`}/>

                            }
                        </div>

                        <i
                            onClick={() => {
                                setEditClass(item.id)
                                setChangedItem(item)
                            }}
                            className={"fa fa-pen"}
                        />
                    </div>
                </td>
            </tr>
        })
    };
    const render = renderTable()


    return (
        <div>

                <Table>
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Sinf Raqami</th>
                        <th>Fanlari</th>
                        <th>Narxi</th>
                        <th/>

                    </tr>
                    </thead>
                    <tbody>
                    {render}
                    </tbody>
                </Table>

            {/*<ClassModal*/}
            {/*    selectedClass={selectedClass}  // Pass selected class*/}
            {/*    selectedSubject={selectedSubject}*/}
            {/*    setSelectedSubject={setSelectedSubject}*/}
            {/*    // changeInfo={onChangeClass}*/}
            {/*    // selectOptions={selectOptions}*/}
            {/*    extraClassForm={cls.extraClassForm}*/}
            {/*    extraClassSelect={cls.select}*/}
            {/*    extraClassBtn={cls.btn}*/}
            {/*    editClass={editClass}*/}
            {/*    setEditClass={setEditClass}*/}
            {/*    // register={register}*/}
            {/*    changedItem={changedItem}*/}
            {/*    selectOptions={subjects}*/}
            {/*    edit={edit}*/}
            {/*    // handleSubmit={handleSubmit}*/}
            {/*    // onDeleteSub={onDeleteSub}*/}
            {/*/>*/}
            <ClassTableEdit

                // register={register}
                setEditClass={setEditClass}
                selectOptions={subjects}
                editClass={editClass}
                changedItem={changedItem}
                edit={edit}


            />
        </div>
    )
}
