import React, {useEffect} from 'react';
import cls from "./observationShowPage.module.sass"
import {API_URL, API_URL_DOC, headers} from "shared/api/base.js";

export const ObservationShowPage = () => {

    useEffect(() => {
        fetch(`${API_URL}Teachers/teacher_stats/?branch_id=6&term_id=3`, {
            method: "GET",
            headers: headers()
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)})
    }, []);

    return (
        <div className={cls.main}>

        </div>
    );
};

