import cls from "./accountingNew.module.sass"
import {Input} from "shared/ui/input/index.js";
import {SearchInput} from "shared/ui/searchInput/index.js";
import {Button} from "shared/ui/button/index.js";
import {useEffect, useState} from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const paymentType = [
    {id: 1, name: "cash"},
    {id: 2, name: "click"},
    {id: 3, name: "bank"},
]


const payments = [
    { id: 1, name: "Nuraulet Jorabekov", amount: 2700000, date: "2025-10-09", paymentType: "Click", status: "completed" },
    { id: 2, name: "Mironshox Aytach", amount: 1980000, date: "2025-09-15", paymentType: "Click", status: "completed" },
    { id: 3, name: "Iymona Mirxasilova", amount: 1300000, date: "2025-09-15", paymentType: "Click", status: "completed" },
    { id: 4, name: "Ramziddin Mirzayev", amount: 3000000, date: "2025-09-12", paymentType: "Click", status: "completed" },
];

export const AccountingNewFilter = ({selectType}) => {


    const [activeFilter, setActiveFilter] = useState(false)


    const [range, setRange] = useState([0, 500000000]);
    const [selectedPayment, setSelectedPayment] = useState([])
    const [from, setFrom] = useState(null)
    const [to, setTo] = useState(null)


    const fromToAmount = {
        from: range[0],
        to: range[1],
    }


    console.log(selectedPayment, selectType, fromToAmount, from, to)

    const formatSalary = (value) => {
        return value
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            .concat(" so'm");
    };
    const activeFiltersCount = () => {
        let count = 0;

        // payment type tanlansa
        if (selectedPayment.length > 0) count++;

        // sana tanlansa
        if (from && to) count++;

        // pul oralig'i defaultdan farq qilsa
        if (range[0] !== 0 || range[1] !== 500000000) count++;

        return count;
    };


    return (
        <div className={cls.accounting}>
            <div className={cls.accounting__header}>
                <SearchInput extraClass={cls.accounting__search}/>
                <Button onClick={() => setActiveFilter(!activeFilter)} type={'filter'} status={"filter"}>
                    Qo'shimcha filter {activeFiltersCount() > 0 && <span>({activeFiltersCount()})</span>}
                </Button>
            </div>

            {activeFilter && <div className={cls.accounting__filter}>
                <div className={cls.accounting__filter_payment}>
                    <h2>To'lov turlari</h2>
                    {paymentType.map(item => (
                        <div className={cls.accounting__filter_payment_item}>
                            <Input
                                type="checkbox"
                                checked={selectedPayment.includes(item.name)} // <-- controlled
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        if (!selectedPayment.includes(item.name)) {
                                            setSelectedPayment([...selectedPayment, item.name]);
                                        }
                                    } else {
                                        setSelectedPayment(selectedPayment.filter(p => p !== item.name));
                                    }
                                }}
                                extraClassName={cls.accounting__filter_payment_item_input}
                            />
                            {item.name}
                        </div>
                    ))}
                </div>
                <div className={cls.accounting__filter_date}>
                    <h2>
                        Sana bo'yicha filter
                    </h2>

                    <div className={cls.accounting__filter_date_box}>
                        <Input
                            type="date"
                            value={from || ""} // agar null bo‘lsa bo‘sh string
                            onChange={(e) => setFrom(e.target.value)}
                            extraClassName={cls.accounting__filter_date_input}
                        />
                        <Input
                            type="date"
                            value={to || ""}
                            onChange={(e) => setTo(e.target.value)}
                            extraClassName={cls.accounting__filter_date_input}
                        />
                    </div>
                </div>
                <div className={cls.accounting__filter_amount}>
                    <h2>
                        to'lov oralig'i

                    </h2>
                    <Slider
                        range
                        min={0}
                        max={500000000}
                        step={1000}
                        value={range} // <-- controlled
                        onChange={setRange}
                        trackStyle={[{ backgroundColor: "purple" }]}
                        handleStyle={[
                            { borderColor: "purple" },
                            { borderColor: "purple" }
                        ]}
                        style={{ width: "26rem" }}
                    />
                    <div className={cls.accounting__filter_amount_number}>
                        <span>{formatSalary(range[0])}</span>
                        <span>{formatSalary(range[1])}</span>
                    </div>

                </div>

            </div>
            }


        </div>
    );
};
