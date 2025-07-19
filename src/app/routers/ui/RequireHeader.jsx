import React, {useEffect} from 'react';
import {Header} from "widgets/header";
import {Outlet} from "react-router";

import BackButton from "shared/ui/backButton/backButton";
import {fetchThemeSwitcherSystemsThunk, getSystem} from "features/themeSwitcher";
import {fetchLocationsThunk, getSelectedLocations} from "features/locations";
import {fetchBranchesByLocationsThunk} from "features/branchSwitcher";
import {useDispatch, useSelector} from "react-redux";
import {getSystemInited} from "features/themeSwitcher/modal/selector/themeSwitcherSystems";

 const RequireHeader = ({header = true,back}) => {

    const inited = useSelector(getSystemInited)
    const system = useSelector(getSystem)
    const selectedLocations = useSelector(getSelectedLocations)
    const dispatch= useDispatch()


    useEffect(() => {
        if (!inited && !header) {
            dispatch(fetchThemeSwitcherSystemsThunk())
        }
    }, [inited])

    useEffect(() => {
        if (system?.id && !header)
            dispatch(fetchLocationsThunk(system?.id))
    },[system?.id, header])

    useEffect(() => {
        if (selectedLocations?.length && selectedLocations[0]?.id && !header) {
            dispatch(fetchBranchesByLocationsThunk(selectedLocations[0].id))
        }
    }, [selectedLocations.length,header])


    return (
        <>
            {header && <Header/>}
            {back && <BackButton/>}
            <Outlet/>
        </>

    );
};

export default RequireHeader;