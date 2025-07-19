
export const RequirePermission = ({children, permission}) => {
    if (permission) {
        return children
    }
}
