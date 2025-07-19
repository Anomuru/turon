import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import {changeSystemName, getSystemThunk} from "../../model/thunk/systemThunk";
import {getLoading, getSystemName} from "../../model/selector/systemSelector";
import cls from "../location/locations.module.sass";
import {Button} from "shared/ui/button";
import {ModalSystem} from "../modals/modal";
import classNames from "classnames";
import {useNavigate, useNavigation} from "react-router";
import {DefaultLoader, DefaultPageLoader} from "../../../../shared/ui/defaultLoader";
import {API_URL, headers, useHttp} from "../../../../shared/api/base";
import {onDeleteCapitalReducer} from "../../model/slice/systemSlice";
import {SystemCreate} from "../../../creates";
import {Form} from "../../../../shared/ui/form";
import {Input} from "../../../../shared/ui/input";
import {Modal} from "../../../../shared/ui/modal";
import {postCreateSystemThunk} from "../../../creates/model/createThunk/createThunk";
import {onAddAlertOptions} from "../../../../features/alert/model/slice/alertSlice";

export const System = () => {
    const {register, handleSubmit, setValue} = useForm();
    const [activeLocationModal, setActiveLocationModal] = useState(false);
    const [isChange, setIsChange] = useState(null);
    const getName = useSelector(getSystemName);
    const dispatch = useDispatch();
    const navigation = useNavigate()
    const [active, setActive] = useState(false)
    const loading = useSelector(getLoading)
    const {request} = useHttp()
    const [activeDel , setActiveDel] = useState(false)
    useEffect(() => {
        dispatch(getSystemThunk());
    }, [dispatch]);

    const onChange = (data) => {
        dispatch(changeSystemName({data, id: isChange.id}));
        setActiveLocationModal(!activeLocationModal)
        setValue("name", "");
        setValue("number", "");

    };


    const onClick = (data) => {
        dispatch(postCreateSystemThunk(data))
        dispatch(getSystemThunk());

        setValue("name", "")
        setValue("number", "")
        setActive(!active)
    }


    const onDelete = () => {
        request(`${API_URL}System/systems/delete/${isChange.id}/`, "DELETE", JSON.stringify({id: isChange.id}), headers())
            .then(res => {
                setActiveLocationModal(!activeLocationModal)
                setActiveDel(!activeDel)
                dispatch(onAddAlertOptions({
                    type: "success",
                    msg:res.msg,
                    status: true
                }))
                dispatch(onDeleteCapitalReducer({id: isChange.id}))
            })
            .catch(err => {
                console.log(err)
            })


    }
    const renderSystem = () => {
        return getName && [...getName].sort(compareById).map(item => (
            <div key={item.id} className={cls.locationsBox}>
                <div className={cls.locationHeader}>
                    <h2>{item?.name}</h2>
                    <Button
                        onClick={() => {
                            setActiveLocationModal(!activeLocationModal);
                            setIsChange(item);
                        }}
                        type={"editPlus"}
                        children={<i className={"fa fa-pen"}/>}
                    />
                </div>
                <div className={cls.location__info}>
                    <span>{item?.number}</span>
                </div>
            </div>
        ));
    };

    function compareById(a, b) {
        return a.id - b.id;
    }

    return loading ? <DefaultLoader/> : (
        <div>
            <div className={cls.location}>
                <div className={cls.location__wrapper}>
                    {renderSystem()}
                </div>
                <i
                    onClick={() => setActive(!active)}
                    className={classNames("fa fa-plus", cls.plus)}
                />
                <ModalSystem
                    register={register}
                    handleSubmit={handleSubmit}
                    onChange={onChange}
                    activeModal={activeLocationModal}
                    setActive={setActiveLocationModal}
                    onDelete={onDelete}
                    activeDel={activeDel}
                    setActiveDel={setActiveDel}

                />
            </div>
            <Modal active={active} setActive={setActive}>
                <div className={cls.formMain}>
                    <div className={cls.formBox}>
                        <h1 className={cls.formTitle}>System</h1>
                        <Form onSubmit={handleSubmit(onClick)} extraClassname={cls.form} typeSubmit={""}>
                            <Input register={register} name={"name"} title={"System"}/>
                            <Input type={"number"} register={register} name={"number"} title={"Number"}/>
                            <Button children={"create"}/>
                        </Form>
                    </div>
                </div>
            </Modal>
        </div>
    );
};