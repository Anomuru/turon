import {AccountingPageNewHeader, AccountingPageNewTable} from "entities/accountingPageNew/index.js";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {accountingNewReducer} from "entities/accountingPageNew/model/accountingNewSlice.js";
import React, {useMemo, useState} from "react";
import cls from "src/pages/accountingPage2.0/ui/accountingPage2.0.module.sass"
import {AccountingNewFilter} from "features/accountingNewFilter/index.js";
import {Pagination} from "features/pagination/index.js";
import {useSelector} from "react-redux";
import {
    getAccountingNewPageLoading,
    getAccountingNewPageTotalData
} from "entities/accountingPageNew/model/accountingNewSelector.js";
import {capitalReducer} from "entities/capital/index.js";
import {overHeadReducer} from "entities/accounting/index.js";

const reducers = {

    accountingNewSlice: accountingNewReducer,
    CapitalSlice: capitalReducer,
    overHeadSlice: overHeadReducer,
}

export const AccountingPageNew = () => {
    const pageTypeLocal = localStorage.getItem("pageType");
    const [selectType , setSelectType] = useState(pageTypeLocal)



    const [activeFilter, setActiveFilter] = useState(false)
    let PageSize = useMemo(() => 50, [])
    const [currentPage, setCurrentPage] = useState(1);

    const data  = useSelector(getAccountingNewPageTotalData)


    return (
       <DynamicModuleLoader reducers={reducers}>
           <div className={cls.accounting}>
               <AccountingPageNewHeader setSelectType={setSelectType} selectType={selectType}/>
                <AccountingNewFilter setCurrentPage={setCurrentPage} pageSize={PageSize} currentPage={currentPage} selectType={selectType} setActiveFilter={setActiveFilter} activeFilter={activeFilter}/>
               <AccountingPageNewTable selectType={selectType} data={data} activeFilter={activeFilter}/>
               <Pagination
                   className={cls.pagination}
                   setCurrentPage={setCurrentPage}
                   currentPage={currentPage}
                   pageSize={PageSize}
                   onPageChange={page => {
                       setCurrentPage(page)
                   }}
                   type={"custom"}
                   totalCount={data?.count}
               />
           </div>

       </DynamicModuleLoader>
    );
};

