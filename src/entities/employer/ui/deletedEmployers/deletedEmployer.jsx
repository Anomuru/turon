import cls from "./deletedEmployer.module.sass"
import {useSelector} from "react-redux";
import {getDeletedEmployersData, getEmployersData} from "../../model/selector/employersSelector";
import {Table} from "shared/ui/table";
import React, {useState} from "react";



export const DeletedEmployers = () => {
    const deletedEmployers = useSelector(getDeletedEmployersData)


    const [clickedCheckbox, setClickedCheckbox] = useState([])


    const [removeClickedCheckbox , setRemovedClickedCheckbox] = useState([])

    const checkedItem = (id) => {
        const filteredCheckbox = clickedCheckbox.filter(item => item !== id)
        setClickedCheckbox([...filteredCheckbox , id])


        // const unFilteredCheckbox = removeClickedCheckbox.filter(item => item === id)
        // setRemovedClickedCheckbox([...unFilteredCheckbox , id])

    }

    const renderEmployers = () => {
        return deletedEmployers?.map((item, i) => {
            return (
                <tr>
                    <td>{i + 1}</td>
                    <td>{item.name} {item.surname}</td>
                    <td>{item.phone}</td>
                    <td>{item.age}</td>
                    <td>{item.work}</td>
                    <td>{item.deleteData}</td>
                </tr>
            )
        })
    }
    return (
        <div className={cls.employer}>
            <div className={cls.table}>
                <Table>
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Full name</th>
                        <th>Tel</th>
                        <th>Yosh</th>
                        <th>Fan</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {renderEmployers()}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}