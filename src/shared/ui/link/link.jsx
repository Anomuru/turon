import React from 'react';
import {NavLink} from "react-router-dom";


import cls from "./link.module.sass";

export const Link = ({children, to, activeClass, extraClass, onClick}) => {
    return (
        <NavLink
            to={to}
            className={
                ({isActive}) =>
                    isActive
                        ?
                        `${cls.link} ${activeClass} ${extraClass}`
                        :
                        `${cls.link} ${extraClass}`
            }
            onClick={onClick}
        >
            {children}
        </NavLink>
    );
};