import { useNavigate } from "react-router";
import { Table } from "shared/ui/table";
import cls from "./studnets.module.sass";

export const Students = ({ currentTableData }) => {
    const navigation = useNavigate();

    const renderStudents = () => {


        return currentTableData?.map((item, i) => {

            return (
                <tr key={item.id} onClick={() => navigation(`profile/${item?.id}`)}>
                    <td>{i + 1}</td>
                    <td>{item?.user?.name} {item?.user?.surname}</td>
                    <td>{item?.user?.age}</td>
                    <td>{item?.user?.phone}</td>
                    <td>{item?.group?.name ? item.group.name : `${item?.class_number} ${item?.group?.color}`}</td>
                    <td>{item?.face_id}</td>
                    <td>{item.user?.registered_date}</td>
                    <td>
                        {/*<div style={{ width: "fit-content", border: item.color ? `2px solid #${item.color}` : `2px solid black`, color: `${item.color}`, padding: ".8rem 1rem", borderRadius: "10px" }}>*/}
                        <h3 style={{ color: `${item?.color}` }}>{item.debt}</h3>
                        {/*</div>*/}
                    </td>
                </tr>
            )

        });
    };

    return (
        <div className={cls.students}>
            <div className={cls.table}>
                <Table extraClass={cls.table__head}>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Full name</th>
                            <th>Yosh</th>
                            <th>Telefon nomer</th>
                            <th>Guruh nomi</th>
                            <th>Face ID</th>
                            <th>Reg. sana</th>
                            <th>Qarzi </th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderStudents()}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};
