import {memo} from 'react';

import cls from "./schoolHomeRouter.module.sass";

const SchoolHomeRouter = memo(() => {
    return (
        <div className={cls.router}>
            <div className={cls.router__info}>

            </div>
            <div className={cls.router__routes}>

            </div>
        </div>
    );
})
