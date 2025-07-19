import {ClassTable} from "entities/class";
import {ClassFilter} from "entities/class"
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {classItemLoading, classItems} from "entities/class/model/selector/classSelector";
import {useHttp} from "shared/api/base";
import {DefaultPageLoader} from "../../../shared/ui/defaultLoader";

export const ClassPage = ({setEdit, edit, setActiveEdit, activeMenu, setActiveMenu, classes,branch}) => {

    const {request} = useHttp()
    const [selectBox, setSelectBox] = useState([])



    const dispatch = useDispatch()
    // const classType = useSelector(classItems)


    const id = edit.id


    return (
        <>
            <ClassFilter
                classesType={classes}
                setActiveEdit={setActiveEdit}
                edit={edit}
                setEdit={setEdit}
                active={activeMenu}
                setActive={setActiveMenu}
                branch={branch}
            />
            {/*{loading*/}
            {/*    ?*/}
            {/*    <DefaultPageLoader/>*/}
            {/*    :*/}
                <ClassTable
                    id={id}
                    active={activeMenu}
                    selectBox={selectBox}
                    setSelectBox={setSelectBox}
                    edit={edit}
                />
            {/*}*/}
            {/*<Button onClick={onClick}>Tastiqlash</Button>*/}
        </>
    )
}