import React, {useState} from 'react';

import {Modal} from "shared/ui/modal";
import cls from './giveSalaryModal.module.sass'
import {TeacherProfileTotalAmount} from "entities/profile/teacherProfile";


export const GiveSalaryModal = React.memo(({active, setActive, salary_id, user_id}) => {

    return (
        <Modal
            active={active}
            setActive={setActive}
        >
            <div className={cls.filter}>
                <h1>Oylik berish </h1>
                <div className={cls.filter__container}>
                    <TeacherProfileTotalAmount
                        active={active}
                        setActive={setActive}
                        salary_id={salary_id}
                        user_id={user_id}
                    />

                </div>

            </div>
        </Modal>
    );
})