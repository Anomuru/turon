import {Button} from "shared/ui/button";
import cls from "./accountingCapitalCosts.module.sass"
import React from "react";
export const CapitalHeader = ({setActive , sum2 , sum1 , formatSalary , deleted}) => {
    return (
        <div style={{display: "flex", gap: "2rem" ,alignItems: "center" ,justifyContent: "space-between"}}>
            <Button onClick={() => setActive(true)}>Qo'shish</Button>
            <div style={{color: "rgb(34, 197, 94)" , fontSize: "2.2rem" , textAlign: "end" }}>Total : {formatSalary(deleted ? sum2 : sum1)}</div>
        </div>
    );
};

