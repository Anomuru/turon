import React, {useEffect, useState} from 'react';
import {Modal} from "shared/ui/modal";
import {Input} from "shared/ui/input";
import {Select} from "shared/ui/select";
import cls from "./vacancyWorkerPermission.module.sass";
import {Button} from "../../../../shared/ui/button";
import {API_URL, headers, useHttp} from "../../../../shared/api/base";
import { useDispatch, useSelector } from "react-redux";
import { getPermissionTables } from "../model/selectors/selectors";
import {fetchWorkerWithId,getWorkerId} from "features/vacancyModals/vacancyWorkPage/model";
import { fetchPermissionTable, postSelectedTable, postSelectedPermission } from "../model/vacancyWorkerPermissionThunk";
import {useParams} from "react-router-dom";
import {getBranch} from "../../../branchSwitcher";

export const VacancyWorkerPermission = React.memo(({active, setActive, onAddVacancy}) => {
    const [selectedWorkName, setSelectedWorkName] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [availablePermissions, setAvailablePermissions] = useState([]);
    const selectedJobID = useSelector(getWorkerId)
    const dispatch = useDispatch();
    // const {id} = useParams()
    const {id} = useSelector(getBranch)
    const permissionData = useSelector(getPermissionTables);
    const {request} = useHttp()
    const userId = selectedJobID.job?.length ? Number(selectedJobID.job[0].id) : null;


    useEffect(() => {
        dispatch(fetchPermissionTable());
    }, [dispatch]);

    const onChangeWorkName = (value) => {
        setSelectedWorkName(value);
        dispatch(postSelectedTable(value)).then((action) => {
            if (postSelectedTable.fulfilled.match(action)) {
                setAvailablePermissions(action.payload.permissions);
            } else {
                console.error("Permissionlada xato", action.payload);
            }
        });
    };

    const onChangePermission = (e, permission) => {
        if (e.target.checked) {
            setSelectedPermissions(prev => [...prev, permission]);
        } else {
            setSelectedPermissions(prev => prev.filter(item => item !== permission));
        }
    };
    // {
    //     "permissions": [1,2,3,4,]
    // }
    const handleAdd = () => {
        const newVacancy = {
            id: Date.now(),
            workName: selectedWorkName,
            workerNames: selectedPermissions.join(", ")
        };
        onAddVacancy(newVacancy);
        setSelectedPermissions([]);
        setSelectedWorkName("");
        dispatch(postSelectedTable(newVacancy))
        const selectedPermissionsIds = availablePermissions.permissions
            .filter(permission => selectedPermissions.includes(permission.name))
            .map(permission => permission.id);

        if (id) {
            dispatch(postSelectedPermission({
                id,
                selectedJobID: userId,
                selectedPermissions: selectedPermissionsIds
            })).then((action) => {
                if (postSelectedPermission.fulfilled.match(action)) {
                    dispatch(fetchWorkerWithId(id));

                    const newVacancy = {
                        id: Date.now(),
                        permissions: selectedPermissionsIds
                    };
                    onAddVacancy(newVacancy);
                    setSelectedPermissions([]);
                    setSelectedWorkName("");
                    setActive(false);
                } else {
                    console.error("Xatolik yuz berdi", action.payload);
                }
            });
        }
    };



    return (
        <Modal active={active} setActive={setActive}>
            <div className={cls.filter}>
                <h1>Add</h1>
                <div className={cls.filter__container}>
                    <Select
                        title={"Ish turi"}
                        extraClass={cls.filter__select}
                        onChangeOption={onChangeWorkName}
                        options={permissionData.tables}
                        required
                        value={selectedWorkName}
                    />
                    {availablePermissions.permissions?.map(permission => (
                        <div key={permission.id} className={cls.workerPermission}>
                            <h4>{permission.name}</h4>
                            <Input
                                style={{width: "20px", marginTop: "15px"}}
                                type={"checkbox"}
                                checked={selectedPermissions.includes(permission.name)}
                                onChange={(e) => onChangePermission(e, permission.name)}
                            />
                        </div>
                    ))}
                </div>
                <div className={cls.buttonHome}>
                    <Button children={"Add"} onClick={handleAdd}/>
                </div>
            </div>
        </Modal>
    );
});
