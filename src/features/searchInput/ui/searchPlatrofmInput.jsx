import {useEffect, useState} from 'react';

import {SearchInput} from 'shared/ui/searchInput';

export const SearchPlatformInput = ({onSearch, defaultSearch}) => {
    const [search, setSearch] = useState();

    useEffect(() => {
        setSearch(defaultSearch)
    }, [defaultSearch])

    const handleSearch = (searchValue) => {
        setSearch(searchValue);
        if (onSearch) {
            onSearch(searchValue);
        }
    };

    return (
        <SearchInput
            search={search}
            setSearch={handleSearch}
        />
    );
};

