import {getCapitalCount} from "entities/accounting/model/selector/capital.js";
import {Pagination} from "features/pagination/index.js";
import {useSelector} from "react-redux";
import {Table} from "../../../../../shared/ui/table";
import {Button} from "../../../../../shared/ui/button";
import React from "react";
import {Modal} from "../../../../../shared/ui/modal";
import cls from "../accountingTableWorkerSalary/empSalary.module.sass";

export const AccountingCapitalCosts = ({
                                           capitalData,
                                           setChangingData,
                                           setActiveDelete,
                                           PageSize,
                                           setCurrentPage,
                                           currentPage
                                       }) => {

    const totalCount = useSelector(getCapitalCount)

    const onDeleteModal = (data) => {
        setActiveDelete(true)
    }

    const renderCapitalData = () => {
        return capitalData?.map((item, i) => (
            <tr>
                <td>{i + 1}</td>
                <td>{item?.name}</td>
                <td>{item?.price}</td>
                <td>{item?.added_date}</td>
                <td>{item.payment_type}</td>
                <td>
                    <div>
                        <Button
                            onClick={() => {
                                onDeleteModal({
                                    id: item.id,
                                    name: item.name,

                                })
                                setChangingData({
                                    id: item.id,
                                    name: item.name,
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
        <div className={cls.capital} >
            <Table extraClass={cls.capital__container}>
                <thead style={{position: "sticky", top: "0"}}>
                <tr>
                    <th/>
                    <th>Nomi</th>
                    <th>Narxi</th>
                    <th>Sana</th>
                    <th>To'lov turi</th>
                    <th>O'chirish</th>
                </tr>
                </thead>
                <tbody>
                {renderCapitalData()}
                </tbody>
            </Table>
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
        </div>
    );
};

