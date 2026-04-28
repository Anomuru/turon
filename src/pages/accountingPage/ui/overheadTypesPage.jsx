import React from "react";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader";
import {capitalReducer} from "entities/capital";
import {OverheadTypes} from "./accountingPages/overheadTypes";

const reducers = {
    CapitalSlice: capitalReducer,
};

export const OverheadTypesPage = () => {
    return (
        <DynamicModuleLoader reducers={reducers}>
            <div style={{padding: "2rem"}}>
                <OverheadTypes/>
            </div>
        </DynamicModuleLoader>
    );
};
