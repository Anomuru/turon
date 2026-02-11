import cls from "./workUs.module.sass"
import backImg from "shared/assets/images/school.svg"
import {Button} from "../../../../shared/ui/button";
import teen from "shared/assets/images/teenyicons_school-outline.svg"
import akar from "shared/assets/images/akar-icons_door.svg"
import mage from "shared/assets/images/mage_light-bulb.svg"
import clarity from "shared/assets/images/clarity_group-line.svg"
import fluent from "shared/assets/images/fluent-mdl2_diet-plan-notebook.svg"
const data = [
    {title: "Maktab" , img:  teen},
    {title: "Qabul qilishlari" , img:  akar},
    {title: "MAKTAB MISSIYASI VA VIZIYON" , img:  mage},
    {title: "Bizning jamoat" , img:  clarity},
    {title: "O'QUV REJASI" , img:  fluent},
]

export const WorkUs = () => {

    const render = () => {
        return data.map(item => (
            <div className={cls.box}>
                <img src={item.img} alt=""/>
                <h3>{item.title}</h3>
            </div>
        ))
    }
    return (
        <>
            <div style={{background: `url(${backImg})`}} className={cls.school}>
                <div className={cls.title}>
                    MAKTAB
                </div>
                <div className={cls.descr}>
                    Prezident maktabi ixtisoslashtirilgan davlat ta’lim muassasasi bo‘lib, uning faoliyati iqtidorli
                    bolalarni aniqlash va yuqori malakali mutaxassislar tomonidan tarbiyalashga qaratilgan. Maktab Toshkent
                    viloyatining mahalliy va xalqaro hamjamiyatlari uchun yuqori sifatli akademik va maktabdan tashqari
                    dasturni taqdim etadi. O‘zbekiston Respublikasi Prezidentining 2019-yil 20-fevraldagi “Qoraqalpog‘iston
                    Respublikasi, viloyatlar va Toshkent shahrida Prezident maktablarini tashkil etish chora-tadbirlari
                    to‘g‘risida”gi PQ-4199-son qaroriga muvofiq 2021-yilda tashkil etilgan. Ta'lim ingliz va o'zbek
                    tillarida olib boriladi. Hozir maktabimizda 168 nafar o‘quvchi tahsil oladi. Hozir maktabda uchta kampus
                    mavjud: Akademik blok, sport maydonchasi va internat bo'limi.
                </div>
                <Button>
                    Apply
                </Button>
            </div>


                <div className={cls.box_main}>
                    {render()}
                </div>

        </>
    );
};

