import {memo, useCallback, useEffect, useState} from 'react';
import classNames from "classnames";

import {Button} from "shared/ui/button";
import {Select} from "shared/ui/select";
import {Draggable} from "shared/ui/draggable";

import cls from "./timeTableFilters.module.sass";
import checkIcon from "shared/assets/icons/Checked.svg";

const classList = [
    {
        id: 1,
        value: "1-Class"
    },
    {
        id: 2,
        value: "2-Class"
    },
    {
        id: 3,
        value: "3-Class"
    },
    {
        id: 4,
        value: "4-Class"
    },
    {
        id: 5,
        value: "5-Class"
    },
    {
        id: 6,
        value: "6-Class"
    },
    {
        id: 7,
        value: "7-Class"
    },
    {
        id: 8,
        value: "8-Class"
    },
    {
        id: 9,
        value: "9-Class"
    },
    {
        id: 10,
        value: "10-Class"
    },
    {
        id: 11,
        value: "11-Class"
    }
]

const colorTypes = [
    {
        id: 1,
        value: "Green"
    },
    {
        id: 2,
        value: "Blue"
    },
    {
        id: 3,
        value: "Red"
    }
]

const typesList = [
    {
        id: 1,
        value: "Subjects"
    },
    {
        id: 2,
        value: "Teacher"
    },
    {
        id: 3,
        value: "Room"
    }
]
const typesPositionList = [15.55, 48.5, 80.7]

const subjectList = [
    {
        id: "1dragS",
        value: "Matematika",
        name: "subject"
    },
    {
        id: "2dragS",
        value: "Ingliz Tili",
        name: "subject"
    },
    {
        id: "3dragS",
        value: "Ona tili",
        name: "subject"
    },
    {
        id: "4dragS",
        value: "Geografiya",
        name: "subject"
    }
]

const teacherList = [
    {
        id: "1dragT",
        value: "Yusupova.Sh",
        name: "teacher"
    },
    {
        id: "2dragT",
        value: "Bozorov.S",
        name: "teacher"
    },
    {
        id: "3dragT",
        value: "Mavjudodov.Sh",
        name: "teacher"
    }
]

const roomList = [
    {
        id: "1dragR",
        value: "1.1",
        name: "room"
    },
    {
        id: "2dragR",
        value: "1.2",
        name: "room"
    },
    {
        id: "3dragR",
        value: "1.3",
        name: "room"
    },
    {
        id: "4dragR",
        value: "1.4",
        name: "room"
    },
    {
        id: "5dragR",
        value: "1.5",
        name: "room"
    },
    {
        id: "6dragR",
        value: "1.6",
        name: "room"
    }

]

export const TimeTableFilters = memo((props) => {

    const {
        activeDrag,
        setData,
        setActiveModal,
        setActive,
        setActiveDrop,
        setActiveDrag,
        classData,
        colorData,
        branchData,
        roomData,
        subjectData,
        teacherData
    } = props

    const [activeIdClass, setActiveIdClass] = useState([])
    const [activeIdColor, setActiveIdColor] = useState(1)
    const [activeIdType, setActiveIdType] = useState(1)
    const [currentDataType, setCurrentDataType] = useState([])

    useEffect(() => {
        setActive(activeIdClass)
        setActiveDrop(null)
        setActiveDrag(null)
    }, [activeIdClass])

    useEffect(() => {
        if (activeIdType === 1 && subjectData) {
            setCurrentDataType(subjectData)
        } else if (activeIdType === 2 && teacherData) {
            setCurrentDataType(teacherData)
        } else {
            setCurrentDataType(roomData)
        }
        setData(null)
    }, [activeIdType, teacherData, subjectData, roomData])

    useEffect(() => {
        if (currentDataType) {
            if (activeIdType === 2) {
                setData({
                    name: currentDataType.filter(item => item.id === activeDrag)[0]?.user?.name,
                    surname: currentDataType.filter(item => item.id === activeDrag)[0]?.user?.surname,
                    value: "teacher",
                    id: currentDataType.filter(item => item.id === activeDrag)[0]?.id
                })
            } else {
                setData({
                    name: currentDataType.filter(item => item.id === activeDrag)[0]?.name,
                    value: activeIdType === 1 ? "subject" : "room",
                    id: currentDataType.filter(item => item.id === activeDrag)[0]?.id
                })
            }
        }
    }, [activeDrag])

    const renderClassListData = () => {
        return classData?.map(item =>
            <div
                className={classNames(cls.classList__inner, {
                    [cls.active]: activeIdClass.includes(item.id)
                })}
                onClick={() => setActiveIdClass(arr => {
                    if (activeIdClass.includes(item.id)) {
                        return [...arr.filter(i => i !== item.id)]
                    } else return [...arr, item.id]
                })}
            >
                {
                    activeIdClass.includes(item.id) ? <img src={checkIcon} alt=""/> : null
                }
                {item.name}
            </div>
        )
    }

    const renderColorTypes = () => {
        return colorData?.map(item =>
            <div
                className={classNames(cls.colorList__inner, {
                    [cls.active]: activeIdColor === item.id
                })}
                onClick={() => setActiveIdColor(item.id)}
            >
                {item.value}
            </div>
        )
    }

    const renderTypesList = () => {
        return typesList.map(item =>
            <div
                className={classNames(cls.typesList__inner, {
                    [cls.active]: activeIdType === item.id
                })}
                onClick={() => setActiveIdType(item.id)}
            >
                {item.value}
            </div>
        )
    }

    const renderCurrentList = useCallback(() => {
        return currentDataType.map((item, i) =>
            <Draggable
                extraClass={cls.subjectsList__inner}
                id={item.id}
                data={{hello: 1}}
            >
                {activeIdType === 2 ? `${item?.user?.name} ${item?.user?.surname}` : item.name}
            </Draggable>
        )
    }, [activeIdType, currentDataType])

    const renderClass = renderClassListData()
    const renderColor = renderColorTypes()
    const renderType = renderTypesList()
    const renderCurrent = renderCurrentList()

    return (
        <div className={cls.timeTableFilters}>
            <div className={cls.navigators}>
                <div
                    id="unique-id"
                    className={cls.navigators__inner}
                >
                    <Button type={"simple"}>Class</Button>
                    <Button type={"simple-add"}>Patok</Button>
                </div>
                <Select
                    title={"Branch"}
                    options={branchData}
                />
            </div>
            <div
                onClick={() => setActiveModal(true)}
                className={cls.timeTableFilters__icon}
            >
                <i

                    className="fas fa-cog"
                />
            </div>
            <div className={cls.classList}>
                {renderClass}
            </div>
            <div className={cls.colorList}>
                {renderColor}
            </div>
            <div className={cls.typesList}>
                {renderType}
                <div
                    className={cls.typesList__active}
                    style={{left: `${typesPositionList[activeIdType - 1]}%`}}
                />
            </div>
            <div
                className={cls.subjectsList}
            >
                {renderCurrent}
            </div>
        </div>
    )
})
