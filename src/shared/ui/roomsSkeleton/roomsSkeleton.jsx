import React from 'react';
import cls from "./roomsSkeleton.module.sass";

export const SkeletonCard = () => {
    return (
        <div className={`${cls.mainContainer_tablePanelBox_cardBox} ${cls.skeleton}`}>
            <div className={cls.mainContainer_tablePanelBox_cardBox_imgBox}>
                <div className={cls.skeletonImage}></div>
            </div>
            <div className={cls.mainContainer_tablePanelBox_cardBox_articleBox}>
                <div className={cls.mainContainer_tablePanelBox_cardBox_articleBox_sitterBox}>
                    <div className={cls.skeletonText}></div>
                    <div className={cls.skeletonText}></div>
                </div>
                <div className={cls.mainContainer_tablePanelBox_cardBox_articleBox_boardBox}>
                    <div className={cls.skeletonText}></div>
                    <div className={cls.skeletonSwitch}></div>
                </div>
                <div className={cls.mainContainer_tablePanelBox_cardBox_articleBox_roomNumBox}>
                    <div className={cls.skeletonText}></div>
                </div>
            </div>
        </div>
    );
};
