import {Table} from "../../../../../shared/ui/table";
import {Button} from "../../../../../shared/ui/button";
import React from "react";
import {Modal} from "../../../../../shared/ui/modal";
import cls from "../accountingTableWorkerSalary/empSalary.module.sass";

export const AccountingCapitalCosts = ({capitalData  ,setChangingData  , setActiveDelete }) => {

    const onDeleteModal = (data) => {
        setActiveDelete(true)
    }

    const renderCapitalData = () => {
        return capitalData?.map((item , i) => (
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
        <div style={{height: "calc(100vh - 47rem)", overflow: "auto"}}>
            <Table>
                <thead>
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

        </div>
    );
};

