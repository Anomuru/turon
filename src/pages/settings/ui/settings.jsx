import cls from "./settings.module.sass"
import {useNavigate} from "react-router";

const settingsList = [
    {id: 1, title: "Contract", path: "/contract" ,  icon: "fa-file-contract",},
    {id: 2, title: "Rooms", path: "/rooms" , icon: "fa-house",},
]

export const Settings = () => {

    const navigate = useNavigate()

    return (
        <div className={cls.settings}>

            {settingsList.map(item => (
                <div
                    className={cls.settings__box}
                    onClick={() => {
                    navigate(`../../platform${item.path}`)
                }}>

                    <i className={`fa ${item.icon}`} style={{fontSize: "1.5rem"}}/>
                    {item.title}
                </div>
            ))}

        </div>
    );
};

