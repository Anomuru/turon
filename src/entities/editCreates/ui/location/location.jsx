import cls from "./locations.module.sass"
import {Button} from "shared/ui/button";
import React, {useEffect, useState} from "react";
import {ModalLocation} from "../modals/modal";
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {getSystemName} from "../../model/selector/systemSelector";

import {getLocationThunk} from "../../../creates/model/createThunk/createBranchThunk";
import {getLoading, getLocation} from "../../model/selector/locationSelector";
import {useForm} from "react-hook-form";
import {getSystemIdSelector} from "../../../creates/model/createSelector/locationSelector";
import {changeLocation, getSystemId} from "../../../creates/model/createThunk/createBranchThunk";
import {DefaultPageLoader} from "shared/ui/defaultLoader";
import {API_URL, headers, useHttp} from "../../../../shared/api/base";
import {onDeleteBranch} from "../../../creates/model/createSlice/branchCreateSlice";
import {EducationCreate, LocationCreate} from "../../../creates";
import {onAddAlertOptions} from "../../../../features/alert/model/slice/alertSlice";


export const Location = () => {

    const [activeLocationModal, setActiveLocationModal] = useState(false)
    const [isChange, setIsChange] = useState([])
    const {register, handleSubmit, setValue} = useForm()
    const getName = useSelector(getLocation)
    const loading = useSelector(getLoading)
    const dispatch = useDispatch()
    const [active, setActive] = useState(false)
    const [select, setSelect] = useState([])
    const [activeDel  ,setActiveDel] = useState(false)

    const systemId = useSelector(getSystemIdSelector)

    const {request} = useHttp()
    useEffect(() => {
        dispatch(getSystemId())
        dispatch(getLocationThunk())
    }, [])


    const onAdd = () => {

    }
    const onChange = (data) => {

        dispatch(changeLocation({system: select, data, id: isChange.id}))
        setValue("name", "");
        setValue("number", "");
        dispatch(getLocationThunk())
        setActiveLocationModal(!activeLocationModal)
    }


    const onDelete = () => {
        request(`${API_URL}Location/location_delete/${isChange.id}/`, "DELETE", JSON.stringify({id: isChange.id}), headers())
            .then(res => {
                setActiveLocationModal(!activeLocationModal)
                dispatch(onDeleteBranch({id: isChange.id}))
                setActiveDel(!activeDel)
                dispatch(onAddAlertOptions({
                    status: true,
                    type: "success",
                    msg: res.msg
                }))
            })
            .catch(err => {
                console.log(err)
            })


        // dispatch(getLocationThunk())
    }
    const renderLocation = () => {
        return getName && [...getName].sort(compareById).map(item => (
            <div className={cls.locationsBox}>
                <div className={cls.locationHeader}>
                    <h2>{item.name}</h2>
                    <Button onClick={() => {
                        setActiveLocationModal(!activeLocationModal)
                        setIsChange(item)
                        setValue("name", item.name)
                        setValue("number", item.number)
                    }}
                            type={"editPlus"}
                            children={<i className={"fa fa-pen"}/>}/>
                </div>
                <div className={cls.location__info}>
                    <h2>{item.number}</h2>
                    <span>
                            {item.old_id}
                        </span>
                </div>
            </div>
        ))
    }

    const render = renderLocation()

    function compareById(a, b) {
        return a.id - b.id;
    }

    return loading ? <DefaultPageLoader/> : (
        <div className={cls.location}>
            <div className={cls.location__wrapper}>
                {render}
            </div>

            <i onClick={() => setActive(!active)} className={classNames("fa fa-plus", cls.plus)}></i>

            <ModalLocation
                options={systemId}
                onDelete={onDelete}
                setSelect={setSelect}
                onChange={onChange}
                handleSubmit={handleSubmit}
                register={register}
                activeModal={activeLocationModal}
                setActive={setActiveLocationModal}
                setActiveDel={setActiveDel}
                activeDel={activeDel}

            />
            <LocationCreate loading={loading} setActive={setActive} active={active}/>
        </div>
    );
};

