import {getUserBranchId} from "entities/profile/userProfile";
import {getUserSystemId} from "entities/profile/userProfile/model/userProfileSelector";
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";

import {Table} from "shared/ui/table";
import {getGroupListWithFilter} from "../../model/selectors/groupsList";
import cls from "./groupsList.module.sass";
import {DefaultPageLoader} from "../../../../shared/ui/defaultLoader";

export const GroupsList = React.memo(({currentTableData}) => {
    const getFilteredGroups = useSelector(getGroupListWithFilter)
    const navigate = useNavigate()
    const userSystem = JSON.parse(localStorage.getItem("selectedSystem")) // changed

    const renderGroups = () => {
        // const groupsToRender = getFilteredGroups && getFilteredGroups.length > 0 ? getFilteredGroups : currentTableData
        // if (!groupsToRender || groupsToRender.length === 0)
        // {
        //     return (
        //         <DefaultPageLoader/>
        //     )
        // }
        return currentTableData?.map((item, i) => {
            return (
                <tr onClick={() => navigate(`groupInfo/${item?.id}`)}>
                    <td>{i + 1}</td>
                    <td>{item?.name}</td>
                    {
                        userSystem?.name === "center" ? <>
                                <td>{item?.name} {item?.surname}</td>
                                <td>{item?.subject?.name}</td>
                                <td>{item?.course_types?.name}</td>
                                <td>{item?.price}</td>
                            </> :
                            // null
                            <>
                                <td>{item?.teacher}</td>
                                <td>{item?.students?.length}</td>
                                <td>{item?.price ? item.price : "Sinfga hali narx belgilanmagan"}</td>
                                {/*<td>{`${item?.class_number?.number}-${item?.color?.name}`}</td>*/}
                            </>
                    }

                    {/*<td>{item?.status ? <div><div/></div> : null }</td>*/}

                    {/*<td>{item?.status ?<div><div/></div> : <div className={cls.red}><div className={cls.red__inner}/></div> }</td>*/}


                    <td>{item?.status ? <div>
                            <div/>
                        </div>
                        :
                        <div className={cls.red}>
                            <div className={cls.red__inner}/>
                        </div>
                    }

                    </td>

                </tr>
            )
        })
    }

    const render = renderGroups()

    return (
        <>

            <Table extraClass={cls.table__head}>
                <thead>
                {
                    userSystem?.name === "center" ? <tr>
                        <th>No</th>
                        <th>Guruh Nomi</th>
                        <th>Full name</th>
                        <th>Fan</th>
                        <th>Kurs Turi</th>
                        <th>Guruh narxi</th>
                        <th>Status</th>
                    </tr> : <tr>
                        <th>No</th>
                        <th>Sinf nomi</th>
                        <th>O’qituvchi ism familiya</th>
                        <th>Studentlar soni</th>
                        <th>Sinf narxi</th>
                        <th>Status</th>
                    </tr>
                }
                </thead>
                <tbody>
                {render}
                {/*{*/}
                {/*    currentTableData?.map((item, i) => {*/}
                {/*        return (*/}
                {/*            <tr onClick={() => navigate(`groupInfo/${item?.id}`)}>*/}
                {/*                <td>{i + 1}</td>*/}
                {/*                <td>{item?.name}</td>*/}
                {/*                {*/}
                {/*                    userSystem === 1 ? <>*/}
                {/*                            <td>{item?.name} {item?.surname}</td>*/}
                {/*                            <td>{item?.subject?.name}</td>*/}
                {/*                            <td>{item?.course_types?.name}</td>*/}
                {/*                            <td>{item?.price}</td>*/}
                {/*                        </> :*/}
                {/*                        // null*/}
                {/*                        <>*/}
                {/*                            <td>{`${item?.teacher[0]?.user?.surname} ${item?.teacher[0]?.user?.name}`}</td>*/}
                {/*                            <td>{item?.students?.length}</td>*/}
                {/*                            <td>{`${item?.class_number?.number}-${item?.color?.name}`}</td>*/}
                {/*                        </>*/}
                {/*                }*/}

                {/*                /!*<td>{item?.status ? <div><div/></div> : null }</td>*!/*/}

                {/*                /!*<td>{item?.status ?<div><div/></div> : <div className={cls.red}><div className={cls.red__inner}/></div> }</td>*!/*/}


                {/*                <td>{item?.status ? <div>*/}
                {/*                    <div/>*/}
                {/*                </div> : <div className={cls.red}>*/}
                {/*                    <div className={cls.red__inner}/>*/}
                {/*                </div>}</td>*/}

                {/*            </tr>*/}
                {/*        )*/}
                {/*    })*/}
                {/*}*/}
                </tbody>
            </Table>
        </>
    );
})