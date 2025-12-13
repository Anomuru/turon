import {ParentsProfileChildInfo, ParentsProfileInfo} from "entities/parents/index.js";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice.js";
import {getChildren} from "features/parentsProfile/model/parentsProfileSelector.js";
import {onAddParentChild} from "features/parentsProfile/model/parentsProfileSlice.js";
import {fetchParentInfo, fetchParentsAvailableStudents} from "features/parentsProfile/model/parentsProfileThunk.js";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import {Button} from "shared/ui/button/index.js";
import {Input} from "shared/ui/input/index.js";
import {Modal} from "shared/ui/modal/index.js";
import {SearchInput} from "shared/ui/searchInput/index.js";
import {Table} from "shared/ui/table/index.js";
import cls from "./parentsProfile.module.sass"

export const ParentsProfile = () => {

    const [activeAdd , setActiveAdd] = useState(false)
    const [selectedIds, setSelectedIds] = useState([]);

    const parentsChild = useSelector(getChildren)

const  {request} = useHttp()
    const {id}= useParams()
    const dispatch = useDispatch()
    useEffect(() =>{
        dispatch(fetchParentInfo(id))
    } , [])
    useEffect(() => {
        dispatch(fetchParentsAvailableStudents(id))

    } , [activeAdd])

    const handleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };


    const onAddChild = () => {

        console.log("hello")
        const res = {student_ids: selectedIds}

        request(`${API_URL}parents/${id}/add_students/` , "POST" , JSON.stringify(res) , headers())
            .then(res => {
                console.log(res)
                dispatch(onAddParentChild(res.children))
                setActiveAdd(false)
                setSelectedIds([])
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: "Muvofaqqiyatli o'chirildi"
                }))
            })
    }


    return (
        <>
            <div className={cls.parents}>
                <ParentsProfileInfo/>
                <ParentsProfileChildInfo setActiveAdd={setActiveAdd}/>
            </div>

            <Modal extraClass={cls.modal} setActive={setActiveAdd} active={activeAdd}>
                <div className={cls.modal__header}>
                    <h1>Qo'shish</h1>
                    <SearchInput extraClass={cls.modal__search}/>
                </div>

                <div className={cls.modal__table}>
                    <Table>
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Ism Familiya</th>
                            <th>Yosh</th>
                            <th>Numer</th>
                            <th/>
                        </tr>
                        </thead>

                        <tbody>
                        {parentsChild.map((item, i) => (
                            <tr key={item.id}>
                                <td>{i + 1}</td>
                                <td>{item.name} {item.surname}</td>
                                <td>{item.age}</td>
                                <td>{item.phone}</td>
                                <td>
                                    <Input
                                        type="checkbox"
                                        checked={selectedIds?.includes(item?.id)}
                                        onChange={() => handleSelect(item?.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>

                    </Table>
                </div>

                <Button onClick={onAddChild} extraClass={cls.modal__btn}>
                    Qo'shish
                </Button>
            </Modal>
        </>
    );
};
