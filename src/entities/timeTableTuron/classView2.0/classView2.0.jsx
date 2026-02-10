import React, {useCallback, useMemo, useState} from "react";
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import cls from "./TimeTableClassView.module.sass";

const ROW_HEIGHT = 64;
const COL_WIDTH = 180;
const LABEL_WIDTH = 140;
const MAX_FLOW_COLUMNS = 3;

function hexToBrightness(hex) {
    if (!hex) return 0;
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, '');

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

export const TimetableGrid = ({classes, hours , setActive}) => {
    const [scale, setScale] = useState(0.7);
    const [openMoreKey, setOpenMoreKey] = useState(null);

    const fontScale = Math.max(0.75, Math.min(1, 1 / scale));

    const classIndexMap = useMemo(() => {
        const map = new Map();
        if (classes) {
            classes.forEach((c, i) => map.set(c.id, i));
        }
        return map;
    }, [classes]);

    const flowAnchors = useMemo(() => {
        const map = new Map();

        if (!classes) return map;

        for (const clsItem of classes) {
            if (!clsItem.lessons) continue;

            for (const lesson of clsItem.lessons) {
                if (!lesson.is_flow) continue;
                if (!lesson.group || !lesson.group.classes) continue;

                const key = `${lesson.id}-${lesson.hours}`;
                if (map.has(key)) continue;

                const rows = lesson.group.classes
                    .map((cid) => classIndexMap.get(cid))
                    .filter((v) => v !== undefined)
                    .sort((a, b) => a - b);

                if (!rows.length) continue;

                map.set(key, {
                    lesson,
                    startRowIndex: rows[0],
                    spanCount: rows.length,
                });
            }
        }
        return map;
    }, [classes, classIndexMap]);

    const getFlowAnchorsForCell = useCallback(
        (classId, hourId) => {
            const rowIndex = classIndexMap.get(classId);
            if (rowIndex === undefined) return [];

            return Array.from(flowAnchors.values()).filter(
                (a) => a.lesson.hours === hourId && a.startRowIndex === rowIndex
            );
        },
        [flowAnchors, classIndexMap]
    );

    const isFlowOccupied = useCallback(
        (classId, hourId) => {
            const rowIndex = classIndexMap.get(classId);
            if (rowIndex === undefined) return false;

            return Array.from(flowAnchors.values()).some((a) => {
                if (a.lesson.hours !== hourId) return false;
                if (!a.lesson.group?.classes?.includes(classId)) return false;

                return (
                    rowIndex > a.startRowIndex &&
                    rowIndex < a.startRowIndex + a.spanCount
                );
            });
        },
        [flowAnchors, classIndexMap]
    );

    const getNonFlowLesson = useCallback(
        (clsItem, hourId) =>
            clsItem.lessons?.find(
                (l) => !l.is_flow && l.hours === hourId
            ) ?? null,
        []
    );

    if (!classes || !hours) return null;

    return (
        <div className={cls.container}>

            <i onClick={() => {
                setActive(false)
                console.log("dasdsa")
            }} style={{position: "absolute" , right: "3rem" , color: "black" , fontSize: "3rem" , top: "3rem" , zIndex: "222222222"}} className={"fa fa-times"}/>
            <TransformWrapper
                initialScale={0.7}
                minScale={0.3}
                maxScale={3}
                doubleClick={{disabled: true}}
                onTransformed={(e) => setScale(e.instance.transformState.scale)}
            >
                <TransformComponent>
                    <div className={cls.contentWrapper}>
                        {/* ================= HEADER ================= */}
                        <div
                            className={cls.headerRow}
                            style={{marginLeft: LABEL_WIDTH}}
                        >
                            {hours.map((h) => (
                                <div
                                    key={h.id}
                                    className={cls.headerCell}
                                    style={{
                                        width: COL_WIDTH,
                                        height: ROW_HEIGHT,
                                        fontSize: 12 * fontScale,
                                    }}
                                >
                                    <span>{h.start_time}</span>
                                    <span
                                        style={{fontSize: 10 * fontScale}}
                                    >
                                        {h.end_time}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {classes.map((clsItem) => (
                            <div key={clsItem.id} className={cls.classRow}>
                                {/* CLASS LABEL */}
                                <div
                                    className={cls.classLabel}
                                    style={{
                                        width: LABEL_WIDTH,
                                        height: ROW_HEIGHT,
                                        background: clsItem.color,
                                        color:
                                            hexToBrightness(clsItem.color) > 125 ? "#000" : "#fff",
                                        fontSize: 13 * fontScale,
                                    }}
                                >
                                    {clsItem.name}
                                </div>

                                {hours.map((h) => {
                                    const flows = getFlowAnchorsForCell(clsItem.id, h.id);
                                    const occupied = isFlowOccupied(clsItem.id, h.id);
                                    const nonFlow = getNonFlowLesson(clsItem, h.id);

                                    const visibleFlows = flows.slice(0, MAX_FLOW_COLUMNS);
                                    const hiddenFlows = flows.slice(MAX_FLOW_COLUMNS);
                                    const columnCount =
                                        flows.length > MAX_FLOW_COLUMNS
                                            ? MAX_FLOW_COLUMNS
                                            : visibleFlows.length;

                                    return (
                                        <div
                                            key={h.id}
                                            className={cls.gridCell}
                                            style={{width: COL_WIDTH, height: ROW_HEIGHT}}
                                        >
                                            {/* FLOW LESSONS */}
                                            {visibleFlows.map((fa, i) => {
                                                const width = COL_WIDTH / columnCount;


                                                return (
                                                    <div
                                                        key={fa.lesson.id}
                                                        className={cls.flowLesson}
                                                        style={{
                                                            left: i * width + 6,
                                                            top: 6,
                                                            width: width - 12,
                                                            height:
                                                                ROW_HEIGHT * fa.spanCount - 12,
                                                            fontSize: 12 * fontScale,
                                                        }}
                                                    >
                                                        <span>{fa.lesson.group?.name}</span>
                                                        <span className={cls.teacherName}>
                                                          {fa?.lesson?.teacher?.name} {fa?.lesson?.teacher?.surname}

                                                        </span>
                                                    </div>
                                                );
                                            })}

                                            {hiddenFlows.length > 0 && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            setOpenMoreKey(
                                                                openMoreKey ===
                                                                `${clsItem.id}-${h.id}`
                                                                    ? null
                                                                    : `${clsItem.id}-${h.id}`
                                                            )
                                                        }
                                                        className={cls.moreBtn}
                                                        style={{
                                                            width: 28,
                                                            height: 28,
                                                            fontSize: 11 * fontScale,
                                                        }}
                                                    >
                                                        +{hiddenFlows.length}
                                                    </button>

                                                    {openMoreKey ===
                                                        `${clsItem.id}-${h.id}` && (
                                                            <div
                                                                className={cls.moreDropdown}
                                                            >
                                                                {hiddenFlows.map((fa) => (
                                                                    <div
                                                                        key={fa.lesson.id}
                                                                        className={cls.dropdownItem}
                                                                    >
                                                                        {fa.lesson.group?.name}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                </>
                                            )}

                                            {!flows.length && !occupied && nonFlow && (
                                                <div
                                                    className={cls.singleLesson}
                                                    style={{
                                                        fontSize: 12 * fontScale,
                                                    }}
                                                >

                                                    <strong>{nonFlow.room?.name}</strong>
                                                    <span>{nonFlow.subject?.name}</span>
                                                    <span className={cls.teacherName}>
                                                          {nonFlow.teacher?.name} {nonFlow.teacher?.surname}
                                                                </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
};
