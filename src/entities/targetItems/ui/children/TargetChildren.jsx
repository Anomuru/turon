import React from 'react';
import {Trans, Translation, useTranslation} from "react-i18next";

export const TargetChildren = () => {

    const { t, i18n } = useTranslation();
    console.log(i18n)


    return (
        <div>
            <Trans i18nKey="children.title">
                To get started, edit <code>src/App.js</code> and save to reload.
            </Trans>
            <h1>{t('children.title')}</h1>


        </div>
    );
};

