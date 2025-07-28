import React, {useEffect, useState} from 'react';
import {Outlet,} from "react-router";
import {useDispatch, useSelector} from "react-redux";

import {getUserId, getUserRefreshLoading} from "pages/loginPage"
import {Menubar} from "widgets/menuBar";
import {Alert} from "features/alert";
import {fetchUserProfileData} from "entities/profile/userProfile";

import cls from "./Layout.module.sass"

export const Layout = () => {




    const userId = useSelector(getUserId)
    const refreshLoading = useSelector(getUserRefreshLoading)


    const dispatch = useDispatch()

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserProfileData(userId))
        }
    }, [userId, refreshLoading])


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



