import {getAllSelector} from "entities/accounting/index.js";
import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {loginReducer} from "pages/loginPage/index.js";
import {useCallback, useEffect, useState} from "react";

import {Table} from "shared/ui/table";
import {Select} from "shared/ui/select";
import {value} from "lodash/seq";
import {getAll} from "../../model/thunk/otchotAccountingThunk";
import {useDispatch, useSelector} from "react-redux";
import {getBranch} from "../../../../features/branchSwitcher";
import {useHttp, API_URL, headers} from "../../../../shared/api/base";
import {getFilteredAll} from "../../model/slice/otchotAccountingSlice";
import cls from "./allTable.module.sass";
import classNames from "classnames";


const types = [
    {
        name: "O'quvchilar",
        value: "student"
    },
    {
        name: "O'qituvchilar",
        value: "teacher"
    },
    {
        name: "Qo'shimcha harajatlar ",
        value: "overhead"
    },
    {
        name: "Capital",
        value: "capital"
    },
    {
        name: "Umumiy foyda",
        value: "total"
    },
]

function capitalizeFirstLetter(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const AllTable = () => {


    const {request} = useHttp()
    const dispatch = useDispatch()
    const branchId = useSelector(getUserBranchId)
    const allTable = useSelector(getAllSelector)

    // const option = allTable?.payment_results?.map(item => ({
    //     name: item.payment_type
    // }))
    const [activeType, setActiveType] = useState("students")
    const [selectedYear, setSelectedYear] = useState(null)
    const [selectedMonth, setSelectedMonth] = useState(null)
    // const renderPayment = () => {
    //     switch (selected) {
    //         // case "cash" :
    //         //     return <h1>hello</h1>
    //         //
    //         case "click" :
    //             return <TableClick alltable={allTable}/>
    //         case "bank" :
    //             return <TableBank alltable={allTable}/>
    //         default:
    //             return <TableCash alltable={allTable}/>
    //     }
    // }

    const renderTypeData = () => {


        if (!activeType && !allTable?.summary) return;

        return <TableCash
            resultData={allTable?.payment_results}
            data={allTable?.summary?.[activeType]}
            activeType={activeType}
        />
    }

    useEffect(() => {
        if (branchId) {
            if (selectedMonth && selectedYear) {
                const res = {
                    year: selectedYear,
                    month: selectedMonth
                }
                request(`${API_URL}Encashment/encashment_school/`, "POST", JSON.stringify({branch: branchId, ...res}), headers())
                    .then(res => {
                        dispatch(getFilteredAll(res))
                    })
            }
        }
    }, [branchId, selectedYear, selectedMonth])


    const onChangeYear = (year) => {


        setSelectedYear(year)
        setSelectedMonth(null)
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem"
            }}
        >
            <div
                style={{
                    display: "flex",
                    gap: "2rem"
                }}
            >
                <Select
                    options={allTable?.dates?.map(item => ({
                        name: item?.year,
                        id: item?.year,
                    }))}
                    onChangeOption={onChangeYear}
                    defaultValue={allTable && allTable?.dates?.map(item => ({
                        name: item?.year,
                        id: item?.year,
                    }))[0]?.id}
                />
                {selectedYear && <Select
                    options={
                        allTable?.dates
                            ?.filter(item => item.year === +selectedYear)[0]?.months
                    }
                    onChangeOption={setSelectedMonth}
                    defaultValue={allTable && allTable?.dates
                        ?.filter(item => item.year === +selectedYear)[0]?.months[0]}
                />}
            </div>

            <div className={cls.header}>
                {/*{*/}
                {/*    types.map(item => (*/}
                {/*        <div*/}
                {/*            className={classNames(cls.header__item, {*/}
                {/*                [cls.active]: item.value === activeType*/}
                {/*            })}*/}
                {/*            onClick={() => setActiveType(item.value)}*/}
                {/*            key={item.value}*/}
                {/*        >*/}
                {/*            {item.name}*/}
                {/*        </div>*/}
                {/*    ))*/}
                {/*}*/}
                {
                    allTable?.payment_results && Object.keys(allTable?.payment_results[0]).map(item => {
                        if (item === "payment_total" || item === "payment_type") return null
                        return (
                            <div
                                className={classNames(cls.header__item, {
                                    [cls.active]: item === activeType
                                })}
                                onClick={() => setActiveType(item)}
                                key={item}
                            >
                                {item === "user" ? "Worker" : capitalizeFirstLetter(item)}
                            </div>
                        )
                    })
                }
            </div>
            {renderTypeData()}
            {/*{renderPayment()}*/}
        </div>
    );
};


const TableCash = ({data, resultData, activeType}) => {


    const [typeData, setTypeData] = useState(null)
    // const [typeData,setTypeData] = useState(null)


    useEffect(() => {

        if (!data) return;

        if (Array.isArray(data)) {
            setTypeData("array")
        } else {
            setTypeData("object")
        }

    }, [data])


    const renderDataTypes = useCallback((arr) => {

        if (!arr.length > 0) return;


        return arr.map((item, index) => {

            const keys = Object.keys(item)


            return (
                <div key={index} className={cls.paymentTypes__item}>
                    <h3>{item[keys[0]]}</h3>
                    <p>{item[keys[1].toLowerCase()]}</p>
                </div>
            )
        })


    }, [])


    const renderDataTypesObject = useCallback(() => {
        if (!data && !typeData) return;


        return Object.entries(data).map((item, index) => {

            if (Array.isArray(item[1])) {


                return item[1].map((item, index) => {


                    const keys = Object.keys(item)


                    return (
                        <div key={index} className={cls.paymentTypes__item}>
                            <h3>{item[keys[0]]}</h3>
                            <p>{item[keys[1].toLowerCase()]}</p>
                        </div>
                    )
                })
            }
        })


    }, [data, typeData])


    return (
        <>

            <div className={cls.paymentTypes}>
                {/*{*/}
                {/*    typeData === "array" ?*/}
                {/*        renderDataTypes(data)*/}
                {/*        : null*/}
                {/*}*/}

                {/*{renderDataTypesObject()}*/}
                <div className={cls.paymentTypes__header}>
                    {
                        resultData?.map((item, index) => {
                            return (
                                <div key={index} className={cls.paymentTypes__item}>
                                    <h3>{item?.payment_type}</h3>
                                    <p>{item?.payment_total}</p>
                                </div>
                            )
                        })
                    }
                </div>

                {
                    resultData && [...resultData]?.map((item, index) => {
                        return (
                            <div className={cls.paymentTypes__container}>
                                <div key={index} className={cls.paymentTypes__item}>
                                    <h3>{item?.payment_type}</h3>
                                    {/*<p>{item?.payment_total}</p>*/}
                                </div>
                                <div className={cls.list__container}>
                                    {
                                        Object.keys(item?.[activeType])?.map(inn => {
                                            return (
                                                <div className={cls.otchot}>
                                                    {capitalizeFirstLetter(inn.replaceAll("_", " "))}
                                                    <br/>
                                                    <span className={cls.otchot__inner}>{item?.[activeType]?.[inn]}</span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }

            </div>

            {
                // resultData?.map(item => {
                //     return (
                //         <div className={cls.list}>
                //             <div className={cls.list__container}>
                //                 <div className={cls.otchot}>
                //                     Qolgan qarz <br/> {data?.remaining_debt}
                //                 </div>
                //                 <div className={cls.otchot}>
                //                     Umumiy qarz <br/> {data?.total_debt}
                //                 </div>
                //             </div>
                //         </div>
                //     )
                // })
                // activeType === "student" ?
                //     <div className={cls.list}>
                //         <div className={cls.list__container}>
                //
                //             <div className={cls.otchot}>
                //                 Qolgan qarz <br/> {data?.remaining_debt}
                //             </div>
                //             <div className={cls.otchot}>
                //                 Umumiy qarz <br/> {data?.total_debt}
                //             </div>
                //         </div>
                //     </div>
                //     :
                //     <div className={cls.list}>
                //         <div className={cls.list__container}>
                //             <div className={cls.otchot}>
                //                 Umumiy oylik <br/> {data?.total_salary}
                //             </div>
                //             <div className={cls.otchot}>
                //                 Qolgan oylik <br/> {data?.remaining_salary}
                //             </div>
                //             {/*<div className={cls.otchot}>*/}
                //             {/*    To'langan oylik <br/> {allTable[0]?.teachers?.taken}*/}
                //             {/*</div>*/}
                //         </div>
                //     </div>
            }


            {/*<div className={cls.list}>*/}
            {/*    <h2 className={cls.list__title}>Ishchilar</h2>*/}
            {/*    <div className={cls.list__container}>*/}
            {/*        <div className={cls.otchot}>*/}
            {/*            Umumiy oylik <br/> {allTable[0]?.workers?.total_salary}*/}
            {/*        </div>*/}
            {/*        <div className={cls.otchot}>*/}
            {/*            Qolgan oylik <br/> {allTable[0]?.workers?.remaining_salary}*/}
            {/*        </div>*/}
            {/*        <div className={cls.otchot}>*/}
            {/*            To'langan oylik <br/> {allTable[0]?.workers?.taken}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*<div className={cls.list}>*/}
            {/*    <h2 className={cls.list__title}>Qo'shimcha to'lovlar</h2>*/}
            {/*    <div className={cls.list__container}>*/}
            {/*        {*/}
            {/*            Object.entries(allTable[0]?.overheads).map(([key, value]) => (*/}
            {/*                <div className={cls.otchot}>*/}
            {/*                    {*/}
            {/*                        key?.includes("total") ?*/}
            {/*                            "Umumiy to'lovlar" :*/}
            {/*                        key?.replace('_', " ")*/}
            {/*                    } <br/> {value}*/}
            {/*                </div>*/}
            {/*            ))*/}
            {/*        }*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*<div className={cls.list}>*/}
            {/*    <h2 className={cls.list__title}>Kapital</h2>*/}
            {/*    <div className={cls.list__container}>*/}
            {/*        <div className={cls.otchot}>*/}
            {/*            /!*Kapital <br/> *!/*/}
            {/*            {allTable[0]?.capitals?.total_capital}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*<div className={cls.list}>*/}
            {/*    <h2 className={cls.list__title}>Umumiy foyda</h2>*/}
            {/*    <div className={cls.list__container}>*/}
            {/*        <div className={cls.otchot}>*/}
            {/*            {allTable[0]?.payment_total}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </>
    )
}




