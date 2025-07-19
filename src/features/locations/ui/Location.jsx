import React, {useCallback, useEffect, useState} from 'react';
import { Select } from 'shared/ui/select';
import cls from './Location.module.sass';
import {useDispatch, useSelector} from 'react-redux';


import {addSelectedLocations} from "../model/slice/locationsSlice";
import {fetchLocationsThunk} from "../model/thunk/locationsThunk";
import {
    getLocationLoading,
    getLocations,
    getSelectedLocations,
    getSelectedLocationsByIds
} from "../model/selector/locationsSelector";
import {MiniLoader} from "shared/ui/miniLoader";


export const Location = ({systemId}) => {


    const locations = useSelector(getLocations)
    // const selectedLocationsById = useSelector(getSelectedLocationsByIds)
    const selectedLocations = useSelector(getSelectedLocations)
    const loading = useSelector(getLocationLoading)


    const [isLocal,setIsSetLocal] = useState(false)


    const dispatch = useDispatch();


    // useEffect(() => {
    //     if (systemId)
    //     dispatch(fetchLocationsThunk(systemId))
    // },[systemId])


    // useEffect(() => {
    //
    //     if (selectedLocationsById.length === 0 && locations.length > 1 && !isLocal) {
    //         const localstorageLocs = JSON.parse(localStorage.getItem("selectedLocations"))
    //
    //         setIsSetLocal(true)
    //
    //         if (localstorageLocs && localstorageLocs.length > 0) {
    //
    //             for (let i = 0; i < localstorageLocs?.length; i++) {
    //                 dispatch(addSelectedLocations(localstorageLocs[i]?.id))
    //             }
    //         }
    //     }
    // },[selectedLocationsById?.length, locations?.length,isLocal])


    const changeSelectedLocation = useCallback( (id) => {
        dispatch(addSelectedLocations(id))
    },[]);

    if (loading) {
        return (
            <div className={cls.loader}>
                <MiniLoader/>
            </div>
        )
    }


    return (
        <div className={cls.locations}>


            {
                locations.length > 1 ?
                    <Select
                        // title={"Location"}
                        onChangeOption={changeSelectedLocation}
                        options={locations}
                        defaultValue={selectedLocations.length === 1 ? "clear" : ""}
                    />
                    :
                    selectedLocations[0]?.name ?
                    <div className={cls.location}>
                        <span>Location:</span>
                        <span>{selectedLocations[0]?.name}</span>
                    </div> : null
            }

        </div>
    );
};


