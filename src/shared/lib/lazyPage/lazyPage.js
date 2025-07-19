import React from "react";

export const lazyPage = (importFn, name) => {

    return React.lazy(() => importFn().then(module => {

        console.log(module[name])
        return { default: module[name] }
    }));
}
