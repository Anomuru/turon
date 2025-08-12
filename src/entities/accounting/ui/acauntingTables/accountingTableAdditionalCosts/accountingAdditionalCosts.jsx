import {getOverHeadCount, getOverHeadLoading} from "entities/accounting/index.js";
import {loginReducer} from "pages/loginPage/index.js";
import {Table} from "shared/ui/table";
import {Button} from "../../../../../shared/ui/button";
import React, {useMemo, useState} from "react";
import cls from "../accountingTableWorkerSalary/empSalary.module.sass";
import {Modal} from "../../../../../shared/ui/modal";
import {Pagination} from "../../../../../features/pagination";
import {useSelector} from "react-redux";
import {getSearchValue} from "../../../../../features/searchInput";
import {MiniLoader} from "../../../../../shared/ui/miniLoader";
import {Select} from "../../../../../shared/ui/select";
import {DefaultPageLoader} from "shared/ui/defaultLoader";

export const AccountingAdditionalCosts = ({
                                              additionalCosts,
                                              extraclassName,
                                              setActiveDelete,
                                              setChangingData,
                                              formatSalary,
                                              paymentStyle,
                                              setChangePaymentType,
                                              setChangePayment,
                                              changePayment,
                                              getCapitalType,
                                              onChange,
                                              setCurrentPage,
                                              PageSize,
                                              currentPage
                                          }) => {

    const search = useSelector(getSearchValue)
    const loading = useSelector(getOverHeadLoading)
    const totalCount = useSelector(getOverHeadCount)

    const searchedUsers = useMemo(() => {
        const filteredHeroes = additionalCosts?.slice()


        if (!search) return filteredHeroes
        setCurrentPage(1)

        return filteredHeroes.filter(item =>
            item.name?.toLowerCase().includes(search.toLowerCase())
        )
    }, [additionalCosts, setCurrentPage, search])


    const renderOverHeadList = () => {
        return searchedUsers?.map((item, i) => (
            <tr>
                <td>{i + 1}</td>
                <td>{item.name}</td>
                <td>{formatSalary(item.price)}</td>
                <td>{item.created}</td>
                <td>
                    <div
                        onClick={() => {
                            setChangePaymentType(item)
                            setChangePayment(true)
                        }}


                        className={paymentStyle}>{item.payment}</div>
                </td>
                <td>
                    <div>
                        <Button
                            onClick={() => {
                                setActiveDelete(true)
                                setChangingData({
                                    id: item.id,
                                    name: item.name,
                                })
                            }
                            }
                            type={"delete"}
                            children={<i className={"fa fa-times"} style={{color: "white"}}/>}
                        />
                    </div>
                </td>
            </tr>
        ))
    }

    const render = renderOverHeadList()
    return (
        <>

            <div className={extraclassName}>
                {
                    loading
                        ? <DefaultPageLoader/>
                        : <Table>
                            <thead style={{position: "sticky", top: "0"}}>
                            <tr>
                                <th/>
                                <th>Nomi</th>
                                <th>Narxi</th>
                                <th>Sana</th>
                                <th>To'lov turi</th>
                                <th>O'chirish</th>
                            </tr>
                            </thead>
                            <tbody>
                            {render}
                            </tbody>
                        </Table>
                }
            </div>

            <Modal active={changePayment} setActive={setChangePayment}>

                <h2>To'lov turini uzgartirish</h2>
                <div className={cls.changeType}>
                    <Select options={getCapitalType} onChangeOption={onChange}/>
                    {/*<Button onClick={onChange}>Tastiqlash</Button>*/}
                </div>
            </Modal>
            <Pagination
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                pageSize={PageSize}
                onPageChange={page => {
                    setCurrentPage(page)
                }}
                type={"custom"}
                totalCount={totalCount}
            />
        </>
    );
};

