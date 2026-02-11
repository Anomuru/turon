import React, {useEffect, useMemo, useState} from 'react';



import cls from "./filteredLeadsList.module.sass"
import {Table} from "shared/ui/table";
import {Pagination} from "features/pagination";
import {useDispatch, useSelector} from "react-redux";
import {fetchFilteredListData} from "entities/filteredLeadsList/model/filteredLeadsListThunk";
import {
    getFilteredLeadsListCount,
    getFilteredLeadsListData
} from "entities/filteredLeadsList/model/filteredLeadsListSelector";
import {getBranch} from "features/branchSwitcher";

export const FilteredLeadsList = ({dateFrom , dateTo}) => {


    const dispatch = useDispatch()
    const branch = localStorage.getItem("branchId")
    const [currentPage, setCurrentPage] = useState(1);

    let PageSize = useMemo(() => 50, []);


    useEffect(()=> {
        if (dateFrom && dateTo && branch) {
            dispatch(fetchFilteredListData({dateTo , dateFrom,branch,currentPage,PageSize}))
        }
    },[dateFrom,branch,currentPage,PageSize , dateTo])


    const data = useSelector(getFilteredLeadsListData)
    const count = useSelector(getFilteredLeadsListCount)







    return (
        <div className={cls.list}>
            <h1 className={cls.count}>{count}</h1>
            <Table>
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Ism</th>
                        <th>Familya</th>
                        <th>Nomer</th>
                    </tr>
                </thead>
                <tbody>
                {
                    data?.map((item, index) => (
                        <tr key={index + 1}>
                            <td>{index + 1}</td>
                            <td>{item?.name}</td>
                            <td>{item?.surname}</td>
                            <td>{item?.phone}</td>
                        </tr>
                    ))
                }
                </tbody>
            </Table>


            <Pagination
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                pageSize={PageSize}
                onPageChange={page => {
                    setCurrentPage(page)
                }}
                type={"custom"}
                totalCount={count}
            />
        </div>
    );
};

