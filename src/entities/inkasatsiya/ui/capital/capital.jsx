import {Table} from "../../../../shared/ui/table";

export const Capital = ({capital , extraClass , formatSalary}) => {
    const renderTable = () => {
        return capital?.capitals?.capital_data?.map((item, i) => (
            <tr>
                <td>{i +1}</td>
                <td>{item.name}</td>
                <td>{item.payment_type.name}</td>
                <td>{formatSalary(item.price)}</td>
                <td>{item.added_date}</td>
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

