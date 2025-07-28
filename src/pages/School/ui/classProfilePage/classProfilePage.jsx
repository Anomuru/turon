import {fetch} from "entities/profile/studentProfile";
import {ClassProfileStudentsForm} from "features/classProfile";
import {useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router";

import {
    ClassProfileRating,
    ClassProfileCoinModal,
    ClassProfileNavigators,
    ClassProfileSalaryModal,
    ClassProfileStudentsList
} from "entities/School/classProfile";
import {fetchGroupProfile, getGroupProfileData} from "entities/profile/groupProfile";
import {Button} from "shared/ui/button";


import cls from "./classProfilePage.module.sass";
import {getBranch} from "../../../../features/branchSwitcher";

export const ClassProfilePage = () => {

    // const {id} = useParams()
    const {id} = useSelector(getBranch)
    const dispatch = useDispatch()
    const navigation = useNavigate()
    const {handleSubmit, register} = useForm()
    const data = useSelector(getGroupProfileData)

    const [activeCoin, setActiveCoin] = useState(false)
    const [activeSalary, setActiveSalary] = useState(false)

    const onSubmitCoin = (data) => {

    }

    const onSubmitSalary = (data) => {

    }

    useEffect(() => {
        dispatch(fetchGroupProfile({id}))
    }, [])

    return (
        <div className={cls.classProfilePage}>
            <Button
                extraClass={cls.classProfilePage__btn}
                onClick={() => navigation("../molasses")}
            >
                <i className="fas fa-dna"/>
                Patok
            </Button>
            <ClassProfileNavigators setActive={() => setActiveCoin(true)}/>
            {/*<ClassProfileRating/>*/}
            <ClassProfileStudentsForm/>
            {/*<ClassProfileStudentsList/>*/}
            <ClassProfileCoinModal
                active={activeCoin}
                setActive={setActiveCoin}
                onSubmit={handleSubmit(onSubmitCoin)}
                register={register}
            />
            <ClassProfileSalaryModal
                active={activeSalary}
                setActive={setActiveSalary}
                register={register}
                onSubmit={handleSubmit(onSubmitSalary)}
            />
        </div>
    )
}
