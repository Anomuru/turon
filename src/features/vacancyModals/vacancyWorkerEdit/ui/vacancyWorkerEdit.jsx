import React, { useEffect, useState } from 'react';
import { Modal } from "shared/ui/modal";
import { EditableCard } from "shared/ui/editableCard";
import { AnimatedMulti } from "../../../workerSelect";
import { useSelector, useDispatch } from "react-redux";
import cls from "./vacancyWorkerEdit.module.sass";
import { getVacancySource, vacancyWorkerGetThunk } from "entities/vacancy/ui/vacancyWorkerList";
import { Form } from "shared/ui/form";
import { useForm } from "react-hook-form";
import { userSetPermissionThunk} from "entities/vacancy/ui/vacancyWorkerList";


export const VacancyWorkerEdit = React.memo(({ active, setActive, user_id }) => {
    const { register, handleSubmit, setValue } = useForm();
    const [selectedSystems, setSelectedSystems] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [selectedBranches, setSelectedBranches] = useState([]);
    const dispatch = useDispatch();
    const getBranches = useSelector(getVacancySource);
    const locations = useSelector(state => state.userSetPermissionSlice.locations);
    const branches = useSelector(state => state.userSetPermissionSlice.branches);

    useEffect(() => {
        dispatch(vacancyWorkerGetThunk());
    }, [dispatch]);



    const systemsOptions = getBranches?.systems?.map(system => ({
        value: system.id,
        label: system.name,
    }));

    const onSubmit = async () => {
        const newPermission = {
            user: user_id,
            systems: selectedSystems.map(system => system.value),
            locations: selectedLocations.map(location => location.value),
            branchs: selectedBranches.map(branch => branch.value),
        };
        try {
            await dispatch(userSetPermissionThunk(newPermission));
        } catch (error) {
            console.error("An error occurred:", error);
        }
        setActive(!active)
    };

    const handleSystemChange = (selectedSystems) => {
        setSelectedSystems(selectedSystems);

        const selectedSystemIds = selectedSystems.map(system => system.value);
        // dispatch(fetchLocationsForSystemsThunk(selectedSystemIds));
    };

    const handleLocationChange = (selectedLocations) => {
        setSelectedLocations(selectedLocations);

        // dispatch(fetLocationsForBranchesThunk(selectedLocationIds));
    };

    const safeData = Array.isArray(locations) ? locations : [locations];
    const locationOptions = safeData?.map(location => ({
        value: location.id,
        label: location.name,
    }));
    const branchData = Array.isArray(branches) ? branches : [branches];
    const branchesOptions = branchData?.map(branch => ({
        value: branch?.id,
        label: branch?.name,
    }));

    return (
        <Modal active={active} setActive={setActive}>
            <Form onSubmit={handleSubmit(onSubmit)} extraClassname={cls.filter}>
                <EditableCard extraClass={cls.cardSelect}>
                    <AnimatedMulti
                        options={systemsOptions}
                        value={selectedSystems}
                        onChange={handleSystemChange}
                    />
                </EditableCard>
                <EditableCard extraClass={cls.cardSelect}>
                    <AnimatedMulti
                        options={locationOptions}
                        value={selectedLocations}
                        onChange={handleLocationChange}
                    />
                </EditableCard>
                <EditableCard extraClass={cls.cardSelect}>
                    <AnimatedMulti
                        options={branchesOptions}
                        value={selectedBranches}
                        onChange={setSelectedBranches}
                    />
                </EditableCard>

            </Form>
        </Modal>
    );
});