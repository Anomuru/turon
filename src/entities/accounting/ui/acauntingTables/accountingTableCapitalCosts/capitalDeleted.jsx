import {Button} from "../../../../../shared/ui/button";
import React from "react";
import {Table} from "../../../../../shared/ui/table";

export const CapitalDeleted = ({deleted}) => {

    const renderCapitalData = () => {
        return deleted.map((item , i) => (
            <tr>
                <td>{i + 1}</td>
                <td>{item?.name}</td>
                <td>{item.price}</td>
                <td>{item?.added_date}</td>
                <td>{item.payment_type?.name}</td>
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
                </tr>
                </thead>
                <tbody>
                {renderCapitalData()}
                </tbody>
            </Table>
        </div>
    );
};


