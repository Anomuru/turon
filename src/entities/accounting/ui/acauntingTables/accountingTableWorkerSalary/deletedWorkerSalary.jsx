import cls from "./empSalary.module.sass";
import React, {useMemo, useState} from "react";
import {Table} from "../../../../../shared/ui/table";
import {useSelector} from "react-redux";
import {getSearchValue} from "../../../../../features/searchInput";
import {Pagination} from "../../../../../features/pagination";

export const DeletedWorkerSalary = ({filteredDeletedSalary, formatSalary, sum2, onChange}) => {

    const search = useSelector(getSearchValue)
    let PageSize = useMemo(() => 50, [])
    const [currentTableData, setCurrentTableData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);

    const searchedUsers = useMemo(() => {
        const filteredHeroes = filteredDeletedSalary?.slice()
        setCurrentPage(1)


        if (!search) return filteredHeroes

        return filteredHeroes.filter(item =>
            item.name?.toLowerCase().includes(search.toLowerCase())
        )
    }, [filteredDeletedSalary, setCurrentPage, search])
    const renderFilteredDeletedSalary = () => {
        return currentTableData?.map((item, i) => (
            <>
                <tbody>
                <tr>
                    <td>{i + 1}</td>
                    <td>{item?.user?.name}</td>
                    <td>{item?.salary}</td>
                    <td>{item?.date}</td>
                    <td>{item?.user?.job?.length ? item?.user?.job : "ish turi mavjud emas"}</td>
                    <td onClick={() => onChange(item.id)}>
                        <div className={cls.cash}>{item?.payment_types?.name}</div>
                    </td>
                </tr>
                </tbody>
            </>
        ))
    }
    return (
        <>
            <div className={cls.empSalary}>
                <Table>
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Ism Familiya</th>
                        <th>Oylik</th>
                        <th>Sana</th>
                        <th>Kasb</th>
                        <th>To'lov turi</th>
                    </tr>
                    </thead>
                    {renderFilteredDeletedSalary()}
                </Table>
            </div>
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

