import {Table} from "../../../../shared/ui/table";

export const PaymentTable = ({classes, extraClass, extraClassTable , format}) => {

    const renderTable = () => {

        return classes?.class?.map((item, i) => (
            <>
                {item.students.length >= 1 ? <h2 className={extraClass}>{item.class_number} {item.class_color}</h2> : null}

                {item?.students.map((itemIn, i) => (

                    <tbody>
                    <tr>
                        <td>{i + 1}</td>
                        <td>{itemIn.name} {itemIn.surname}</td>
                        <td>{itemIn.phone}</td>
                        <td>{format(itemIn.total_debt)}</td>
                        <td>-{format(itemIn.remaining_debt)}</td>
                        <td>{format(itemIn.total_dis)}</td>
                        <td>{format(itemIn.total_discount)}</td>
                        <td>{format(itemIn.cash)}</td>
                        <td>{format(itemIn.bank)}</td>
                        <td>{format(itemIn.click)}</td>
                    </tr>
                    </tbody>

                ))}

            </>
        ))
    }
    const render = renderTable()
    return (
        <div className={extraClassTable}>
            <Table>
                <thead>
                <tr>
                    <th>No</th>
                    <th>Ism Familiya</th>
                    <th>Tel raqami</th>
                    <th>Oylik qarz</th>
                    <th>Qolgan qarz</th>
                    <th>Chegirma (1-yillik)</th>
                    <th>Chegirma (1-martalik)</th>
                    <th>Cash</th>
                    <th>Bank</th>
                    <th>Click</th>
                </tr>
                </thead>
                {render}
            </Table>
        </div>
    );
};

