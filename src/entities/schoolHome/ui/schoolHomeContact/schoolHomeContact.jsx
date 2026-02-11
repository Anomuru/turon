import cls from "./schoolHomeContact.module.sass"
import {useRef, useState} from "react";
import classNames from "classnames";
import {API_URL, headers, useHttp} from "shared/api/base";
import {changeHrefs, changeLocation} from "entities/centerHome/model/homeSlice";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";

import {Button} from "../../../../shared/ui/button";

const locations = [

    {name: "chorvoq"},
    {name: "toshkent"},
    {name: "chirchiq"},
]
export const SchoolHomeContact = () => {
    const {
        hrefs
    } = useSelector(state => state?.homeSlice)


    const sectionRef = useRef()

    const [activeHamburger, setActiveHamburger] = useState(false)

    const token = sessionStorage.getItem("token")
    const formData = new FormData()
    const {register, handleSubmit, setValue} = useForm()
    const dispatch = useDispatch()
    const {request} = useHttp()
    const [changeStatus, setChangeStatus] = useState(false)
    const [changeLocStatus, setChangeLocStatus] = useState(false)
    const [changeItem, setChangeItem] = useState({})
    const [changeLoc, setChangeLoc] = useState({})
    const [changeImage, setChangeImage] = useState({})

    const [selectedItem, setSelectedItem] = useState(locations[0].name)


    const onSubmitHrefs = (data) => {
        const res = {
            id: changeItem?.id,
            link: data?.link,
            name: data?.name
        }

        formData.append("res", JSON.stringify(res))
        formData.append("img", changeImage)
        request(`${API_URL}change_link`, "POST", formData, {"Authorization": "Bearer " + token})
            .then(res => {
                setChangeStatus(false)
                dispatch(changeHrefs(res?.link))
            })
            .catch(err => console.log(err))
        formData.delete("res")
        formData.delete("img")
    }

    const onSubmitLoc = (data) => {
        const res = {
            link: data?.locLink?.slice(
                data?.locLink.indexOf("src") + 5,
                data?.locLink.indexOf("style") - 7
            ),
            number: data?.locNumber,
            location: data?.locLocation
        }
        request(`${API_URL}change_locations/${changeLoc?.id}`, "POST", JSON.stringify(res), headers())
            .then(res => {
                setChangeLocStatus(false)
                setSelectedItem(res?.location)
                dispatch(changeLocation(res?.location))
            })
            .catch(err => console.log(err))
    }

    const onChangeModal = (id) => {
        hrefs.filter(item => {
            if (item.id === id) {
                setChangeItem(item)
                setValue("name", item.name)
                setValue("link", item.link)
            }
        })
        setChangeStatus(true)
    }

    const onChangeLoc = (id) => {
        locations.filter(item => {
            if (item.id === id) {
                setChangeLoc(item)
                setValue("locLink", item.link)
                setValue("locLocation", item.location)
                setValue("locNumber", item.number)
            }
        })
        setChangeLocStatus(true)
    }

    function compareById(a, b) {
        return a.id - b.id;
    }

    const renderInfo = () => {
        switch (selectedItem) {
            case "chirchiq" :
                return (
                    <>
                        <div className={cls.contact__locations_info_descr}>
                            <h2>Chirchiq</h2>
                            <div><i className={"fa-solid fa-phone "}/>
                                <span>+998 94 310 33 33</span>
                            </div>
                        </div>
                        <div className={cls.contact__locations_info_locations}>
                            <h2>Manzil</h2>
                            <span>Chirchiq shahar , Temur yo'lovchilar ko'chasi</span>
                        </div>
                    </>
                )
                break
            case "chorvoq" :
                return (
                    <>
                        <div className={cls.contact__locations_info_descr}>
                            <h2>chorvoq</h2>
                            <div><i className={"fa-solid fa-phone "}/>
                                <span>+998 99 476 33 36</span></div>
                        </div>
                        <div className={cls.contact__locations_info_locations}>
                            <h2>Manzil</h2>
                            <span>Bo'stonliq tumani ,  Beshtut MFY  </span>
                        </div>
                    </>
                )
                break
            case "toshkent" :
                return (
                    <>
                        <div className={cls.contact__locations_info_descr}>
                            <h2>toshkent</h2>
                            <div><i className={"fa-solid fa-phone "}/> <span>+998 20 000 55 55</span></div>
                        </div>
                        <div className={cls.contact__locations_info_locations}>
                            <h2>Manzil</h2>
                            <span>Toshkent shahar  , sergeli tumani shokir ariq ko'chasi</span>
                        </div>
                    </>
                )
                break
        }
    }
    const renderMaps = () => {
        switch (selectedItem) {
            case "chirchiq" :
                return <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d919.6208757171587!2d69.59200527278249!3d41.47180846473949!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38aefd001d09a3fb%3A0x3defb64edb2164f6!2sTuron%20Xalqaro%20Maktabi!5e1!3m2!1sru!2s!4v1733480085201!5m2!1sru!2s"
                    allowFullScreen="" loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"/>
                break
            case "toshkent" :
                return <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6002.598757406476!2d69.21117262052368!3d41.215245940243776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae61ab41db49f1%3A0x889c9f788b1c7aea!2sTuron%20xalqaro%20maktabi!5e0!3m2!1sru!2s!4v1733480259416!5m2!1sru!2s"
                    allowFullScreen="" loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"></iframe>
                break
            case "chorvoq" :
                return <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1029.630900409872!2d69.94854717827091!3d41.635367929634334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38af16a418831869%3A0x7cc9a20b5cbc2070!2s16-o&#39;rta%20maktab!5e1!3m2!1sru!2s!4v1733480158809!5m2!1sru!2s"
                    allowFullScreen="" loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"></iframe>
                break
        }
    }


    return (
        <div className={cls.contact} ref={sectionRef}>

            <div className={cls.contact__wrapper}>

                <div className={classNames(cls.contact__branches, {
                    [cls.branches_active]: activeHamburger
                })}>
                        <ul>
                            {selectedItem && [...locations].sort(compareById).map((item) => {
                                return (
                                    <li onClick={() => {
                                        setSelectedItem(item.name)
                                        setActiveHamburger(false)
                                    }}
                                        className={classNames(cls.contact__branches_list, {
                                            [cls.active]: selectedItem === item.name
                                        })}>

                                        <Button>{item.name}</Button>
                                    </li>
                                )
                            })}
                        </ul>
                </div>

                <div className={cls.contact__locations}>
                    <div className={cls.contact__locations_maps}>
                        <div className={cls.contact__locations_info}>
                            {renderInfo()}
                        </div>
                        {renderMaps()}
                    </div>

                </div>


            </div>
        </div>
    )
}