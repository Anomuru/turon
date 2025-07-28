import {memo} from "react";

export const RequirePermission = memo(({children, permission}) => {
    if (permission) {
        return children
    }
})
