import {Table} from "../../../../shared/ui/table";

export const Overhead = ({overhead , extraClass , formatSalary}) => {

    const renderTable = () => {
        return overhead?.overheads?.overhead_data?.map((item , i) => (
            <tr>
                <td>{i +1}</td>
                <td>{item.name}</td>
                <td>{item.payment.name}</td>
                <td>{formatSalary(item.price)}</td>
                <td>{item.created}</td>
            </tr>
        ))

    }

    const render = renderTable()
    return (
        <div className={extraClass}>

            <Table>
                <thead>
                <tr>
                    <th>No</th>
                    <th>Nomi</th>
                    <th>To'lov turi</th>
                    <th>Narxi</th>
                    <th>Sana</th>
                </tr>
                </thead>
                <tbody>
                {render}
                </tbody>
            </Table>
        </div>
    );
};

