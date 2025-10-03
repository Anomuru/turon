import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {
    RgbDataList,
    fetchRgbData,
    getRgbLoading
} from "entities/rgbData";
import {getBranch} from "features/branchSwitcher";
import {DefaultPageLoader} from "shared/ui/defaultLoader";

import cls from "./rgbDataPage.module.sass";
import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {getSelectedLocations} from "features/locations/index.js";

export const RgbDataPage = () => {

    const dispatch = useDispatch()
    const selectedBranch = useSelector(getSelectedLocations);
    const id = selectedBranch?.id

    const loading = useSelector(getRgbLoading)

    useEffect(() => {
        if (id)
            dispatch(fetchRgbData({branch: id}))
    }, [id])

    if (loading) return <DefaultPageLoader/>
    return (
        <div className={cls.rgbDataPage}>
            <RgbDataList/>
        </div>
    );
};
