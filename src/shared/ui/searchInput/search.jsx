import React, { memo } from 'react';
import cls from "./search.module.sass"
import '@fortawesome/fontawesome-free/css/all.min.css';

export const SearchInput = memo(({ search, setSearch}) => {
    return (
        <label id={cls.search} className={cls.search}>
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