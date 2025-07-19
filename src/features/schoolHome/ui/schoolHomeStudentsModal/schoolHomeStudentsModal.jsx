import React from 'react';

import {SchoolHomeBuilding, SchoolHomeChampions, SchoolHomeClub, StudentCouncil} from "entities/schoolHome";


import cls from "./schoolHomeStudentsModal.module.sass";
import OurStudent from "../../../../entities/schoolHome/ui/ourStudent/ourStudent";

export const SchoolHomeStudentsModal = () => {
    return (
        <div className={cls.students}>
            <SchoolHomeBuilding/>
            <SchoolHomeChampions/>
            <SchoolHomeClub/>
            <OurStudent/>
            <StudentCouncil/>
        </div>
    );
}
