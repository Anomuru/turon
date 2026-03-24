import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {CategoryProfileProfile} from "entities/capital/ui/categoryProfileProfile/categoryProfileProfile";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import cls from "./capitalCategoryProfile.module.sass"
import {useDispatch, useSelector} from "react-redux";
import {getCapitalCategory} from "entities/capital/model/thunk/capitalThunk.js";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {capitalReducer} from "entities/capital/index.js";


const reducers = {
    CapitalSlice: capitalReducer
}

export const CategoryProfile = () => {
    const {id} = useParams();





    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.main}>
                <CategoryProfileProfile/>
            </div>
        </DynamicModuleLoader>
        )
};
