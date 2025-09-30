import React, { useState } from 'react';
import cls from './customCheckBox.module.sass';

export const CustomCheckBox = ({setChecked, checked}) => {
    // const [checked, setChecked] = useState(false);

    return (
        <div className={cls.customSelect}>
            <div className={cls.option}>
                <label className={cls.checkboxWrapper}>
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => setChecked(!checked)}
                    />
                    <span className={cls.checkmark}></span>
                </label>
            </div>
        </div>
    );
};