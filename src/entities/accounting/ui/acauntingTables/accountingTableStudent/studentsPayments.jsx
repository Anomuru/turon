import {Table} from "shared/ui/table";
import {Button} from "shared/ui/button";
import {Modal} from "../../../../../shared/ui/modal";
import React, {useMemo, useState} from "react";
import cls from "../accountingTableWorkerSalary/empSalary.module.sass";
import {Select} from "../../../../../shared/ui/select";
import {Pagination} from "../../../../../features/pagination";
import {useSelector} from "react-redux";
import {getSearchValue} from "../../../../../features/searchInput";
import {useNavigate} from "react-router";
import {getLoadingStudent, getStudentPaymentsCount} from "entities/accounting/index.js";
import {DefaultPageLoader} from "shared/ui/defaultLoader/index.js";


export const StudentsPayments = ({
                                     studentData,
                                     setChangingData,
                                     setActiveDelete,
                                     formatSalary,
                                     currentPage,
                                     setCurrentPage,
                                     PageSize,
                                 }) => {

    const search = useSelector(getSearchValue)
    const loading = useSelector(getLoadingStudent)
    const totalCount = useSelector(getStudentPaymentsCount)

    const navigation = useNavigate();

    const onDeleteModal = (data) => {
        setActiveDelete(true)
    }

    const renderStudents = () => {
        return studentData?.map((item, i) => (
            <tr>
                <td>{i + 1}</td>
                <td onClick={() => navigation(`../../students/profile/${item.student_id}`)}>{item?.student_name} {item?.student_surname}</td>
                <td>{formatSalary(item.payment_sum)}</td>
                <td>{item.date}</td>
                <td>
                    <div style={{
                        border: "1px solid",
                        width: "fit-content",
                        padding: "5px 10px",
                        borderRadius: "15px",
                        textTransform: "capitalize",
                        cursor: "pointer"
                    }}>{item?.payment_type_name}</div>
                </td>
                <td>
                    <div>
                        <Button
                            onClick={() => {
                                onDeleteModal({
                                    id: item.id,
                                    name: item?.student_name,
                                    surname: item?.student_surname
                                })
                                setChangingData({
                                    id: item.id,
                                    name: item?.student_name,
                                    surname: item?.student_surname
                                })
                            }
                            }
                            type={"delete"}
                            children={<i className={"fa fa-times"} style={{color: "white"}}/>}
                        />
                    </div>
                </td>
            </tr>
        ))
    }
    return (
        <>
            <div className={cls.empSalary}>

                {
                    loading
                        ? <DefaultPageLoader/>
                        : <Table>
                            <thead style={{top: "0", position: "sticky"}}>
                            <tr>
                                <th>No</th>
                                <th>Ism Familiya</th>
                                <th>To'lov</th>
                                <th>Sana</th>
                                <th>To'lov turi</th>
                                <th>Ochirich</th>
                            </tr>
                            </thead>
                            <tbody>
                            {renderStudents()}
                            {/*{deleted ? renderDeletedStudents() : renderStudents()}*/}
                            </tbody>
                        </Table>
                }
                {/*<Modal active={changePayment} setActive={setChangePayment}>*/}
                {/*    <h2>To'lov turini uzgartirish</h2>*/}
                {/*    <div className={cls.changeType}>*/}
                {/*        <Select title={changingData.payment_types} options={getCapitalType}*/}
                {/*                onChangeOption={(value) => onChange(value)}/>*/}
                {/*        /!*<Button onClick={onChange}>Tastiqlash</Button>*!/*/}
                {/*    </div>*/}
                {/*</Modal>*/}


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

// onDelete(item.id)