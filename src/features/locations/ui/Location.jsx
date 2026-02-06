import React, { useCallback, useEffect, useState } from 'react';
import { Select } from 'shared/ui/select';
import cls from './Location.module.sass';
import { useDispatch, useSelector } from 'react-redux';

import {setCurrentBranchId} from "entities/oftenUsed/model/oftenUsedSlice.js";
import { addSelectedLocations } from "../model/slice/locationsSlice";
import { fetchLocationsThunk } from "../model/thunk/locationsThunk";
import {
    getLocationLoading,
    getLocations,
    getSelectedLocations,
    // getSelectedLocationsByIds
} from "../model/selector/locationsSelector";
import { MiniLoader } from "shared/ui/miniLoader";
import { getUserId } from 'pages/loginPage';
import {fetchBranchesForSelect} from "entities/oftenUsed/index.js";
import {getBranchesSelect, getCurrentBranch} from "entities/oftenUsed/model/oftenUsedSelector.js";


export const Location = () => {


    const locations = useSelector(getLocations)
    // const selectedLocationsById = useSelector(getSelectedLocationsByIds)
    const selectedLocations = useSelector(getSelectedLocations)
    const loading = useSelector(getLocationLoading)
    const currentBranchId = useSelector(getCurrentBranch)
    const userId = useSelector(getUserId)
    const branches = useSelector(getBranchesSelect)

    console.log(currentBranchId, 'director locs');


    const [isLocal, setIsSetLocal] = useState(false)


    const dispatch = useDispatch();


    useEffect(() => {
        if (userId)
            dispatch(fetchLocationsThunk(userId))
    }, [userId]);

    useEffect(()=> {
        dispatch(fetchBranchesForSelect())
    }, [])

    useEffect(() => {
        const ROLE = localStorage.getItem("job");
        const id =
            ROLE === "director"
                ? localStorage.getItem("branchForDirector")
                : localStorage.getItem("branchId");

        if (id) {
            dispatch(setCurrentBranchId(id));
        }
    }, [dispatch]);




    //
    // useEffect(() => {
    //
    //     if (selectedLocationsById?.length === 0 && locations?.length > 1 && !isLocal) {
    //         const localstorageLocs = JSON.parse(localStorage.getItem("selectedLocations"))
    //
    //         setIsSetLocal(true)
    //
    //         if (localstorageLocs && localstorageLocs?.length > 0) {
    //
    //             for (let i = 0; i < localstorageLocs?.length; i++) {
    //                 dispatch(addSelectedLocations(localstorageLocs[i]?.id))
    //             }
    //         }
    //     }
    // },[selectedLocationsById?.length, locations?.length,isLocal])


    const changeSelectedLocation = useCallback((id) => {
        dispatch(setCurrentBranchId(id));
        localStorage.setItem("branchForDirector", id)
    }, []);

    // if (loading) {
    //     return (
    //         <div className={cls.loader}>
    //             <MiniLoader />
    //         </div>
    //     )
    // }


    return (
        <div className={cls.locations}>
                <Select
                    onChangeOption={changeSelectedLocation}
                    options={branches}
                    defaultValue={currentBranchId}


                />
        </div>
    );
};


