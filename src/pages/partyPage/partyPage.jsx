import cls from "./partyPage.module.sass"
import {Radio} from "shared/ui/radio/index.js";
import {useState} from "react";
import {Button} from "shared/ui/button/index.js";

const partyHeader = [
    "Pariyalar",
    "Topshiriqlar",
    "Reyting"
]

export const PartyPage = () => {
    const [selectedHeader, setSelectedHeader] = useState(partyHeader[0]);

    return (
        <div className={cls.party}>

            <div className={cls.party__header}>
                <div className={cls.party__header_left}>
                    {partyHeader.map(item =>
                        <Radio children={item} onChange={() => setSelectedHeader(item)} checked={selectedHeader === item}/>
                    )}
                </div>
                <Button>
                    Yangi partiya qushish
                </Button>
            </div>
            <div className={cls.party__body}>


            </div>

        </div>
    );
};

