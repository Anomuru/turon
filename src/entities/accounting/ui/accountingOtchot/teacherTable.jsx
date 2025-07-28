import {Table} from "../../../../shared/ui/table";

export const TeacherTable = ({teacherSalary , formatSalary}) => {

    const renderTable = () => {
        return teacherSalary?.salary?.map((item, i) => (
            <tr>
                <td>{i + 1}</td>
                <td>{item?.name} {item?.surname}</td>
                <td>{item?.phone}</td>
                <td>{item?.subject}</td>
                <td>{formatSalary(item?.total_salary)}</td>
                <td>{formatSalary(item?.taken_salary)}</td>
                <td>{formatSalary(item?.remaining_salary)}</td>
                <td>{formatSalary(item.cash)}</td>
                <td>{formatSalary(item.bank)}</td>
                <td>{formatSalary(item.click)}</td>

            </tr>
        ))
    }

    const render = renderTable()
    return (
        <div>

            <Table>
                <thead>
                <tr>
                    <th>No</th>
                    <th>Ism Familiya</th>
                    <th>Telefon numer</th>
                    <th>Fan</th>
                    <th>Umimiy oylik</th>
                    <th>Olingan oylik</th>
                    <th>Qolgan oylik</th>
                    <th>Cash</th>
                    <th>Bank</th>
                    <th>Click</th>
                </tr>
                </thead>
                <tbody>
                {render}
                </tbody>
            </Table>
        </div>
    );
};

