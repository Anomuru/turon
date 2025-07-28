import {Button} from "../../../../../shared/ui/button";
import React from "react";

export const OverHeadHeader = ({onClick , setDeleted , deleted , sum , formatSalary , sum2 , }) => {
    return (
        <div style={{display: "flex", gap: "2rem" ,alignItems: "center" ,justifyContent: "space-between"}}>
            <div style={{display: "flex" , gap: "2rem"}}>
                <Button type={deleted ? "disabled" : ""} onClick={deleted ? null : onClick}>
                    Qo'shish
                </Button>
            </div>
            <div style={{color: "rgb(34, 197, 94)" , fontSize: "2.2rem" , textAlign: "end" }}>Total : {formatSalary(deleted ? sum2 : sum)}</div>
        </div>
    );
};

