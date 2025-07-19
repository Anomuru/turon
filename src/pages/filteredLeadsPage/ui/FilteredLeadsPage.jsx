import React, {useState} from 'react';


import cls from "./filteredLeadsPage.module.sass"
import BackButton from "shared/ui/backButton/backButton";
import {Input} from "shared/ui/input";
import {FilteredLeadsList} from "entities/filteredLeadsList";



export const FilteredLeadsPage = () => {

    const [date,setDate]  = useState(null)

    console.log(date, "date")

    return (
        <div className={cls.fileteredLeads}>

            <div className={cls.header}>
                <BackButton/>


                <Input type={"date"} value={date} onChange={(e) => setDate(e.target.value)}/>
            </div>
            <div className={cls.content}>
                <FilteredLeadsList date={date}/>


            </div>
        </div>
    );
};

