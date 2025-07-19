

import cls from "./schoolLeaderShip.module.sass"
export const SchoolLeadershipTeam = ({data}) => {

    const renderDate = () => {
        return data.map(item => (
            <div className={cls.leaderShip__wrapper_box}>
                <img src={item.img} alt=""/>

                <div className={cls.leaderShip__wrapper_box_info}>
                    <div className={cls.leaderShip__wrapper_box_info_name}>
                        {item.name}
                    </div>
                    <div className={cls.leaderShip__wrapper_box_info_job}>
                        {item.job}
                    </div>
                    <div className={cls.leaderShip__wrapper_box_info_descr}>
                        {item.descr}
                    </div>
                </div>

            </div>
        ))
    }


    const render = renderDate()

    return (
        <div className={cls.leaderShip}>
            <div className={cls.leaderShip__header}>
                <div className={cls.leaderShip__header_span}>
                    OUR TEAM
                </div>
                <div className={cls.leaderShip__header_title}>
                    Leadership Team
                </div>
                <div className={cls.leaderShip__header_descr}>

                    Bizning rahbariyat jamoamiz – bu yuqori tajribaga ega, ta’lim sohasida chuqur bilimga ega bo‘lgan va maktabimizning asosiy maqsadlarini amalga oshirish uchun jonkuyar mutaxassislar guruhi.
                </div>
            </div>

            <div className={cls.leaderShip__wrapper}>

                {render}
            </div>

        </div>
    );
};

