import React, {useEffect} from 'react';
import {API_URL, headers, useHttp} from "shared/api/base.js";

export const NotificationPage = () => {

    const {request} = useHttp()

    useEffect(() => {
        request(`${API_URL}Tasks/notifications/?role=creator&user_id=1196`, "GET", null, headers())
        request(`${API_URL}Tasks/notifications/?role=executor&user_id=1198`, "GET", null, headers())
        request(`${API_URL}Tasks/notifications/?role=reviewer&user_id=1589`, "GET", null, headers())
    }, [])

    return (
        <div>

        </div>
    );
}
