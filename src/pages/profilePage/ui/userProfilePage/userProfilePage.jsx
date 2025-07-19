import {getUserProfileLoading} from "entities/profile/userProfile/model/userProfileSelector";
import {changeUserProfile, changingUserProfile} from "entities/profile/userProfile/model/userProfileSlice";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import {useParams} from "react-router";
import classNames from "classnames";
import {API_URL, headers, headersImg, useHttp} from "shared/api/base";
import {DefaultPageLoader} from "shared/ui/defaultLoader";

import {ChangeInfoForm} from "widgets/changeInfoForm";
import {Pagination} from "features/pagination";
import {getSearchValue} from "features/searchInput";
import {ImageCrop} from "features/imageCrop";
import {
    UserProfileChange,
    UserProfileInfo,
    UserProfileSalaryList,
    UserProfileSalaryListInner,
    getUserSalaryInnerData,
    getUserSalaryData,
    getUserProfileData,
    changeUserProfileImage,
    changeUserProfileData,
    fetchUserProfileData
} from "entities/profile/userProfile";

import cls from "./userProfilePage.module.sass";
import {getSystem} from "../../../../features/themeSwitcher";
import {getBranch} from "../../../../features/branchSwitcher";

export const UserProfilePage = () => {

    useEffect(() => {
        dispatch(fetchUserProfileData(id))
    }, [])

    const {id} = useParams()
    // const {id} = useSelector(getBranch)
    const {request} = useHttp()
    const dispatch = useDispatch()
    const userData = useSelector(getUserProfileData)
    const userLoading = useSelector(getUserProfileLoading)
    const salaryData = useSelector(getUserSalaryData)
    const salaryInnerData = useSelector(getUserSalaryInnerData)
    const search = useSelector(getSearchValue)
    const system = useSelector(getSystem)
    const data = useMemo(() => [
        {
            name: "name",
            placeholder: "Ism",
            defaultValue: userData?.name
        },
        {
            name: "surname",
            placeholder: "Familiya",
            defaultValue: userData?.surname
        },
        {
            name: "father_name",
            placeholder: "Otasinig ismi",
            defaultValue: userData?.father_name
        },
        {
            name: "phone",
            placeholder: "Telefon raqami",
            defaultValue: userData?.phone
        },
        {
            name: "birth_date",
            placeholder: "Tug'ilgan sana",
            defaultValue: userData?.birth_date
        }
    ], [userData])

    const [activeModal, setActiveModal] = useState("")
    const [activeList, setActiveList] = useState(false)
    const [currentStatus, setCurrentStatus] = useState(false)

    let PageSize = useMemo(() => 10, [])
    const [currentTableData, setCurrentTableData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    const searchedUsers = useMemo(() => {
        const filteredHeroes = activeList ? salaryInnerData.slice() : salaryData?.slice()
        setCurrentPage(1)

        if (!search) return filteredHeroes

        return filteredHeroes.filter(item =>
            item.name?.toLowerCase().includes(search.toLowerCase())
        )
    }, [salaryData, setCurrentPage, search, activeList])

    const onSubmitChangeInfo = (data) => {
        dispatch(changingUserProfile())
        request(`${API_URL}Users/users/update/${id}/`, "PATCH", JSON.stringify(data), headers())
            .then(res => {

                dispatch(changeUserProfile(res))
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: `Malumotlar o'zgardi`
                }))
                setCurrentStatus(true)
            })
            .catch(err => console.log(err))
        // dispatch(changeUserProfileData({id, data}))

    }

    const onSubmitChangeImage = (data) => {
        dispatch(changingUserProfile())
        const formData = new FormData
        formData.append("profile_img", data)
        request(`${API_URL}Users/users/update/${id}/`, "PATCH", formData, headersImg())
            .then(res => {

                dispatch(changeUserProfile(res))
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: `Rasm o'zgardi`
                }))
                setCurrentStatus(true)
            })
        // dispatch(changeUserProfileImage({id, data}))
        // dispatch(onAddAlertOptions({
        //     type: "success",
        //     status: true,
        //     msg: `Rasm o'zgardi`
        // }))
        // setCurrentStatus(true)
    }

    if (userLoading) return <DefaultPageLoader/>
    return (
        <div className={cls.userProfilePage}>
            <UserProfileInfo
                setActive={setActiveModal}
                setStatus={setCurrentStatus}
                data={userData}
                system={system}
            />
            <div className={cls.userProfilePage__inner}>
                <h1
                    className={classNames(cls.userProfilePage__title, {
                        [cls.active]: activeList
                    })}
                    onClick={() => setActiveList(false)}
                >
                    Salary
                </h1>
                {
                    activeList
                        ?
                        <UserProfileSalaryListInner data={currentTableData}/>
                        :
                        <UserProfileSalaryList
                            data={currentTableData}
                            setActive={setActiveList}
                        />
                }
                <Pagination
                    setCurrentTableData={setCurrentTableData}
                    users={searchedUsers}
                    currentPage={currentPage}
                    pageSize={PageSize}
                    onPageChange={page => {
                        setCurrentPage(page)
                    }}
                />
            </div>
            <ChangeInfoForm
                active={currentStatus ? false : activeModal === "changeInfo"}
                setActive={setActiveModal}
                onSubmit={onSubmitChangeInfo}
                data={data}
            />
            {/*<UserProfileChange*/}
            {/*    setActive={setActiveModal}*/}
            {/*    active={currentStatus ? false : activeModal === "changeInfo"}*/}
            {/*    onSubmit={handleSubmit(onSubmitChangeInfo)}*/}
            {/*    register={register}*/}
            {/*    setValue={setValue}*/}
            {/*    data={userData}*/}
            {/*/>*/}
            <ImageCrop
                setActive={setActiveModal}
                active={currentStatus ? false : activeModal === "changeImage"}
                currentImage={userData?.profile_img}
                setNewImage={onSubmitChangeImage}
            />
        </div>
    )
}
