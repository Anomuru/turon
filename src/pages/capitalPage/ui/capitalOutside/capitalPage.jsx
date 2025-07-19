import {useDispatch, useSelector} from "react-redux";
import {CapitalOutside, CapitalOutsideHeader, createCapitalCategory, getCapitalData} from "entities/capital";

import cls from "./capitalPage.module.sass"
import React, {memo, useCallback, useEffect, useState} from "react";




import {useForm} from "react-hook-form";
import {getCapitalDataThunk, getCapitalPermission, getLoading} from "entities/capital";
import {DefaultPageLoader} from "shared/ui/defaultLoader";
import {AddCategoryModal, CreateCapitalModal} from "features/createCapitalModal";


const img = {
    display: 'block',
    width: "30rem",
    height: '30rem'
};


export const CapitalPage = memo(() => {

    const {register, setValue, handleSubmit} = useForm()


    const loading = useSelector(getLoading)
    const dispatch = useDispatch()
    const [activeModal, setActiveModal] = useState(false)


    const [changeItem, setChangeItem] = useState({})
    const [changedImages, setChangedImages] = useState([])


    const capitalPermission = useSelector(getCapitalPermission)

    useEffect(() => {
        dispatch(getCapitalDataThunk())
    }, [])
    const getCapital = useSelector(getCapitalData)

    const onClick = (data) => {

        setActiveModal(!activeModal)
        setValue("name", '')
        setValue("id_number", '')
        dispatch(createCapitalCategory({data, changedImages}))


    }

    const loadingCount = () => {
        if (loading === true) {
            return (
                <div className={cls.loader}>
                    <div className={cls.loader__circle}>
                        <div></div>
                    </div>
                </div>
            )
        } else {
            return <div>{getCapital?.length}</div>
        }
    }


    return (
        <div className={cls.capitalMain}>
            <CapitalOutsideHeader
                caunt={loadingCount()}
                setActiveModal={setActiveModal}
                active={activeModal}
                isCanAdd={capitalPermission[0]?.add_capitalcategory}
            />
            {
                loading ? <DefaultPageLoader/> :
                    <CapitalOutside
                        isCanView={capitalPermission[0]?.view_capitalcategory}
                        capitalData={getCapital}
                    />
            }

            <CreateCapitalModal
                changeItem={changeItem}
                setChangedImages={setChangedImages}
                onClick={onClick}
                register={register}
                handleSubmit={handleSubmit}
                setActiveModal={setActiveModal}
                activeModal={activeModal}/>



        </div>
    );
})


