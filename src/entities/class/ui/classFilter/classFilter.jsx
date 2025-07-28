import cls from "./classFilter.module.sass"
import {useCallback, useState} from "react";
import classNames from "classnames";
import {API_URL, headers, useHttp} from "shared/api/base";
import {useDispatch, useSelector} from "react-redux";
import {classItem, getClassNewNumberList} from "../../model/thunk/classThunk";
import {useParams} from "react-router";
import {getBranch} from "../../../../features/branchSwitcher";

// const data = [
//     {
//         name: "Nursery",
//         class: "1-2"
//     },
//     {
//         name: "Primary",
//         class: "2-4"
//     },
//     {
//         name: "Lower-Secondary",
//         class: "5-7"
//     },
//     {
//         name: "Upper-Secondary",
//         class: "8-9"
//     },
//     {
//         name: "Advanced",
//         class: "10-11"
//     },
//     {
//         name: "Curriculum"
//     }
// ]

export const ClassFilter = ({classesType, active, setActive, setEdit}) => {

    const dispatch = useDispatch()




    const userBranchId = useSelector(getBranch)
    const onClick = useCallback((id) => {
        // dispatch(classItem({branchId: userBranchId, id: id}))
        dispatch(getClassNewNumberList({branchId: userBranchId.id, id: id}))
    }, [userBranchId])

    function compareById(a, b) {
        return a.id - b.id;
    }

    return (
        <div className={cls.classFilter}>
            <div className={cls.classFilter__wrapper}>
                <ul>
                    {[...classesType].sort(compareById)?.map((item, i) => {
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
            </div>
        </div>
    )
}