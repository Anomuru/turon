import cls from "./accountingPageNewHeader.module.sass"
import {useSelector} from "react-redux";
import {
     getAccountingNewPageTotalCount,
    getAccountingNewPageType,
} from "entities/accountingPageNew/model/accountingNewSelector.js";
import {Select} from "shared/ui/select/index.js";
import React, {useEffect} from "react";
import {Link} from "shared/ui/link/index.js";
import {Button} from "shared/ui/button/index.js";

export const AccountingPageNewHeader = ({selectType , setSelectType}) => {

    const pageType = useSelector(getAccountingNewPageType)

    const totalCount = useSelector(getAccountingNewPageTotalCount)

    localStorage.setItem("pageType", selectType);


    useEffect(() => {
        if (pageType) {
            setSelectType(selectType)
        }
    } , [pageType])

    const renderType = () => {
        switch (selectType) {
            case "studentPayments":
                return "O'quvchilar tolovlari"
            case "teacherSalary":
                return "O'qituvchilar oyligi"
            case "employeesSalary":
                return "Ishchilar oyligi"
            case "overhead":
                return "Qo'shimcha xarajatlar"
            case "capital":
                return "Kapital xarajatlari"
            default:
                return "O'quvchilar tolovlari"
        }
    }
    const renderIcon = (icon) => {
        switch (icon) {
            case "amount":
                return <i className="fa-solid fa-chart-line"></i>
            case "click":
                return <i className="fa-solid fa-money-check-dollar"></i>
            case "bank":
                return <i className="fa-solid fa-building-columns"></i>
            case "cash":
                return <i className="fa-solid fa-money-bill"></i>
        }
    }
    const formatSalary = (salary) => {
        return Number(salary).toLocaleString();
    };


    return (
        <div className={cls.accounting}>
            <div className={cls.accounting__header}>
                <h1>
                    {renderType()}
                </h1>
                <div className={cls.accounting__header_btns}>
                    <Link to={`../inkasatsiya/studentsPayments`}>
                        <Button>
                            Inkasatsiya
                            {/*Harajatlar to’plami*/}
                        </Button></Link>
                    <Link to={`otchot`}>
                        <Button onClick={() => setOtchot(!otchot)} type={"filter"}>
                            buxgalteriya
                        </Button>
                    </Link>

                    <Select defaultValue={selectType} onChangeOption={setSelectType} options={pageType}/>
                </div>
            </div>

            <div className={cls.accounting__container}>
                {totalCount?.map(item => (
                    <div className={cls.accounting__container_box}>
                       <div className={cls.accounting__container_box_header}>

                               {item?.name}


                           <span> {renderIcon(item?.type)}</span>

                       </div>
                        <div className={cls.accounting__container_box_bottom}>
                            <div className={cls.accounting__container_box_bottom_amount}>
                                <h2>{formatSalary(item?.totalPayment)}</h2>
                            </div>
                            <div className={cls.accounting__container_box_bottom_count}>
                                <h3>{item?.totalPaymentCount} payments</h3>
                            </div>
                        </div>

                    </div>
                ))}

            </div>



        </div>
    );
};

