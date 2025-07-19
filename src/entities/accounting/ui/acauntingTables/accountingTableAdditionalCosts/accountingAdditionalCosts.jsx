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
                                              onChange, loading
                                          }) => {
    const search = useSelector(getSearchValue)
    let PageSize = useMemo(() => 50, [])
    const [currentTableData, setCurrentTableData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);

    const searchedUsers = useMemo(() => {
        const filteredHeroes = additionalCosts?.slice()
        setCurrentPage(1)


        if (!search) return filteredHeroes

        return filteredHeroes.filter(item =>
            item.name?.toLowerCase().includes(search.toLowerCase())
        )
    }, [additionalCosts, setCurrentPage, search])


    const renderOverHeadList = () => {
        return currentTableData?.map((item, i) => (
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
                <Table>
                    <thead>
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
                    { render}
                    </tbody>
                </Table>
            </div>

            <Modal active={changePayment} setActive={setChangePayment}>

                <h2>To'lov turini uzgartirish</h2>
                <div className={cls.changeType}>
                    <Select options={getCapitalType} onChangeOption={onChange}/>
                    {/*<Button onClick={onChange}>Tastiqlash</Button>*/}
                </div>
            </Modal>
            <Pagination
                setCurrentTableData={setCurrentTableData}
                users={searchedUsers}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                pageSize={PageSize}
                onPageChange={page => {
                    setCurrentPage(page)
                }}
                type={"custom"}
            />
        </>
    );
};

