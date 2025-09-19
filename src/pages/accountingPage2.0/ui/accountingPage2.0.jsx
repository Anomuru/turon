import {AccountingPageNewHeader} from "entities/accountingPageNew/index.js";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {accountingNewReducer} from "entities/accountingPageNew/model/accountingNewSlice.js";
import {useState} from "react";
import cls from "src/pages/accountingPage2.0/ui/accountingPage2.0.module.sass"
import {AccountingNewFilter} from "features/accountingNewFilter/index.js";

const reducers = {

    accountingNewSlice: accountingNewReducer
}

export const AccountingPageNew = () => {

    const [selectType , setSelectType] = useState()



    return (
       <DynamicModuleLoader reducers={reducers}>
           <div className={cls.accounting}>
               <AccountingPageNewHeader setSelectType={setSelectType} selectType={selectType}/>
                <AccountingNewFilter selectType={selectType}/>
           </div>

       </DynamicModuleLoader>
    );
};

