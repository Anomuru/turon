import { memo } from 'react';
import cls from "./miniLoader.module.sass"

export const MiniLoader = memo(({ custom }) => {
    return (
        <div className={cls.loader} style={{ position: custom && "relative" }}>
            <div className={cls.loader__circle} style={{ position: custom && "absolute", top: custom && "35px", left: custom && "-5rem" }}>
                <div></div>
            </div>
        </div>
    );
})