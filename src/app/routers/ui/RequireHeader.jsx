import React, { useEffect } from 'react';
import { Header } from "widgets/header";
import { Outlet } from "react-router";

import BackButton from "shared/ui/backButton/backButton";
import { fetchLocationsThunk, getLocations, getSelectedLocations } from "features/locations";
import { fetchBranchesByLocationsThunk } from "features/branchSwitcher";
import { useDispatch, useSelector } from "react-redux";
import { getUserId } from 'pages/loginPage';

const RequireHeader = ({ header = true, back }) => {

    // const selectedLocations = useSelector(getSelectedLocations)
    const dispatch = useDispatch();
    const locations = useSelector(getLocations)
    const userId = useSelector(getUserId)


    useEffect(() => {
        if (userId)
            dispatch(fetchLocationsThunk(userId))
    }, [userId]);


    // const dispatch = useDispatch()
    //
    //
    // useEffect(() => {
    //     if (selectedLocations?.length && selectedLocations[0]?.id && !header) {
    //         dispatch(fetchBranchesByLocationsThunk(selectedLocations[0].id))
    //     }
    // }, [header])


    return (
        <>
            {header && <Header />}
            {back && <BackButton />}
            <Outlet />
        </>

    );
};

export default RequireHeader;