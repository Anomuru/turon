import {useMemo, useState} from "react";

import {SearchContext} from "shared/lib/context/searchContext";

export const SearchProvider = ({children}) => {

    const [search, setSearch] = useState("")

    const defaultProps = useMemo(
        () => ({
            search, setSearch
        }),
        [search, setSearch]
    )

    return (
        <SearchContext.Provider value={defaultProps}>
            {children}
        </SearchContext.Provider>
    )
}