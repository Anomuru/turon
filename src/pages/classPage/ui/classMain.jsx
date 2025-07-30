import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {getBranch} from "features/branchSwitcher";
import {getUserBranchId} from "entities/profile/userProfile";
import {ClassHeader, classReducer} from "entities/class";
import {classData, classItemLoading, colorItem} from "entities/class/model/selector/classSelector";
import {fetchClassSubjects, getClassTypes, getColor} from "entities/class/model/thunk/classThunk";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {ClassAddColorPage} from "./classAddColorPage";
import {ClassPage} from "./classPage";

import cls from "./classPage.module.sass";

const reducers = {
    classSlice: classReducer
}

export const ClassMain = () => {

    const classes = useSelector(classData)
    const color = useSelector(colorItem)
    const [activeMenu, setActiveMenu] = useState(classes)
    const [edit, setEdit] = useState({})
    const [activeEdit, setActiveEdit] = useState(false)


    const userBranchId = useSelector(getUserBranchId)


    const dispatch = useDispatch()
    useEffect(() => {

        if (userBranchId) {
            dispatch(getClassTypes(userBranchId))
            dispatch(getColor())
            dispatch(fetchClassSubjects())
        }

    }, [userBranchId])
    const [activeSwitch, setActiveSwitch] = useState(true)


    return (
        <DynamicModuleLoader reducers={reducers}>
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
                            classes={classes ?? []}
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
        </DynamicModuleLoader>
    );
};

