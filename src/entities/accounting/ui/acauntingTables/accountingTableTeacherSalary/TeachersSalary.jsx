import React, {useMemo, useState} from 'react';
import {Table} from "../../../../../shared/ui/table";
import {Button} from "../../../../../shared/ui/button";
// import {color} from "framer-motion";
import cls from "../accountingTableWorkerSalary/empSalary.module.sass";
import {Modal} from "../../../../../shared/ui/modal";
import {Pagination} from "../../../../../features/pagination";
import {useSelector} from "react-redux";
import {getSearchValue} from "../../../../../features/searchInput";
import {useNavigate} from "react-router";

export const TeachersSalary = ({
                                   teacherSalary,
                                   onDelete,
                                   deleted,
                                   setChangePayment,
                                   setChangingData,
                                   changePayment,
                                   setActiveDelete,
                                   changingData,
                                   activeDelete
                               }) => {
    const filteredTeachers = teacherSalary.filter(item => !item.deleted);
    const search = useSelector(getSearchValue)
    let PageSize = useMemo(() => 50, [])
    const [currentTableData, setCurrentTableData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);

    const searchedUsers = useMemo(() => {
        const filteredHeroes = teacherSalary?.slice()
        setCurrentPage(1)


        if (!search) return filteredHeroes

        return filteredHeroes.filter(item =>
            item?.teacher?.user?.name?.toLowerCase().includes(search.toLowerCase())
        )
    }, [teacherSalary, setCurrentPage, search])
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
        return currentTableData?.map((item, index) => (
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

            <div style={{height: "calc(100vh - 43rem)", overflow: "auto"}}>

                <Table>
                    <thead>
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
            </div>
            <Pagination
                setCurrentTableData={setCurrentTableData}
                users={searchedUsers}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                pageSize={PageSize}
                onPageChange={page => {
                    setCurrentPage(page)
                }}
                type={"custom"}
            />


        </>

    );
};
