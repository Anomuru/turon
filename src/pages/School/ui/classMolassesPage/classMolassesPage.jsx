import React from "react";

import {
    ClassMolassesRatingList,
    ClassMolassesStudentsList
} from "entities/School/classMolasses";

import cls from "./classMolassesPage.module.sass";

export const ClassMolassesPage = () => {
    return (
        <div className={cls.molassesPage}>
            <ClassMolassesRatingList/>
            <ClassMolassesStudentsList/>
        </div>
    )
}
