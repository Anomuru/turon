import { memo } from 'react';

import { EditableCard } from "shared/ui/editableCard";
import {groups} from "entities/profile/teacherProfile";

import cls from "./teacherProfileTeachersGroup.module.sass";
import cardBg from 'shared/assets/icons/card-bg.svg';
import groupImage from 'shared/assets/images/group-img.svg';

export const TeacherProfileTeachersGroup = memo(() => {

    return (
        <div className={cls.groupsContainer}>
            {groups.map((group) => (
                <EditableCard
                    key={group}
                    extraClass={cls.group}
                >
                    <img className={cls.cardBg} src={cardBg} alt=""/>
                    <div className={cls.groupText}>
                        <span className={cls.groupText_text}>
                            {group}-guruh
                        </span>
                    </div>
                    <div className={cls.groupList}>
                        <div className={cls.leftGroup}>
                            <div className={cls.lists}>
                                <h2 className={cls.list_title}>Student number:</h2>
                                <h2 className={cls.list_number}>12</h2>
                            </div>
                            <div className={cls.lists}>
                                <h2 className={cls.list_title}>Student number:</h2>
                                <h2 className={cls.list_number}>12</h2>
                            </div>
                            <div className={cls.lists}>
                                <h2 className={cls.list_title}>Student number:</h2>
                                <h2 className={cls.list_number}>12</h2>
                            </div>
                        </div>
                        <div className={cls.groupImgBox}>
                            <div className={cls.circleImg}>
                                <img className={cls.groupImage} src={groupImage} alt=""/>
                            </div>
                        </div>
                    </div>
                </EditableCard>
            ))}
        </div>
    );
});
