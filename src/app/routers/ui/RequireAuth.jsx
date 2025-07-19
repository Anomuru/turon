import {getUserFetchError} from "pages/loginPage/model/selectors/selectors";
import {useEffect, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Navigate, Outlet} from "react-router";

// import {getUserAuthData} from "pages/login";
import {fetchUserData} from "entities/user";

import {getUserRefreshLoading, getUserRole, userRefresh, userRefreshData} from "pages/loginPage";
import {API_URL, useHttp} from "shared/api/base";
import {DefaultPageLoader} from "../../../shared/ui/defaultLoader";


// http://192.168.68.123:8000/Api/token/refresh/

export const RequireAuth = ({roles, children}) => {
    // const auth = useSelector(getUserAuthData)
    const {request} = useHttp()
    const refresh_token = sessionStorage.getItem("refresh_token")
    const userRoles = useSelector(getUserRole)
    const refreshLoading = useSelector(getUserRefreshLoading)
    const error = useSelector(getUserFetchError)

    const dispatch = useDispatch()

    useEffect(() => {
        // dispatch(fetchUserData(refresh_token))
        dispatch(userRefreshData({refresh: refresh_token}))
        // request(`${API_URL}Api/token/refresh/`, "POST", JSON.stringify({refresh: refresh_token}))
        //     .then(res => {

        //         dispatch(userRefresh(res))
        //     })

    }, [])


    // const hasRequiredRoles = useMemo(() => {
    //     if (!roles) {
    //         return true;
    //     }
    //

    //
    //     return roles.some((requiredRole) => {

    //         return userRoles?.includes(requiredRole);
    //     });
    // }, [roles, userRoles]);




    // if (!roles.includes(userRoles)){
    //     return (
    //         <Navigate
    //             to={"/login"}
    //         />
    //     );
    // }

    if (refreshLoading) {
        return <DefaultPageLoader/>
    } else if (error) {
        return <Navigate to={"/login"}/>
    } else return <Outlet/>
};