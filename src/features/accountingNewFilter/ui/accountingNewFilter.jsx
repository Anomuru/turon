import cls from "./accountingNew.module.sass"
import {Input} from "shared/ui/input/index.js";
import {SearchInput} from "shared/ui/searchInput/index.js";
import {Button} from "shared/ui/button/index.js";
import React, {useEffect, useState} from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import {useDispatch, useSelector} from "react-redux";
import {fetchAccountingData} from "entities/accountingPageNew/model/accountingNewThunk.js";
import {Modal} from "shared/ui/modal/index.js";
import {Form} from "shared/ui/form/index.js";
import {Radio} from "shared/ui/radio/index.js";
import {Select} from "shared/ui/select/index.js";
import {getCapitalTypes} from "entities/capital/index.js";
import {set, useForm} from "react-hook-form";
import {getPaymentType} from "entities/capital/model/thunk/capitalThunk.js";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice.js";
import {onAddCapital} from "entities/accounting/model/slice/capital.js";
import {onAddData} from "entities/accountingPageNew/model/accountingNewSlice.js";
import {getOverHeadType} from "entities/accounting/index.js";
import {getOverheadType} from "entities/accounting/model/thunk/additionalCosts.js";
import {onAddOverhead} from "entities/accounting/model/slice/additionalCosts.js";
import {getSelectedLocations} from "features/locations/index.js";

const paymentType = [
    {id: 1, name: "cash"},
    {id: 2, name: "click"},
    {id: 3, name: "bank"},
]

const payments = [
    {id: 1, name: "Nuraulet Jorabekov", amount: 2700000, date: "2025-10-09", paymentType: "Click", status: "completed"},
    {id: 2, name: "Mironshox Aytach", amount: 1980000, date: "2025-09-15", paymentType: "Click", status: "completed"},
    {id: 3, name: "Iymona Mirxasilova", amount: 1300000, date: "2025-09-15", paymentType: "Click", status: "completed"},
    {id: 4, name: "Ramziddin Mirzayev", amount: 3000000, date: "2025-09-12", paymentType: "Click", status: "completed"},
];

export const AccountingNewFilter = ({selectType, activeFilter, setActiveFilter, currentPage, pageSize}) => {


    const [range, setRange] = useState([0, 10000000]);
    const [selectedPayment, setSelectedPayment] = useState([])
    const [from, setFrom] = useState(null)
    const [to, setTo] = useState(null)
    const branchId = localStorage.getItem("branchId")
    const selectedBranch = useSelector(getSelectedLocations);
    const branchForFilter = selectedBranch?.id;
    const [active, setActive] = useState("")
    const paymentTypes = useSelector(getCapitalTypes)
    const {register, handleSubmit, setValue} = useForm()
    const [radio, setRadio] = useState({})
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const overHeadType = useSelector(getOverHeadType)
    const [select, setSelect] = useState({})
    const [selectOverheadType, setSelectOverheadType] = useState()

    useEffect(() => {
        if (overHeadType) {
            setSelectOverheadType("all")
        }
    }, [overHeadType])

    const [search, setSearch] = useState("")

    const fromToAmount = {
        from: range[0],
        to: range[1],
    }
    const onChange = (value) => {
        setSelect(value)
        //
        const {id} = value
        //
        if (overHeadType.filter(item => item.id === +id)[0]?.name === "Boshqa") {
            setShowAdditionalFields(true)

        } else {
            setShowAdditionalFields(false)
        }
    }

    const {request} = useHttp()
    const dispatch = useDispatch()

    useEffect(() => {

        dispatch(fetchAccountingData({
            branchId: branchForFilter,
            pageSize,
            currentPage,
            selectedPayment,
            selectType,
            range,
            from,
            to,
            search,
            selectOverheadType
        }))

    }, [currentPage, selectedPayment, selectType, from, to, range, search, selectOverheadType, branchForFilter])

    useEffect(() => {
        dispatch(getOverheadType())
        dispatch(getPaymentType())
    }, [])

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
        if (range[0] !== 0 || range[1] !== 10000000) count++;

        return count;
    };

    const onAdd = (data) => {

        const res = {
            branch: branchId,
            payment_type: radio.id,

            ...data
        }

        request(`${API_URL}Capital/old_capital_create/`, "POST", JSON.stringify(res), headers())
            .then(res => {

                setActive("")
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: res.msg
                }))
                // const data = {
                //     ...res,
                //     payment_type: res.payment.name
                // }
                //
                dispatch(onAddData(res))
                setValue("name", "")
                setValue("added_date", "")
                setRadio({})
                setValue("price", "")
            })
            .catch(err => {
                console.log(err)

            })
    }
    const onAddOverhead = (data) => {
        const res = {
            type: select.id,
            branch: branchId,
            payment: radio.id,
            ...data
        }

        request(`${API_URL}Overhead/overheads/create/`, "POST", JSON.stringify(res), headers())
            .then(res => {
                setActive("")
                setValue("name", "")
                setValue("price", "")
                setValue("created", "")


                dispatch(onAddData(res))

                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: res.msg
                }))

            })
            .catch(err => {
                console.log(err)
            })

    }


    return (
        <div className={cls.accounting}>
            <div className={cls.accounting__header}>
                <SearchInput search={search} setSearch={setSearch} extraClass={cls.accounting__search}/>
                <div style={{display: "flex ", gap: "1rem", alignItems: "center"}}>
                    <Button onClick={() => setActiveFilter(!activeFilter)} type={'filter'} status={"filter"}>
                        Qo'shimcha filter {activeFiltersCount() > 0 && <span>({activeFiltersCount()})</span>}
                    </Button>
                    {selectType === "capital" || selectType === "overhead" ?
                        <>
                            { selectType === "overhead" && overHeadType &&
                                <Select onChangeOption={setSelectOverheadType} defaultValue={selectOverheadType}
                                        options={[{name: "Hammasi", id: "all"}, ...overHeadType]}/>}
                            <Button onClick={() => setActive(selectType)}> Qo'shish</Button>

                        </> : ""}
                </div>
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
                        max={10000000}
                        step={1000}
                        value={range} // <-- controlled
                        onChange={setRange}
                        trackStyle={[{backgroundColor: "purple"}]}
                        handleStyle={[
                            {borderColor: "purple"},
                            {borderColor: "purple"}
                        ]}
                        style={{width: "26rem"}}
                    />
                    <div className={cls.accounting__filter_amount_number}>
                        <span>{formatSalary(range[0])}</span>
                        <span>{formatSalary(range[1])}</span>
                    </div>

                </div>

            </div>
            }

            <Modal setActive={setActive} active={active === "capital"}>
                <div className={cls.modal}>
                    <Form onSubmit={handleSubmit(onAdd)}>
                        <Input register={register} name={"added_date"} type={"date"}/>
                        <Input register={register} name={"name"}/>
                        <Input register={register} name={"price"} type={"number"}/>
                        <div style={{display: "flex", gap: "2rem", justifyContent: 'center', marginBottom: "2rem"}}>
                            {paymentTypes?.map(item => (
                                <Radio
                                    onChange={() => setRadio({
                                        name: item.name,
                                        id: item.id
                                    })}
                                    children={item.name}
                                    checked={radio?.name === item.name}
                                    value={radio === item.name}

                                />
                            ))}
                        </div>


                        {/*<Select title={"Oy"} options={monthDay} onChangeOption={setMonth}/>*/}
                        {/*<Select title={"sana"} options={monthDay?.filter(item => item?.value === month)[0]?.days}*/}
                        {/*        onChangeOption={setDay}/>*/}
                    </Form>
                </div>
            </Modal>


            <Modal setActive={setActive} active={active === "overhead"}>

                <Form extraClassname={cls.form} onSubmit={handleSubmit(onAddOverhead)}>
                    <Input register={register} name={"created"} type={"date"} title={"Kun"}/>
                    <Select defaultValue={selectOverheadType} options={overHeadType}
                        // defaultValue={select}
                            onChangeOption={(e) => {
                                onChange({
                                    name: e,
                                    id: e
                                })
                            }}
                    />
                    {showAdditionalFields ?
                        <Input name={"name"} register={register} placeholder={"Narsa turi"}/> : null}

                    <Input register={register} name={"price"} type={"number"} placeholder={"Narxi"}/>

                    <div style={{display: "flex", justifyContent: "center", gap: "2rem"}}>
                        {paymentTypes?.map(item => (
                            <Radio
                                onChange={() => setRadio({
                                    name: item.name,
                                    id: item.id
                                })}
                                children={item.name}
                                checked={radio?.name === item.name}
                                value={radio === item.name}

                            />
                        ))}
                    </div>


                </Form>
            </Modal>


        </div>


    );
};
