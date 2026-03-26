import {getUserBranchId} from "entities/profile/userProfile";
import {useNavigate, useParams} from "react-router";
import React, {memo, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    CapitalInsideHeader,
    CapitalInsideProduct,
    CapitalInsideSecond, capitalReducer,
    getCapitalInside, getCapitalTypes, getInsideCategory
} from "entities/capital";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";

import cls from "./capitalInside.module.sass"
import {getCapitalInsideInfo} from "entities/capital";
import {getCapitalInfo} from "entities/capital";
import {getLoading} from "entities/capital/model/selector/capitalSelector";
import {DefaultPageLoader} from "shared/ui/defaultLoader";

import {useForm} from "react-hook-form";

import {
    changeCapitalInfoThunk,
    createInsideCategory,
    getPaymentType
} from "entities/capital/model/thunk/capitalThunk";
import {onDeleteBranch} from "entities/capital/model/slice/capitalSlice";
import {API_URL, headers, headersImg, useHttp} from "shared/api/base";


import {AddCategoryModal, EditModal} from "features/createCapitalModal";
import {getLocationThunk} from "../../../../entities/creates/model/createThunk/createBranchThunk";
import {onAddAlertOptions} from "../../../../features/alert/model/slice/alertSlice";
import {SubCategory} from "../subCategory/subCategory";
import {getBranch} from "../../../../features/branchSwitcher";
import {getCurrentBranch} from "entities/oftenUsed/model/oftenUsedSelector.js";



const reducers = {
    CapitalSlice: capitalReducer
}

export const CapitalInside = memo(() => {

    const dispatch = useDispatch()
    const {register, setValue, handleSubmit} = useForm()
    const {id} = useParams()
    // const id = useSelector(getUserBranchId)
    const {request} = useHttp()
    const navigation = useNavigate()
    const capitalInside = useSelector(getCapitalInside)
    const [datas, setDatas] = useState([])
    const [pay, setPay] = useState([])
    const branchId = localStorage.getItem("branchForDirector")

    useEffect(() => {
        if (id && branchId) {
            dispatch(getInsideCategory({id, branch: branchId}))
        }
    }, [id, branchId]);


    useEffect(() => {
        const fetchData = async () => {
            const [category, capital] = await Promise.all([
                request(`${API_URL}Capital/capital_category/${id}/`, "GET", null, headers()),
            ]);
            setDatas(category);
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await request(`${API_URL}Payments/payment-types/`, "GET", null, headers());
            setPay(res);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (id) {
            dispatch(getCapitalInfo(id))
            dispatch(getPaymentType())
        }


    }, [id])




    const loading = useSelector(getLoading)



    const [changeItem, setChangeItem] = useState({})
    const [changedImages, setChangedImages] = useState([])
    const [selectPayment, setSelectPayment] = useState()

    // const currentBranch = useSelector(getCurrentBranch);
    // const ROLE = localStorage.getItem('job');
    const userBranchId = localStorage.getItem('branchId');
    console.log(userBranchId)
    // const branchForFilter = ROLE === 'admin' ? currentBranch : userBranchId;

    const [activeModal, setActiveModal] = useState(false)

    const [editModal, setEditModal] = useState(false)
    const onDelete = () => {
        request(`${API_URL}Capital/capital_category/${id}/`, "DELETE", null, headers())
            .then(res => {
                // dispatch(onDeleteBranch({id: id}));
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: res.msg
                }))
                navigation(-1)
            })
            .catch(err => {
                console.log(err)
            })


    }
    useEffect(() => {
        if (changeItem) {
            setValue("name", changeItem.name)
            setValue("id_number", changeItem.id_number)
        }
    }, [changeItem])



    const onClick = async (data) => {
        setActiveModal(false)

        await dispatch(createInsideCategory({data, changedImages, selectPayment, userBranchId, id}));

        // dispach(getInsideCategory(id))
        setValue("name", "")
        setValue("id_number", "")
        setValue("price", "")
        setValue("total_down_cost", "")
        setValue("term", "")
        setValue("curriculum_hours", "")

    };
    const capitalItem = () => {
        return loading ? <DefaultPageLoader/> : (
            <>
                <CapitalInsideSecond
                    setChangeItem={setChangeItem}
                    onDelete={onDelete} editModal={editModal}
                    setEditModal={() => setEditModal(!editModal)}
                    capitalData={datas}/>
                <CapitalInsideProduct addModal={activeModal} setAddModal={setActiveModal}
                                      capitalData={capitalInside}/>
            </>
        )
    }


    const onChange = async (data) => {
        await dispatch(changeCapitalInfoThunk({data, id}))
            .then(() => {
                dispatch(onAddAlertOptions({type: 'success', status: true, msg: "Ma'lumot yangilandi"}))
            })

        const category = await request(
            `${API_URL}Capital/capital_category/${id}/`,
            "GET",
            null,
            headers()
        )

        setDatas(category)

        setEditModal(false)

        setValue("name", "")
        setValue("id_number", "")
    }

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.capitalInside}>
                {/*<CapitalInsideHeader*/}
                {/*    activeMenu={activeMenu}*/}
                {/*    setActiveMenu={setActiveMenu}*/}
                {/*    categoryMenu={capitalType}*/}
                {/*/>*/}
                {
                     capitalItem()
                }


                <AddCategoryModal
                    setSelectPayment={setSelectPayment}
                    register={register}
                    handleSubmit={handleSubmit}
                    onClick={onClick}
                    activeModal={activeModal}
                    setActiveModal={setActiveModal}
                    setChangedImages={setChangedImages}
                    changeItem={changeItem}
                    options={pay}


                />
                <EditModal register={register} handleSubmit={handleSubmit} onClick={onChange} editModal={editModal}
                           setEditModal={setEditModal} setChangedImages={setChangedImages} changeItem={changeItem}/>


            </div>
        </DynamicModuleLoader>
    );
})


