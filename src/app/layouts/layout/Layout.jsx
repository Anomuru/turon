import React, {useEffect, useState} from 'react';
import {Outlet, useLocation, useMatches, useNavigate, useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";

import {Menubar} from "widgets/menuBar";
import {Header} from "widgets/header";
import {fetchUserProfileData} from "entities/profile/userProfile";
import {getUserId, getUserRefreshLoading} from "pages/loginPage"

import cls from "./Layout.module.sass"
import {Alert} from "features/alert";
import {fetchLocationsThunk, getLocations, getSelectedLocations} from "features/locations";
import {fetchBranchesByLocationsThunk, getBranch, onDeleteBranch} from "features/branchSwitcher";
import {fetchThemeSwitcherSystemsThunk, getSystem} from "features/themeSwitcher";
import {getBranchStatus} from "features/branchSwitcher/model/selector/brachSwitcherSelector";
import {getSystemInited} from "features/themeSwitcher/modal/selector/themeSwitcherSystems";


export const Layout = () => {




    const userId = useSelector(getUserId)
    const refreshLoading = useSelector(getUserRefreshLoading)

    const inited = useSelector(getSystemInited)
    const selectedLocations = useSelector(getSelectedLocations)
    const locations = useSelector(getLocations)
    const system = useSelector(getSystem)







    const dispatch = useDispatch()

    // const system = useSelector(getSystem)

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserProfileData(userId))
        }
    }, [userId, refreshLoading])

    useEffect(() => {
        if (!inited) {
            dispatch(fetchThemeSwitcherSystemsThunk())
        }
    }, [inited])


    useEffect(() => {
        if (system.id)
            dispatch(fetchLocationsThunk(system.id))
    },[system.id])


    useEffect(() => {
        if (selectedLocations[0]?.id) {
            dispatch(fetchBranchesByLocationsThunk(selectedLocations[0].id))
        } else {
            dispatch(onDeleteBranch())
        }
    }, [selectedLocations[0]?.id])



    return (
        <>
            <Alert/>
            <Menubar/>
            <main className={cls.main}>



                <div className={cls.main__content}>
                    <Outlet/>
                </div>
            </main>
        </>
    );
};



