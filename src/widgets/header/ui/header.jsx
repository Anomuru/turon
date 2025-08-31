import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation, useNavigate} from 'react-router';
import {SearchPlatformInput, getSearchStr} from 'features/searchInput';
import {getLocations, getSelectedLocations, Location} from 'features/locations';
import {useDebounce} from 'shared/lib/hooks/useDebounce';
import {Button} from 'shared/ui/button';


import cls from './header.module.sass';
import logo from 'shared/assets/logo/turonNew.svg';
import {deleteSelectedLocations} from "features/locations";
import {BranchSwitcher} from "features/branchSwitcher";
import BackButton from "shared/ui/backButton/backButton";
import {getUserData, getUserRoles} from "entities/user/index.js";
import {getUserRole} from "pages/loginPage/index.js";
import {getUserProfileData} from "entities/profile/userProfile/index.js";


export const Header = () => {


    const dispatch = useDispatch();

    // const {pathname, search} = useLocation();

    const navigate = useNavigate();

    const [locationHistory, setLocationHistory] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();

    const user = useSelector(getUserProfileData);
    // const [valueData, setValueData] = useState(null);
    // const debouncedFetchData = useDebounce(fetchSearchData, 500);
    //
    // const selectedLocations = useSelector(getSelectedLocations)
    // const locations = useSelector(getLocations)


    // useEffect(() => {
    //     if (searchParams.get('search')) {
    //         setValueData(searchParams.get('search'));
    //     }
    // }, []);
    //
    //
    // useEffect(() => {
    //     if (locationHistory.length >= 5) {
    //         setLocationHistory(arr => {
    //             arr.pop();
    //             return [pathname, ...arr];
    //         });
    //     } else {
    //         setLocationHistory(arr => [pathname, ...arr]);
    //     }
    // }, [pathname]);
    //
    // useEffect(() => {
    //     if (valueData) {
    //         debouncedFetchData();
    //     } else {
    //         setSearchParams({});
    //         // dispatch(getSearchStr(null));
    //     }
    // }, [valueData]);
    //
    // useEffect(() => {
    //     if (!searchParams.get('search') && !searchParams.get('type') ) {
    //         setSearchParams({});
    //         setValueData(null);
    //         // dispatch(getSearchStr(''));
    //     }
    // }, [pathname, search]);
    //
    // function fetchSearchData() {
    //     const checkedValue = typeof valueData === 'string' ? valueData : searchParams.get('search');
    //
    //     if (searchParams.get('search') !== checkedValue) {
    //         setSearchParams({ search: checkedValue });
    //     }
    //
    //     // dispatch(getSearchStr(checkedValue));
    // }


    const savedSearch = localStorage.getItem("search") || "";

    const onChange = (value) => {
        localStorage.setItem("search", value);
        dispatch(getSearchStr(value));
    };
    useEffect(() => {
        if (savedSearch) {
            dispatch(getSearchStr(savedSearch));
        }
    }, [dispatch]);

    return (
        <header className={cls.header}>
            <div className={cls.header__top}>
                {/*<div style={{display: "flex" , flexDirection: "column" , gap: "2rem" , marginTop: "1rem"}}>*/}
                {/*    <img className={cls.header__logo} src={logo} alt=""/>*/}
                    <BackButton
                        onClick={() => {
                            // if (locationHistory.length) {
                            //     locationHistory.shift();
                            //     navigate(locationHistory[0]);
                            //     locationHistory.shift();
                            // }
                            // setSearchParams({});
                            navigate(-1)
                            // setValueData(null);
                        }}
                    />
                {/*</div>*/}
               <div className={cls.header__right}>
                   <SearchPlatformInput
                       defaultSearch={savedSearch}
                       onSearch={onChange}
                   />
                   <i onClick={() => {
                       navigate(`settings`)
                   }} className="fa-solid fa-gear"/>
               </div>
            </div>
            {/*<div className={cls.header__bottom}>*/}
            {/*    */}
            {/*</div>*/}
        </header>
    );
};
