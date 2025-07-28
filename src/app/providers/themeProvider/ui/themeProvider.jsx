import {useMemo, useState} from 'react';

import {ThemeContext} from "shared/lib/context/themeContext";

export const ThemeProvider = ({ initialTheme, children }) => {

    const [theme, setTheme] = useState(initialTheme);

    const defaultProps = useMemo(
        () => ({
            theme,
            setTheme,
        }),
        [setTheme, theme],
    )

    return (
        <ThemeContext.Provider value={defaultProps}>
            {children}
        </ThemeContext.Provider>
    );
};
