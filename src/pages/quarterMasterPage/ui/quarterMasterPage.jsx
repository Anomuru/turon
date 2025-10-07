import React, { useEffect, useState } from 'react';
import {roomsReducer} from "entities/rooms/index.js";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";


import cls from "./quarterMasterPage.module.sass";
import {QuarterMaster} from "entities/quarterMaster";
import {useDispatch, useSelector} from "react-redux";
import {quarterMasterLoading, quarterMasterSelector} from "pages/quarterMasterPage/model/quarterMasterSelector.js";
import {quarterMasterReducer} from "pages/quarterMasterPage/model/quarterMasterSlice";
import { getUserBranchId } from 'entities/profile/userProfile';
import {fetchQuarterMasterData} from "../model/quarterMasterThunk";
import {updateLoading, updateQuarter} from "../model/quarterMasterSlice";
import { API_URL, useHttp, headers } from 'shared/api/base';
import { Table } from 'shared/ui/table';
import { DefaultLoader } from 'shared/ui/defaultLoader';
import { Modal } from 'shared/ui/modal';
import { Form } from 'shared/ui/form';
import { Select } from 'shared/ui/select';
import { Input } from 'shared/ui/input';
import { useForm } from 'react-hook-form';
import { Textarea } from 'shared/ui/textArea';

const statuses = [
    // {id: "sent", name: "Yuborildi"},
    {id: "review", name: "Ko‘rib chiqilmoqda"},
    {id: "accepted", name: "Qabul qilindi"},
    {id: "canceled", name: "Bekor qilindi"}
]

const reducers = {
    quarterMasterSlice: quarterMasterReducer,

}

export const QuarterMasterPage = () => {

    const {request} = useHttp()
    const dispatch = useDispatch()
    const {register, handleSubmit, setValue} = useForm()
    const branch = useSelector(getUserBranchId)
    const data = useSelector(quarterMasterSelector);
    const loading = useSelector(quarterMasterLoading)

    const [isChange, setIsChange] = useState(false)
    const [changeItem, setChangeItem] = useState(null)
    const [selectedStatus, setSelectedStatus] = useState("review")
    const [selectedFilter, setSelectedFilter] = useState("all")

    useEffect(() => {
        if (branch) {
            dispatch(fetchQuarterMasterData({branch_id: 1, status:selectedFilter}))
        }
    }, [branch, selectedFilter])

    const onUpdate = (data) => {
        const forPatch = {
            ...data,
            status: selectedStatus
        }
        request(`${API_URL}Teachers/teacher-requests/${changeItem?.id}/`, "PATCH", JSON.stringify(forPatch), headers())
            .then(res => {
                dispatch(updateQuarter(res))
                setIsChange(false)
                setSelectedStatus(null)
                setChangeItem(null)
            })
    }

    const render = () => {
        return data?.map((item, index) => {
            // const sliceIndex = item?.text?.indexOf("ta")
            return <QuarterMaster 
                order={item}
                statuses={[{id: "sent", name: "Yuborildi"},...statuses]}
                onChange={() => {
                    setChangeItem(item)
                    setIsChange(true)
                    setValue("comment", item?.comment)
                }}
            />
        })
    }

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.master}>
                <div className={cls.master__box}>
                    <div className={cls.titles}>
                        <h1 className={cls.master__box__title}>Maktab uchun zarur buyumlar</h1>
                        <h3 className={cls.master__box__subtitle}>O'qituvchilar tomonidan yuborilgan talablar ro'yxati</h3>
                    </div>
                    <Select
                        extraClass={cls.select}
                        options={[{id: "all", name: "Hammasi"},{id: "sent", name: "Yuborildi"}, ...statuses]}
                        onChangeOption={setSelectedFilter}
                        defaultValue={selectedFilter}
                    />
                </div>
                <div className={cls.master__list}>
                    {
                        loading
                        ? <DefaultLoader/>
                        : render()
                    }
                </div>

            </div>
            <Modal active={isChange} setActive={setIsChange} extraClass={cls.change}>
                <h1>O'zgartirish</h1>
                <Form extraClassname={cls.change__form} onSubmit={handleSubmit(onUpdate)}>
                    <Select
                        options={statuses}
                        titleOption={"Status"}
                        defaultValue={changeItem?.status !== "sent" ? changeItem?.status : "review"}
                        value={selectedStatus}
                        onChangeOption={setSelectedStatus}
                    />
                    <Textarea 
                        extraClassName={cls.input}
                        name={"comment"}
                        register={register}
                        placeholder={"Koment"}
                        defaultValue={changeItem?.comment}
                        required
                    />
                </Form>
            </Modal>
        </DynamicModuleLoader>

    );
};

