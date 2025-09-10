import {ClassTable} from "entities/class";
import {ClassFilter} from "entities/class"
import {useState} from "react";
import {useDispatch} from "react-redux";
import {useHttp} from "shared/api/base";

export const  ClassPage = ({setEdit, edit, setActiveEdit, activeMenu, setActiveMenu, classes,branch}) => {

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