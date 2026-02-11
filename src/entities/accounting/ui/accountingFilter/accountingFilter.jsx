import cls from "./accountFilter.module.sass"
import classNames from "classnames";
import React from "react";
export const  AccountingFilter = ({filter , activeMenu , setPage , setActive }) => {

    return (
        <ul className={cls.ul}>
            {filter.map((item, i) => <li
                key={i}
                className={classNames(cls.other__item, {
                    [cls.active]: activeMenu === item.name
                })}
                onClick={() => {
                    setPage(item.name)
                    setActive(item.name)

                }}
            >
                {item.label}
            </li>)}
        </ul>
    );
};

