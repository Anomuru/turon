import React, {useCallback} from "react";
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";

import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {getClassesForClassTypes, getClassNewNumberList} from "../../model/thunk/classThunk";

import cls from "./classFilter.module.sass"
import {classItemLoading, classItemTypeLoading} from "entities/class/model/selector/classSelector.js";

export const ClassFilter = ({classesType, active, setActive, setEdit}) => {

    const dispatch = useDispatch()

    const userBranchId = useSelector(getUserBranchId)
    const loading = useSelector(classItemTypeLoading)

    const onClick = useCallback((id) => {
        // dispatch(getClassNewNumberList({branchId: userBranchId, id: id}))
        dispatch(getClassesForClassTypes({branchId: userBranchId, id: id}))
    }, [userBranchId])

    function compareById(a, b) {
        return a.id - b.id;
    }

    console.log(classesType , "class")
    return (
        <div className={cls.classFilter}>
            <div
                className={classNames(cls.classFilter__wrapper, {
                    [cls.active]: loading
                })}
            >
                {
                    loading
                        ? <div className={cls.loader}>
                            <div className={cls.loader__circle}>
                                <div></div>
                            </div>
                        </div>
                        : <ul>
                            {[...classesType]?.sort(compareById)?.map((item, i) => {
                                return (
                                    <li
                                        className={classNames(cls.classFilter_li, {
                                            [cls.active]: active === item?.id,

                                        })}
                                        key={i}
                                        onClick={() => {
                                            onClick(item.id)
                                            setActive(item.id)
                                            setEdit({
                                                id: item.id,
                                                name: item.name
                                            })

                                        }}
                                    >{item?.name}
                                        <div>
                                            {item.class_numbers?.map(item => (
                                                <span>{item?.number}</span>
                                            ))}
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                }
            </div>
        </div>
    )
}