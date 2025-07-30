import {useNavigate, useParams} from "react-router";
import React, {memo, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    CapitalInsideHeader,
    CapitalInsideProduct,
    CapitalInsideSecond,
    getCapitalInside, getCapitalTypes, getInsideCategory
} from "entities/capital";

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
import {getBranchThunk, getLocations} from "../../../../entities/editCreates";
import {getLocationThunk} from "../../../../entities/creates/model/createThunk/createBranchThunk";
import {onAddAlertOptions} from "../../../../features/alert/model/slice/alertSlice";
import {SubCategory} from "../subCategory/subCategory";
import {getBranch} from "../../../../features/branchSwitcher";

const capitalType = [
    {name: "category", label: "Category"},
    {name: "subCategory", label: "Sub Category"},
]


export const CapitalInside = memo(() => {

    const dispatch = useDispatch()
    const {register, setValue, handleSubmit} = useForm()
    // const {id} = useParams()
    const {id} = useSelector(getBranch)
    const {request} = useHttp()
    const navigation = useNavigate()
    const capitalInside = useSelector(getCapitalInside)

    const paymentType = useSelector(getCapitalTypes)

    useEffect(() => {
        dispatch(getCapitalInfo(id))
        dispatch(getPaymentType())
        dispatch(getInsideCategory(id))


        dispatch(getBranchThunk())
    }, [])


    const getCapitalInsideData = useSelector(getCapitalInsideInfo)

    const loading = useSelector(getLoading)
    const branches = useSelector(getLocations)



    const [changeItem, setChangeItem] = useState({})
    const [changedImages, setChangedImages] = useState([])
    const [selectPayment, setSelectPayment] = useState()
    const [capitalSelect , setSelectedCapital] = useState([])


    const [activeMenu, setActiveMenu] = useState(capitalType[0].name)

    const [activeModal, setActiveModal] = useState(false)

    const [editModal, setEditModal] = useState(false)
    const [selectedBranches, setSelectedBranches] = useState([])
    const onDelete = () => {
        request(`${API_URL}Capital/capital_category/${id}/`, "DELETE", null, headers())
            .then(res => {
                // dispatch(onDeleteBranch({id: id}));
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg : res.msg
                }))
                navigation(-2)
            })
            .catch(err => {
                console.log(err)
            })


    }

    const onClick = (data) => {
        setActiveModal(false)

        dispatch(createInsideCategory({data, changedImages, selectPayment, selectedBranches, id}));

        // dispatch(getInsideCategory(id))
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
                <CapitalInsideSecond onDelete={onDelete} editModal={editModal}
                                     setEditModal={() => setEditModal(!editModal)}
                                     capitalData={getCapitalInsideData}/>
                <CapitalInsideProduct addModal={activeModal} setAddModal={setActiveModal}
                                      capitalData={capitalInside}/>
            </>
        )
    }


    const onChange = (data) => {
        setEditModal(!editModal)
        dispatch(changeCapitalInfoThunk({data, id: id}))
        setValue("name", "")
        setValue("id_number", "")
    }


    const capitalItemRender = capitalItem()

    return (
        <div className={cls.capitalInside}>
            <CapitalInsideHeader
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                categoryMenu={capitalType}

            />
            {
                activeMenu === "category" ? capitalItemRender : <SubCategory/>
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
                options={paymentType}
                branches={branches}
                setSelectedBranches={setSelectedBranches}
            />
            <EditModal register={register} handleSubmit={handleSubmit} onClick={onChange} editModal={editModal}
                       setEditModal={setEditModal} setChangedImages={setChangedImages} changeItem={changeItem}/>


        </div>
    );
})


