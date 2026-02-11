import React, {useState} from 'react';


import cls from "./filteredLeadsPage.module.sass"
import BackButton from "shared/ui/backButton/backButton";
import {Input} from "shared/ui/input";
import {FilteredLeadsList} from "entities/filteredLeadsList";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {filteredLeadsListSlice, filterLeadsReducers} from "entities/filteredLeadsList/model/filteredLeadsListSlice.js";


const reducers = {
    filteredLeadsListSlice: filterLeadsReducers
}

export const FilteredLeadsPage = () => {

    const [dateTo, setDateTo] = useState(null)
    const [dateFrom, setDateFrom] = useState(null)

    return (

        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.fileteredLeads}>

                <div className={cls.header}>
                    <BackButton/>


                    <div style={{display: "flex" , gap: "2rem"}}>
                        <Input type={"date"} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}/>
                    <Input type={"date"} value={dateTo} onChange={(e) => setDateTo(e.target.value)}/>
                    </div>
                </div>
                <div className={cls.content}>
                    <FilteredLeadsList dateTo={dateTo} dateFrom={dateFrom}/>


                </div>
            </div>
        </DynamicModuleLoader>
    );
};



