import {Table} from "shared/ui/table";
import cls from "./deletedGroups.module.sass";



export const DeletedGroups = ({currentTableData}) => {





    return (
        <div className={cls.deletedGroups}>
            <div className={cls.table}>
                <Table extraClass={cls.table__head}>
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Guruh Nomi</th>
                        <th>Full name</th>
                        <th>Fan</th>
                        <th>Kurs Turi</th>
                        <th>Guruh narxi</th>
                        <th>O'chirilgan sana</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentTableData.map((item, i) => {
                        return (

                            <tr>
                                <td>{i + 1}</td>
                                <td>{item.groupName}</td>
                                <td>{item.name} {item.surname}</td>
                                <td><div>{item.subject}</div></td>
                                <td>{item.typeCourse}</td>
                                <td><div>{item.groupPrice}</div></td>
                                <td>{item.deletedDate}</td>
                            </tr>

                        )
                    })}
                    </tbody>
                </Table>
            </div>


        </div>
    )
}
