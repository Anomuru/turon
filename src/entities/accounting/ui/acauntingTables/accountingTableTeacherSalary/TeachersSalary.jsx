import {getTeachersLoading} from "entities/accounting/index.js";
import {getTeacherSalaryCount} from "entities/accounting/model/selector/teacher.js";
import React, {useMemo, useState} from 'react';
import {useSelector} from "react-redux";
import {useNavigate} from "react-router";

import {Pagination} from "features/pagination";
import {getSearchValue} from "features/searchInput";
import {DefaultPageLoader} from "shared/ui/defaultLoader/index.js";
import {Table} from "shared/ui/table";
import {Button} from "shared/ui/button";

export const TeachersSalary = ({
                                   teacherSalary,
                                   setChangePayment,
                                   setChangingData,
                                   setActiveDelete,
                                   PageSize,
                                   currentPage,
                                   setCurrentPage
                               }) => {

    const totalCount = useSelector(getTeacherSalaryCount)
    const search = useSelector(getSearchValue)
    const loading = useSelector(getTeachersLoading)



    const formatSalary = (salary) => {
        return Number(salary).toLocaleString();
    };


    const onDeleteModal = (data) => {
        setActiveDelete(true)

    }

    // const renderTeacherDeleted = () => {
    //     return filteredDeletedTeachers.map((item, index) => (
    //         <>
    //
    //             <tbody>
    //             <tr key={index}>
    //                 <td>{index + 1}</td>
    //                 <td>{item.name} {item.surname}</td>
    //                 <td>{item.salary}</td>
    //                 <td>{item.comment}</td>
    //                 <td>{item.date}</td>
    //                 <td
    //                     onClick={() => {
    //                         setChangingData({
    //                             id: item.id,
    //                             payment_types: item.payment_types
    //                         });
    //                         setChangePayment(true);
    //                     }}
    //                 >
    //                     {item.payment_types}
    //                 </td>
    //                 {/*<td>{index + 1}</td>*/}
    //                 {/*<td>{item.name} {item.surname}</td>*/}
    //                 {/*<td>{formatSalary(item.salary)}</td>*/}
    //                 {/*<td>{item.comment}</td>*/}
    //                 {/*<td>{item.date}</td>*/}
    //                 {/*<td onClick={() => {*/}
    //                 {/*    setChangingData({*/}
    //                 {/*        id: item.id,*/}
    //                 {/*        // payment_types: item.payment_types?.name,*/}
    //                 {/*        payment_types: item.payment_types,*/}
    //                 {/*        // userId: item.user.id,*/}
    //                 {/*    })*/}
    //                 {/*    setChangePayment(!changePayment)*/}
    //                 {/*}}>*/}
    //                 {/*    <div style={{*/}
    //                 {/*        border: "1px solid",*/}
    //                 {/*        width: "fit-content",*/}
    //                 {/*        padding: "5px 10px",*/}
    //                 {/*        borderRadius: "15px",*/}
    //                 {/*        textTransform: "capitalize",*/}
    //                 {/*        cursor: "pointer"*/}
    //                 {/*    }}>{item.payment_types}</div>*/}
    //                 {/*</td>*/}
    //
    //             </tr>
    //             </tbody>
    //         </>
    //     ))
    // }
    const navigation = useNavigate();


    const renderTeacherSalary = () => {
        return teacherSalary?.map((item, index) => (
            <tbody>
            <tr key={item.id}>
                <td>{index + 1}</td>
                <td
                    onClick={() => navigation(`../../teacher/teacherProfile/${item?.teacher?.id}`, {relative: "path"})}
                >
                    {item?.teacher?.user?.name} {item?.teacher?.user?.surname}
                </td>
                <td>{item?.salary}</td>
                <td>{item?.comment}</td>
                <td>{item?.date}</td>
                <td
                    onClick={() => {
                        setChangingData({
                            id: item?.id,
                            payment: item?.payment
                        });
                        setChangePayment(true);
                    }}
                >
                    <div style={{
                        border: "1px solid",
                        width: "fit-content",
                        padding: "5px 10px",
                        borderRadius: "15px",
                        textTransform: "capitalize",
                        cursor: "pointer"
                    }}>{item?.payment?.name}</div>
                </td>
                <td>
                    <div>
                        <Button
                            onClick={() => {
                                onDeleteModal({
                                    id: item?.id,
                                    name: item?.teacher?.user?.name,
                                    surname: item?.teacher?.user?.surname
                                })
                                setChangingData({
                                    id: item?.id,
                                    name: item?.teacher?.user?.name,
                                    surname: item?.teacher?.user?.surname
                                })
                            }
                            }
                            type={"delete"}
                            children={
                                <i className={"fa fa-times"} style={{color: "white"}}
                                />
                            }
                        />
                    </div>
                </td>
            </tr>

            </tbody>
        ))
    }

    const render = renderTeacherSalary()
    return (
        <>

            <div style={{height: "calc(100vh - 35rem)", overflow: "auto"}}>

                {
                    loading
                        ? <DefaultPageLoader/>
                        : <Table>
                            <thead style={{position: "sticky", top: "0"}}>
                            <tr>
                                <th>No</th>
                                <th>Ism Familiya</th>
                                <th>Oylik</th>
                                <th>Sabab</th>
                                <th>Sana</th>
                                <th>To'lov turi</th>
                                <th>O'chirish</th>
                            </tr>
                            </thead>
                            {render}
                        </Table>
                }
            </div>
            <Pagination
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                pageSize={PageSize}
                onPageChange={page => {
                    setCurrentPage(page)
                }}
                type={"custom"}
                totalCount={totalCount}
            />


        </>

    );
};
