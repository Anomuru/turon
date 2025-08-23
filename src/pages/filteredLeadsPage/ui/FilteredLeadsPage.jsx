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

    const [date, setDate] = useState(null)

    return (

        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.fileteredLeads}>

                <div className={cls.header}>
                    <BackButton/>


                    <Input type={"date"} value={date} onChange={(e) => setDate(e.target.value)}/>
                </div>
                <div className={cls.content}>
                    <FilteredLeadsList date={date}/>


                </div>
            </div>
        </DynamicModuleLoader>
    );
};



