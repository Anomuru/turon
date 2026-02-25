import {memo, useEffect, useMemo, useState} from 'react';
import {useForm} from "react-hook-form";

import {Modal} from "shared/ui/modal";
import {Form} from "shared/ui/form";
import {Input} from "shared/ui/input";
import {Button} from "shared/ui/button";
import {MiniLoader} from "shared/ui/miniLoader";

import cls from "./timeTableChange.module.sass";
import {updateTimeTable} from "pages/timeTableListPage/model/timeTableListThunk/timeTableListThunk.js";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "shared/api/base.js";
import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {getSelectedLocations} from "features/locations/index.js";

export const TimeTableChange = memo((props) => {

    const {request} = useHttp()
    const dispatch = useDispatch()

    const branch = useSelector(getUserBranchId)
    const selectedBranch = useSelector(getSelectedLocations);
    const branchForFilter = selectedBranch?.id ?? branch;
    const {
        register,
        handleSubmit,
        setValue
    } = useForm()

    const {
        classInput,
        active,
        setActive,
        onSubmit,
        loading,
        onDelete
    } = props

    let startTime = useMemo(() => active?.start_time, [active])
    let finishTime = useMemo(() => active?.end_time, [active])
    let order = useMemo(() => active?.order, [active])
    let name = useMemo(() => active?.name, [active])
    let type = useMemo(() => active?.type, [active])

    const [selectedCI, setSelectedCI] = useState([])
    const [classInputData, setClassInputData] = useState([])

    useEffect(() => {
        setValue("start_time", startTime)
        setValue("end_time", finishTime)
        setValue("order", order)
        setValue("name", name)
        setValue("type", type)
    }, [active])


    const optionsType = [
        {
            name: "Yuqori",
            value: "high"
        },
        {
            name: "Boshlang'ich",
            value: "initial"
        },
    ]

    useEffect(() => {
        setSelectedCI(active?.types.map(item => ({value: item.id, label: item.name})))
    }, [active?.types])

    useEffect(() => {
        setClassInputData(
            classInput.map(item => {
                return {value: item.id, label: item.name}
            })
        )
    }, [])

    const onSubmitChange = (dataForm) => {
        dispatch(updateTimeTable({id: active?.id, obj: dataForm, branch: branchForFilter}))
        dispatch(onAddAlertOptions({
            type: "success",
            status: true,
            msg: `malumotlari o'zgardi`
        }))
        // request(`${API_URL}SchoolTimeTable/hours-list-update/${active?.id}`, "PATCH", JSON.stringify(dataForm), headers())
        //     .then(res => console.log(res))
        setActive(false)
    }

    return (
        <Modal
            active={active}
            setActive={setActive}
        >
            <Form
                id={"changeTime"}
                // onSubmit={handleSubmit(onSubmit)}
                typeSubmit={""}
            >
                <div className={cls.change}>
                    <h1>Change time</h1>
                    <Input
                        extraClassName={cls.change__input}
                        placeholder={"Boshlanish vaqti"}
                        register={register}
                        name={"start_time"}
                        // value={active ? startTime : null}
                        type={"time"}
                        required
                    />
                    <Input
                        extraClassName={cls.change__input}
                        placeholder={"Tugash vaqti"}
                        register={register}
                        name={"end_time"}
                        // value={active ? finishTime : null}
                        type={"time"}
                        required
                    />
                    <Input
                        extraClassName={cls.change__input}
                        placeholder={"Order"}
                        register={register}
                        name={"order"}
                        // value={active ? order : null}
                        type={"number"}
                        required
                    />
                    <Input
                        extraClassName={cls.change__input}
                        placeholder={"Name"}
                        register={register}
                        name={"name"}
                        // value={name}
                        required
                    />
                    {/*<AnimatedMulti*/}
                    {/*    options={classInputData}*/}
                    {/*    onChange={setSelectedCI}*/}
                    {/*    value={selectedCI}*/}
                    {/*    fontSize={15}*/}
                    {/*/>*/}

                    {/*<Select*/}
                    {/*    name={"type"}*/}
                    {/*    register={register}*/}
                    {/*    required*/}
                    {/*    options={optionsType}*/}
                    {/*    defaultValue={type}*/}
                    {/*/>*/}
                    {
                        loading ? <MiniLoader/> :
                            <div style={{display: "flex", gap: "1rem"}}>
                                <Button
                                    onClick={handleSubmit(onSubmitChange)}
                                    extraClass={cls.change__btn}
                                    type={"simple"}
                                >
                                    O'zgartirish
                                </Button>
                                <Button
                                    onClick={handleSubmit(onDelete)}
                                    extraClass={cls.change__btn}
                                    type={"danger"}
                                >
                                    O'chirish
                                </Button>
                            </div>
                    }

                </div>
            </Form>
        </Modal>
    )
})
