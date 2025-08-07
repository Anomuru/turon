import React from "react";

export const lazyPage = (importFn, name) => {

    return React.lazy(() => importFn().then(module => {

        return { default: module[name] }
    }));
}
