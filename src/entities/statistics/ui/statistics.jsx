import cls from "./statistics.module.sass"
import {useRef, useState} from "react";

export const Statistics = ({data}) => {
    return (
        <div className={cls.container}>
            {data?.new_students?.data?.length > 0 && (<New_students data={data.new_students}/>)}
            {data?.new_studying_students?.data?.length > 0 && (
                <New_studying_students data={data.new_studying_students}/>)}
            {data?.student_payments?.data?.length > 0 && (<Student_payments data={data.student_payments}/>)}
            {data?.teacher_salaries?.data?.length > 0 && (<Teacher_salaries data={data.teacher_salaries}/>)}
            {data?.user_salaries?.data?.length > 0 && (<User_salaries data={data.user_salaries}/>)}
            {data?.new_groups?.data?.length > 0 && (<New_groups data={data.new_groups}/>)}
            {data?.new_leads?.data?.length > 0 && (<New_leads data={data.new_leads}/>)}
            {data?.overhead_payments?.data?.length > 0 && (<Overhead_payments data={data.overhead_payments}/>)}

        </div>
    )
}

const New_groups = ({data}) => {

    return (
        <AccordionWrapper title="Yangi guruhlar" count={data?.count}>
            <table className={cls.table}>
                <thead>
                <tr>
                    <th style={{width: "4rem"}}>No</th>
                    <th>Nomi</th>
                    <th>Summa</th>
                </tr>
                </thead>
                <tbody>
                {data.data.map((item, i) => (
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{item.name || "—"}</td>
                        <td>{item.price ?? "—"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </AccordionWrapper>
    );
};




const New_leads = ({data}) => (
    <AccordionWrapper title="Yangi leadlar" count={data?.count}>
        <table className={cls.table}>
            <thead>
            <tr>
                <th style={{width: "4rem"}}>No</th>
                <th>Ism</th>
                <th>Familya</th>
                <th>Telefon nomer</th>
            </tr>
            </thead>
            <tbody>
            {data.data.map((item, i) => (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.surname}</td>
                    <td>{item.phone}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </AccordionWrapper>
);

const New_students = ({data}) => (
    <AccordionWrapper title="Yangi o'quvchilar" count={data?.count}>
        <table className={cls.table}>
            <thead>
            <tr>
                <th style={{width: "4rem"}}>No</th>
                <th>Ism</th>
                <th>Familya</th>
            </tr>
            </thead>
            <tbody>
            {data.data.map((item, i) => (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.surname}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </AccordionWrapper>
);

const New_studying_students = ({data}) => (
    <AccordionWrapper title="Yangi guruhga qo'shilgan o'quvchilar" count={data?.count}>
        <table className={cls.table}>
            <thead>
            <tr>
                <th style={{width: "4rem"}}>No</th>
                <th>Ism</th>
                <th>Familya</th>
            </tr>
            </thead>
            <tbody>
            {data.data.map((item, i) => (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.surname}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </AccordionWrapper>
);

const Overhead_payments = ({data}) => (
    <AccordionWrapper title="Overhead Payments" count={data?.count}>
        <table className={cls.table}>
            <thead>
            <tr>
                <th style={{width: "4rem"}}>No</th>
                <th>Nomi</th>
                <th>Summa</th>
                <th>To'lov turi</th>
            </tr>
            </thead>
            <tbody>
            {data.data.map((item, i) => (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item.name} {item.surname}</td>
                    <td>{item.payment_sum}</td>
                    <td>{item.payment}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </AccordionWrapper>
);

const Student_payments = ({data}) => (
    <AccordionWrapper title="O'quvchi to'lovlari" count={data?.count}>
        <table className={cls.table}>
            <thead>
            <tr>
                <th style={{width: "4rem"}}>No</th>
                <th>Ism Familya</th>
                <th>Summa</th>
                <th>To'lov turi</th>
            </tr>
            </thead>
            <tbody>
            {data.data.map((item, i) => (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item.name} {item.surname}</td>
                    <td>{item.payment_sum}</td>
                    <td>{item.payment}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </AccordionWrapper>
);

const Teacher_salaries = ({data}) => (
    <AccordionWrapper title="O'qituvchilar oyliklari" count={data?.count}>
        <table className={cls.table}>
            <thead>
            <tr>
                <th style={{width: "4rem"}}>No</th>
                <th>Ism Familya</th>
                <th>Oylik</th>
                <th>To'lov turi</th>
                <th>Izoh</th>
            </tr>
            </thead>
            <tbody>
            {data.data.map((item, i) => (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item.name} {item.surname}</td>
                    <td>{item.salary}</td>
                    <td>{item.payment}</td>
                    <td>{item.comment}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </AccordionWrapper>
);

const User_salaries = ({data}) => (
    <AccordionWrapper title="Ishchilar oyliklari" count={data?.count}>
        <table className={cls.table}>
            <thead>
            <tr>
                <th style={{width: "4rem"}}>No</th>
                <th>Ism Familya</th>
                <th>Oylik</th>
                <th>To'lov turi</th>
                <th>Izoh</th>
            </tr>
            </thead>
            <tbody>
            {data.data.map((item, i) => (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item.name} {item.surname}</td>
                    <td>{item.salary}</td>
                    <td>{item.payment}</td>
                    <td>{item.comment}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </AccordionWrapper>
);




const AccordionWrapper = ({title, count, children}) => {
    const [open, setOpen] = useState(false);
    const contentRef = useRef(null);

    return (
        <div className={cls.container__wrapper}>
            <h2
                className={cls.header}
                onClick={() => setOpen(prev => !prev)}
                style={{cursor: "pointer"}}
            >
                {title} {count}
                <div>
                    <i className={`fa fa-angle-${open ? "up" : "down"}`}/>
                </div>
            </h2>

            <div
                ref={contentRef}
                className={`${cls.table__wrapper} ${open ? cls.open : ""}`}
                style={{
                    maxHeight: open ? "25rem" : "0px",

                    transition: "max-height 0.4s ease",
                }}
            >
                {children}
            </div>
        </div>
    )
}