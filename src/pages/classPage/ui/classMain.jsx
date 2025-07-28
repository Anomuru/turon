import {DefaultPageLoader} from "shared/ui/defaultLoader";
import {ClassHeader} from "entities/class";
import {useEffect, useState} from "react";
import cls from "./classPage.module.sass";
import {ClassPage} from "./classPage";
import {ClassAddColorPage} from "./classAddColorPage";
import {useDispatch, useSelector} from "react-redux";
import {classData, classItemLoading, colorItem} from "entities/class/model/selector/classSelector";
import {fetchClassSubjects, getClassTypes, getColor} from "entities/class/model/thunk/classThunk";
import {getBranch} from "features/branchSwitcher";
import {useParams} from "react-router";


export const ClassMain = () => {

    const classes = useSelector(classData)
    const color = useSelector(colorItem)
    const loading = useSelector(classItemLoading)
    const [activeMenu, setActiveMenu] = useState(classes)
    const [edit, setEdit] = useState({})
    const [activeEdit, setActiveEdit] = useState(false)



    const userBranchId = useSelector(getBranch)




    const dispatch = useDispatch()
    useEffect(() => {

        if (userBranchId) {
            dispatch(getClassTypes(userBranchId.id))
            dispatch(getColor())
            dispatch(fetchClassSubjects())
        }

    }, [userBranchId])
    const [activeSwitch, setActiveSwitch] = useState(true)


    return (
        <div className={cls.class}>
            <ClassHeader
                activeMenu={activeMenu}
                activeEdit={activeEdit}
                setActiveEdit={setActiveEdit}
                edit={edit}
                setEdit={setEdit}
                activeSwitch={activeSwitch}
                setActiveSwitch={setActiveSwitch}
            />

            {
                activeSwitch ?
                    <ClassPage
                        setActiveEdit={setActiveEdit}
                        classes={classes}
                        setActiveMenu={setActiveMenu}
                        activeMenu={activeMenu}
                        activeEdit={activeEdit}
                        edit={edit}
                        setEdit={setEdit}
                    />
                    :
                    <ClassAddColorPage
                        color={color}
                        edit={edit}
                        setEdit={setEdit}
                    />
            }
        </div>
    );
};

