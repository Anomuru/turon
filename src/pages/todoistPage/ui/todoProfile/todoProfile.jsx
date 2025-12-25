import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";

import { fetchTaskProfile } from "../../model/todoistThunk";


export const TodoProfile = () => {

    const { taskId } = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
        if (taskId)
            dispatch(fetchTaskProfile({ id: taskId }))
    }, [taskId])



    return null
}
