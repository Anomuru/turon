import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import childrenUz from 'entities/targetItems/ui/children/uz.json';
import childrenRu from 'entities/targetItems/ui/children/ru.json';


import childrenFormUz from "features/target/ui/targetForm/uz.json"
import childrenFormRu from "features/target/ui/targetForm/ru.json"
import childrenFooterUz from "app/layouts/layoutTarget/uz.json"
import childrenFooterRU from "app/layouts/layoutTarget/ru.json"
import targetItemsHomeConfigRu from "entities/targetItems/config/targetItemsHomeConfig/ruTranslation.json"
import targetItemsHomeConfigUz from "entities/targetItems/config/targetItemsHomeConfig/uzTranslation.json"
import targetItemsSecondConfigUz from "entities/targetItems/config/targetItemsSecondConfig/uzTranslation.json"
import targetItemsSecondConfigRu from "entities/targetItems/config/targetItemsSecondConfig/ruTranslation.json"
import targetItemsLastConfigUz from "entities/targetItems/config/targetItemsLastConfig/uzTranslation.json"
import targetItemsLastConfigRu from "entities/targetItems/config/targetItemsLastConfig/ruTranslation.json"







const resources = {
    uz: {
        translation: {
            children: childrenUz ,
            form: childrenFormUz,
            footer: childrenFooterUz,
            targetHome: targetItemsHomeConfigUz,
            targetSecond: targetItemsSecondConfigUz,
            targetLast: targetItemsLastConfigUz
        }
    },
    ru: {
        translation: {
            children: childrenRu,
            form: childrenFormRu,
            footer: childrenFooterRU,
            targetHome: targetItemsHomeConfigRu,
            targetSecond: targetItemsSecondConfigRu,
            targetLast: targetItemsLastConfigRu
        }
    },
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: "uz", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        fallbackLng: 'uz',
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });



export default i18n;
