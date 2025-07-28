import React from 'react';
import cls from "./notfound.module.sass"
import Notfound from 'shared/assets/images/404_found.svg'
export  const NotFoundPage = () => {
    return (
        <div className={cls.pageStyle}>
            <div className={cls.shapeStyle}>
            </div>
            <div className={cls.shape1Style}>
                <img src={Notfound} alt=""/>
            </div>
            {/*<h1 className={cls.headerStyle}>404</h1>*/}
            <p className={cls.messageStyle}>Page Not Found</p>
        </div>
    );
};
