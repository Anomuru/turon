import React, {useEffect, useState} from "react";
import cls from "../location/locations.module.sass";
import {Button} from "../../../../shared/ui/button";
import classNames from "classnames";
import {ModalEducation, ModalLocation} from "../modals/modal";
import {getEducationName, getLocationLoading} from "../../model/selector/educationSelector";
import {useDispatch, useSelector} from "react-redux";
import {getEducationChange, getEducationThunk} from "../../model/thunk/educationThunk";

import {DefaultPageLoader} from "../../../../shared/ui/defaultLoader";
import {useForm} from "react-hook-form";
import {onDeleteEducation} from "../../model/slice/educationSlice";
import {API_URL, headers, useHttp} from "../../../../shared/api/base";
import {EducationCreate} from "../../../creates";
import {onAddAlertOptions} from "../../../../features/alert/model/slice/alertSlice";


export const Education = () => {

    const {register, handleSubmit, setValue} = useForm()
    const [activeLocationModal, setActiveLocationModal] = useState(false)
    const dispatch = useDispatch()
    const loading = useSelector(getLocationLoading)
    const getEducation = useSelector(getEducationName)
    const [isChange, setIsChange] = useState([])
    const [active, setActive] = useState(false)
    const [activeDel, setActiveDel] = useState(false)
    const {request} = useHttp()
    useEffect(() => {
        dispatch(getEducationThunk())
    }, [])


    const onChange = (data) => {
        dispatch(getEducationChange({data, id: isChange.id}))
        setActiveLocationModal(!activeLocationModal)
    }
    const onDelete = () => {

        request(`${API_URL}Language/language/${isChange.id}/`, "DELETE", JSON.stringify({id: isChange.id}), headers())
            .then(res => {
                dispatch(onDeleteEducation({id: isChange.id}))
                setActiveLocationModal(!activeLocationModal)
                setActive(false)
                setActiveDel(!activeDel)
                dispatch(onAddAlertOptions({
                    msg: res.msg,
                    type: "success",
                    status: true
                }))
            })
            .catch(err => {
                console.log(err)
            })

    }

    function compareById(a, b) {
        return a.id - b.id;
    }

    return loading ? <DefaultPageLoader/> : (
        <div className={cls.location}>
            <div className={cls.location__wrapper}>
                {getEducation && [...getEducation].sort(compareById).map(item => (
                    <div style={{width: "fit-content"}} className={cls.locationsBox}>
                        <div className={cls.locationHeader}>
                            <h2>{item?.name}</h2>
                            <Button onClick={() => {
                                setActiveLocationModal(!activeLocationModal)
                                setIsChange(item)
                                setValue("name", item.name)
                            }
                            } type={"editPlus"}
                                    children={<i className={"fa fa-pen"}/>}/>
                        </div>
                    </div>
                ))}
            </div>


            <i onClick={() => setActive(!active)} className={classNames("fa fa-plus", cls.plus)}></i>
            <ModalEducation
                onDelete={onDelete}
                register={register}
                handleSubmit={handleSubmit}
                onChange={onChange}
                activeModal={activeLocationModal}
                setActive={setActiveLocationModal}
                setActiveDel={setActiveDel}
                activeDel={activeDel}
            />
            <EducationCreate active={active} setActive={setActive}/>
        </div>
    );
};
