import {Table} from "../../../../../shared/ui/table";
import React, {useMemo, useState} from "react";
import {Pagination} from "../../../../../features/pagination";
import {useSelector} from "react-redux";
import {getSearchValue} from "../../../../../features/searchInput";
import {getOverHeadDeletedCount} from "entities/accounting/index.js";

export const AdditionalCostsDeleted = ({overheadDeletedList , extraClassName , paymentStyle}) => {

    const search = useSelector(getSearchValue)
    const totalCount = useSelector(getOverHeadDeletedCount)
    let PageSize = useMemo(() => 50, [])
    const [currentTableData, setCurrentTableData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);

    const searchedUsers = useMemo(() => {
        const filteredHeroes = overheadDeletedList?.slice()
        setCurrentPage(1)


        if (!search) return filteredHeroes

        return filteredHeroes.filter(item =>
            item.name?.toLowerCase().includes(search.toLowerCase())
        )
    }, [overheadDeletedList, setCurrentPage, search])

    const renderDeleted = () => {
        return searchedUsers?.map((item, i) => (
            <tr>
                <td>{i + 1}</td>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.created}</td>
                <td><div className={paymentStyle}>{item.payment}</div></td>
            </tr>
        ))
    }

    const render = renderDeleted()
    return (
        <>
            <div className={extraClassName}>
                <Table>
                    <thead>
                    <tr>
                        <th/>
                        <th>Nomi</th>
                        <th>Narxi</th>
                        <th>Sana</th>
                        <th>To'lov turi</th>
                    </tr>
                    </thead>
                    <tbody>{render}</tbody>
                </Table>
            </div>
            <Pagination
                totalCount={totalCount}
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

