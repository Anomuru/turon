import cls from "src/pages/groupsPage/ui/groupObserve/groupObserve.module.sass"
import {useEffect, useState} from "react";
import classNames from "classnames";
import {GroupLessonPlan, GroupObserve, ObservedDates} from "features/groupProfile/index.js";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {groupObserveReducer} from "features/groupProfile/model/groupObserve/groupObserveSlice.js";
import {useDispatch} from "react-redux";
import {
    fetchGroupObserve,
    fetchGroupObserveOption
} from "features/groupProfile/model/groupObserve/groupObserveThunk.js";

const observeItem = [
    {name: "observe", label: "Observe", icon: "fa fa-user-check"},
    {name: "lessonPlan", label: "Lesson plan", icon: "fa fa-list-ul"},
    {name: "observedDates", label: "Observed dates", icon: "fa fa-list-ul"},
];

const reducers = {
    groupObserveSlice: groupObserveReducer
};

export const GroupObservePage = () => {

    const [active, setActive] = useState(localStorage.getItem("activeObserveTab") || observeItem[0].name);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchGroupObserve());
        dispatch(fetchGroupObserveOption());
    }, [dispatch]);


    useEffect(() => {
        localStorage.setItem("activeObserveTab", active);
    }, [active]);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.observe}>
                <div className={cls.observe__header}>
                    {observeItem.map(item => (
                        <div
                            key={item.name}
                            onClick={() => setActive(item.name)}
                            className={classNames(
                                cls.observe__header_item,
                                { [cls.active]: active === item.name }
                            )}
                        >
                            {item.label}
                            <i className={item.icon}/>
                        </div>
                    ))}
                </div>

                {active === "observe" ? (
                    <GroupObserve/>
                ) : active === "lessonPlan" ? (
                    <GroupLessonPlan/>
                ) : (
                    <ObservedDates/>
                )}
            </div>
        </DynamicModuleLoader>
    );
};
