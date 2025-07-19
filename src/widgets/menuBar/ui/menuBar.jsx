import {useCallback, useContext, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router";
import classNames from "classnames";

import {getUserId, getUsername} from "pages/loginPage";
import {Link} from "shared/ui/link";
import {ThemeContext} from "shared/lib/context/themeContext";
import {menuConfig} from "../model/consts/menuConfig";
import {getUserBranchId, getUserPermission, getUserProfileData} from "entities/profile/userProfile";
import cls from "./menuBar.module.sass";
import defaultUserImage from "shared/assets/images/user_image.png";
import {NavLink} from "react-router-dom";
import {getSystem} from "features/themeSwitcher";
import {getSelectedLocations} from "features/locations";
import {getBranch} from "features/branchSwitcher";
import {DefaultLoader, DefaultPageLoader} from "shared/ui/defaultLoader";
import {MiniLoader} from "shared/ui/miniLoader";
import {clearSystems} from "features/themeSwitcher/modal/slice/themeSwitcherSlice";

export const Menubar = () => {
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const {theme} = useContext(ThemeContext);
    const username = useSelector(getUsername);


    const userPermissions = useSelector(getUserPermission);
    const user = useSelector(getUserProfileData);


    // const changeLocations = 1;
    const location = useSelector(getUserBranchId)
    const userId = useSelector(getUserId)
    const system = useSelector(getSystem)
    const selectedLocations = useSelector(getSelectedLocations)
    const branch = useSelector(getBranch)
    const dispatch = useDispatch()

    const onClickExit = () => {
        navigate("/login")
        dispatch(clearSystems())

    }


    const renderMultipleMenu = useCallback(() => {


        return menuConfig.map((item, index) => {
            const linkId = selectedLocations?.length > 1 && !item.multi ? "" : selectedLocations?.length > 1 && item.multi ? "/list" : `/${branch?.id}`
            if (selectedLocations > 1 && !item.branches) return;
            if (!item?.system.includes(system.name)) return;
            if ((typeof item.roles === "object" && user?.job.some(job => item.roles.includes(job))) || (typeof item.roles === "boolean" && item.roles)) {
                return (
                    <NavLink
                        to={item.to}
                        key={index}
                        className={({isActive}) =>
                            isActive ? `${cls.link} ${cls.active}` : `${cls.link}`
                        }
                    >
                    <span
                        className={cls.link__href}
                    >
                        <i className={`fas ${item.icon} icon-link`}/>
                        <span className={cls.link__title}>{item.name}</span>
                    </span>
                    </NavLink>
                );
            }
        });
    }, [theme, selectedLocations, branch, user]);

    const renderedMenu = renderMultipleMenu();


    return (
        <nav className={cls.menu}>
            <div className={cls.menu__user}>
                <Link to={`profile/${userId}`}>
                    <img
                        className={cls.userImage}
                        src={user?.profile_img ?? defaultUserImage}
                        alt=""
                    />
                </Link>
                <div className={cls.userInfo}>
                    <h3>{user?.username}</h3>
                    <p>{user?.job[0]}</p>
                </div>
            </div>
            <ul className={cls.menu__inner}>
                {
                    !user?.job ? <MiniLoader/> : renderedMenu
                }
            </ul>
            <div className={cls.menu__footer}>
                <div
                    className={cls.menu__exit}
                    onClick={onClickExit}
                >
                    <i className="fas fa-sign-out-alt"/>
                    <h2>Chiqish</h2>
                </div>
            </div>
        </nav>
    );
};
