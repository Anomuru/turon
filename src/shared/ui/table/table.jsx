import React from 'react';
import classNames from "classnames";

import cls from "./table.module.sass";

export const Table = ({children, extraClass}) => {
    return (
        <table className={classNames(cls.table, extraClass)}>
            {children}
        </table>
    );
};