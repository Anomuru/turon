import cls from "../location/locations.module.sass";
import {Button} from "shared/ui/button";
import {ModalBranch} from "../modals/modal";
import React, {useEffect, useState} from "react";
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {changeBranchName, getBranchThunk} from "../../model/thunk/branchThunk";
import {getLoading, getLocations} from "../../model/selector/branchSelector";
import {useForm} from "react-hook-form";
import {getLocation} from "../../model/selector/locationSelector";
import {getLocationThunk} from "../../../creates/model/createThunk/createBranchThunk";
import {API_URL, headers, useHttp} from "../../../../shared/api/base";

import {onDeleteBranch} from "../../model/slice/branchSlice";
import {DefaultPageLoader} from "../../../../shared/ui/defaultLoader";
import {Form} from "../../../../shared/ui/form";
import {Select} from "../../../../shared/ui/select";
import {Input} from "../../../../shared/ui/input";
import {BranchCreate} from "../../../creates";
import {onAddAlertOptions} from "../../../../features/alert/model/slice/alertSlice";

export const Branch = () => {
    const [activeLocationModal, setActiveLocationModal] = useState(false)
    const {register, setValue, handleSubmit} = useForm()
    const getName = useSelector(getLocations)
    const dispatch = useDispatch()
    const [isChange, setIsChange] = useState(null);
    const getLocationList = useSelector(getLocation)
    const [active , setActive] = useState(false)
    const [select, setSelect] = useState([])
    const [activeDel , setActiveDel] = useState(false)
    const {request} = useHttp()

    const loading = useSelector(getLoading)
    useEffect(() => {
        dispatch(getBranchThunk())
    }, [])

    useEffect(() => {
        dispatch(getLocationThunk())
    }, [])
    const onAdd = () => {
        setActive(!active)
    }
    const onChange = (data) => {
        dispatch(changeBranchName({location_text: select, data, id: isChange.id,}));
        setActiveLocationModal(!activeLocationModal)
        setValue("name", "");
        setValue("number", "");
    }
    const renderBranch = () => {
            return getName && [...getName].sort(compareById).map(item => (
            <div className={cls.locationsBox}>
                <div className={cls.locationHeader}>
                    <h2>{item?.name}</h2>
                    <Button
                        onClick={() => {
                            setActiveLocationModal(!activeLocationModal);
                            setIsChange(item);
                            setValue("name", item.name)
                            // setValue("phone_number" , item.phone_number)
                            setValue("number", item.number)
                            setValue("location_text", item.location_text)
                        }}
                        type={"editPlus"}
                        children={<i className={"fa fa-pen"}/>}
                    />
                </div>
                <div className={cls.location__info}>
                    <h2>{item?.number}</h2>
                    {/*<h2>{item?.phone_number}</h2>*/}
                    <span>
                            {item.location_text}
                        {/*{item.changeLocations?.name}*/}
                    </span>
                </div>
            </div>

        ))
    }

    function compareById(a, b) {
        return a.id - b.id;
    }

    const onDelete = () => {
        request(`${API_URL}Branch/branch_delete/${isChange.id}/`, "DELETE", JSON.stringify({id: isChange.id}), headers())
            .then(res => {
                console.log(res)
                setActiveLocationModal(!activeLocationModal)
                dispatch(onDeleteBranch({id: isChange.id}))
                setActiveDel(false)
                dispatch(onAddAlertOptions({
                    status: true,
                    type: "success",
                    msg: res.msg
                }))
            })
            .catch(err => {
                console.log(err)
            })



    }

    return loading ? <DefaultPageLoader/> : (
        <div>
            <div className={cls.location}>
                <div className={cls.location__wrapper}>
                    {renderBranch()}
                </div>


                <i onClick={onAdd} className={classNames("fa fa-plus", cls.plus)}></i>


                <ModalBranch
                    activeDel={activeDel}
                    setActiveDel={setActiveDel}
                    onDelete={onDelete}
                    select={select}
                    setSelected={setSelect}
                    options={getLocationList}
                    activeModal={activeLocationModal}
                    setActive={setActiveLocationModal}
                    register={register}
                    onChange={onChange}
                    handleSubmit={handleSubmit}/>
            </div>
            <BranchCreate loading={loading} setActive={setActive} active={active}/>
        </div>
    );
};

