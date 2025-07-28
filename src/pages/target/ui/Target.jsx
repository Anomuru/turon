import React from 'react';
import {Route, Routes} from "react-router";
import {TargetItemsHome, TargetItemsSecond, TargetItemsLast} from "entities/targetItems";
import {TargetItemsReg} from "features/target";

const Target = () => {
    return (
        <Routes>
            <Route path={"form"} element={<TargetItemsHome/>}/>
            <Route path={"second"} element={<TargetItemsSecond/>}/>
            <Route path={"last"} element={<TargetItemsLast/>}/>
            <Route path={"/form/:type"} element={<TargetItemsReg/>}/>
            {/*<Route path={"/children"} element={<>} />*/}


        </Routes>
    );
};

export default Target;