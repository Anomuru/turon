import {useDispatch, useSelector} from "react-redux";
import {
    CapitalOutside,
    CapitalOutsideHeader,
    capitalReducer,
    createCapitalCategory,
    getCapitalData
} from "entities/capital";

import cls from "./capitalPage.module.sass"
import React, {memo, useCallback, useEffect, useState} from "react";


import {useForm} from "react-hook-form";
import {getCapitalDataThunk, getCapitalPermission, getLoading} from "entities/capital";
import {DefaultPageLoader} from "shared/ui/defaultLoader";
import {AddCategoryModal, CreateCapitalModal} from "features/createCapitalModal";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {getSearchValue} from "features/searchInput/index.js";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import {onAddAlertOptions} from "features/alert/index.js";


const img = {
    display: 'block',
    width: "30rem",
    height: '30rem'
};

const reducers = {
    CapitalSlice: capitalReducer
}


export const CapitalPage = memo(() => {

    const {register, setValue, handleSubmit} = useForm()


    const loading = useSelector(getLoading)
    const dispatch = useDispatch()
    const [activeModal, setActiveModal] = useState(false)
    const capital = useSelector(getCapitalData)
    const [changeItem, setChangeItem] = useState({})
    const [changedImages, setChangedImages] = useState([])

    const search = useSelector(getSearchValue)



    useEffect(() => {
        dispatch(getCapitalDataThunk())
    }, []);

    console.log(capital)

    const onClick = async (data) => {
        await dispatch(createCapitalCategory({data, changedImages}))
            .then(() => {
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: "Ma'lumot qo'shildi"
                }))


                setActiveModal(false)

                setValue("name", "")
                setValue("id_number", "")
            })
            .catch((err) => {
                console.log(err)
            })


    }

    const loadingCount = loading ? null : capital?.length ?? 0


    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.capitalMain}>
                <>
                    <CapitalOutsideHeader
                        caunt={loadingCount}
                        setActiveModal={setActiveModal}
                        active={activeModal}
                        isCanAdd={true}
                    />
                    {
                        loading ? <DefaultPageLoader/> :
                            <CapitalOutside
                                isCanView={true}
                                capitalData={capital}
                            />
                    }
                </>

                <CreateCapitalModal
                    changeItem={changeItem}
                    setChangedImages={setChangedImages}
                    onClick={onClick}
                    register={register}
                    handleSubmit={handleSubmit}
                    setActiveModal={setActiveModal}
                    activeModal={activeModal}/>


            </div>
        </DynamicModuleLoader>
    );
})


