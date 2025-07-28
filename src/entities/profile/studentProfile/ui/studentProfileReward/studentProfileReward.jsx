import {memo} from 'react';

import {EditableCard} from "shared/ui/editableCard";

import cls from "./studentProfileReward.module.sass";
import reward from "shared/assets/images/reward.png";
import emptyReward from "shared/assets/images/emptyReward.png";
import medallion from "shared/assets/images/medallion.png";
import greedBall from "shared/assets/images/greadBall.png";

export const StudentProfileReward = memo(() => {
    return (
        <EditableCard
            extraClass={cls.reward}
        >
            <h1>Mukofot</h1>
            <div className={cls.reward__list}>
                <img src={reward} alt=""/>
                <img src={medallion} alt=""/>
                <img src={greedBall} alt=""/>
                <img src={emptyReward} alt=""/>
                <img src={emptyReward} alt=""/>
                <img src={emptyReward} alt=""/>
                <img src={emptyReward} alt=""/>
                <img src={emptyReward} alt=""/>
                <img src={emptyReward} alt=""/>
                <img src={emptyReward} alt=""/>
                <img src={emptyReward} alt=""/>
                <img src={emptyReward} alt=""/>
            </div>
        </EditableCard>
    );
})