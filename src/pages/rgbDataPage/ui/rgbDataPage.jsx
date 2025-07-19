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

export const RgbDataPage = () => {

    const dispatch = useDispatch()
    const {id} = useSelector(getBranch)
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
