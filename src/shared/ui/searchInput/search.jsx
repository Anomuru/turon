import React, { memo } from 'react';
import cls from "./search.module.sass"
import '@fortawesome/fontawesome-free/css/all.min.css';
import classNames from "classnames";

export const SearchInput = memo(({ search, setSearch , extraClass}) => {
    return (
        <label id={cls.search} className={classNames(cls.search, extraClass)}>
            <span><i className="fas fa-search" /></span>
            <input
                value={search}
                placeholder={"Qidiruv "}
                id="search"
                type="search"
                onChange={e => {
                    setSearch(e.target.value)
                }}
            />
        </label>
    );
});