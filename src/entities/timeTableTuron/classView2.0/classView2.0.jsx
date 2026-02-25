import React, { useCallback, useMemo, useState, useRef } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import html2canvas from "html2canvas";
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

export const TimetableGrid = ({ classes, hours, setActive }) => {
    console.log(classes, hours)
    const [scale, setScale] = useState(0.7);
    const [openMoreKey, setOpenMoreKey] = useState(null);
    const contentRef = useRef(null);

    const fontScale = Math.max(0.75, Math.min(1, 1 / scale));

    const handleSavePng = async () => {
        if (!contentRef.current) return;
        try {
            // Create a clone of the element to modify styles for export without affecting UI
            const element = contentRef.current;
            const clone = element.cloneNode(true);

            // Create a temporary container to hold the clone
            const container = document.createElement("div");
            container.style.position = "absolute";
            container.style.top = "-9999px";
            container.style.left = "-9999px";
            // Ensure container matches the full scroll size of the content
            container.style.width = `${element.scrollWidth}px`;
            container.style.height = `${element.scrollHeight}px`;
            container.appendChild(clone);
            document.body.appendChild(container);

            // --- MODIFY CLONE STYLES FOR PERFECT EXPORT ---

            // 1. Fix Sticky Header: Change to static so it renders at the top correctly in the image
            const headerRow = clone.querySelector(`.${cls.headerRow}`);
            if (headerRow) {
                headerRow.style.position = "static";
                headerRow.style.width = "100%";
                headerRow.style.transform = "none"; // Remove any transforms
            }

            // 2. Normalize Fonts: Force readable sizes (14px/12px) ignoring current zoom scale

            // Header Cells
            const headerCells = clone.querySelectorAll(`.${cls.headerCell}`);
            headerCells.forEach(cell => {
                cell.style.fontSize = "14px";
                const sub = cell.querySelector("span:last-child");
                if (sub) sub.style.fontSize = "12px";
            });

            // Class Labels (left column)
            const classLabels = clone.querySelectorAll(`.${cls.classLabel}`);
            classLabels.forEach(label => {
                label.style.fontSize = "14px";
            });

            // Flow Lessons
            const flowLessons = clone.querySelectorAll(`.${cls.flowLesson}`);
            flowLessons.forEach(lesson => {
                lesson.style.fontSize = "12px";
            });

            // Single Lessons
            const singleLessons = clone.querySelectorAll(`.${cls.singleLesson}`);
            singleLessons.forEach(lesson => {
                lesson.style.fontSize = "12px";
                // Ensure position/transform doesn't break
            });

            // Helper: Reset specific text elements inside lessons if needed
            const teacherNames = clone.querySelectorAll(`.${cls.teacherName}`);
            teacherNames.forEach(el => el.style.fontSize = "11px");

            const roomNames = clone.querySelectorAll(`.${cls.roomName}`);
            roomNames.forEach(el => el.style.fontSize = "10px");

            // Capture the clone
            const canvas = await html2canvas(clone, {
                scale: 3, // High quality
                useCORS: true,
                backgroundColor: "#ffffff",
                width: element.scrollWidth,
                height: element.scrollHeight,
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight
            });

            // Cleanup
            document.body.removeChild(container);

            // Download
            const link = document.createElement("a");
            link.download = `timetable-${new Date().getTime()}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (error) {
            console.error("Failed to save image", error);
        }
    };

    const classIndexMap = useMemo(() => {
        const map = new Map();
        if (classes) {
            classes.forEach((c, i) => map.set(String(c.id), i));
        }
        return map;
    }, [classes]);

    const flowAnchors = useMemo(() => {
        const map = new Map();
        const occupiedCells = new Set();
        const lessonRowsMap = new Map();
        const lessonObjectMap = new Map();

        if (!classes) return map;

        // First pass: Identify occupied cells (single lessons) and collect flow lesson rows
        for (const clsItem of classes) {
            const clsIndex = classIndexMap.get(String(clsItem.id));
            if (clsIndex === undefined || !clsItem.lessons) continue;

            for (const lesson of clsItem.lessons) {
                if (!lesson.status) continue; // Skip inactive lessons

                // Single lessons occupy the cell
                if (!lesson.is_flow) {
                    const cellKey = `${lesson.hours}-${clsIndex}`;
                    occupiedCells.add(cellKey);
                    continue;
                }

                // Flow lessons: collect row indices
                const key = `${lesson.id}-${lesson.hours}`;

                if (!lessonRowsMap.has(key)) {
                    lessonRowsMap.set(key, new Set());
                    lessonObjectMap.set(key, lesson);
                }
                lessonRowsMap.get(key).add(clsIndex);

                // Also collect indices from group definition
                if (lesson.group?.classes) {
                    lesson.group.classes.forEach((cid) => {
                        const idx = classIndexMap.get(String(cid));
                        if (idx !== undefined) {
                            lessonRowsMap.get(key).add(idx);
                        }
                    });
                }
            }
        }

        // Identify start rows of all flow lessons to use as limiters
        // Key: cellKey, Value: groupId (to allow same-group flows to overlap/merge)
        const flowStartLimiters = new Map();

        lessonRowsMap.forEach((rowIndices, key) => {
            if (rowIndices.size === 0) return;
            const minRow = Math.min(...Array.from(rowIndices));
            const lesson = lessonObjectMap.get(key);

            // Mark the start cell as a "hard" obstacle for other flow expansions
            const cellKey = `${lesson.hours}-${minRow}`;
            flowStartLimiters.set(cellKey, String(lesson.group?.id));
        });

        // Second pass: Build flow segments
        lessonRowsMap.forEach((rowIndices, key) => {
            const lesson = lessonObjectMap.get(key);
            const rows = Array.from(rowIndices).sort((a, b) => a - b);

            if (!rows.length) return;

            // Build segments
            let currentStart = -1;
            let currentLength = 0;
            let prevRow = -999;

            const finalizeSegment = () => {
                if (currentStart !== -1) {
                    const segmentKey = `${key}-${currentStart}`;
                    map.set(segmentKey, {
                        lesson,
                        startRowIndex: currentStart,
                        spanCount: currentLength
                    });
                }
            };

            const minRowOfThisLesson = rows[0];

            for (const rowIndex of rows) {
                const cellKey = `${lesson.hours}-${rowIndex}`;

                // Check if cell is occupied by a single lesson
                if (occupiedCells.has(cellKey)) {
                    finalizeSegment();
                    currentStart = -1;
                    currentLength = 0;
                    prevRow = rowIndex;
                    continue;
                }

                // Check if cell is the start of ANOTHER flow lesson
                // We allow it if it's the start of THIS lesson (at currentStart or overall minRow?)
                // Actually, if we are at rowIndex which is a start of *another* flow lesson, we should stop our expansion.
                // But if it's the start of *this* segment being built? That's fine.
                // Wait, if it's another lesson starting here, we can't overlap it.
                // So if flowStartLimiters has cellKey AND it's NOT (this lesson starting here), it's an obstacle.

                // However, multiple lessons might start at the exact same minRow (e.g. strict overlap).
                // In that case, they will overlap anyway (usma ust). We can't solve equality without priority.
                // But if we are expanding into someone else's turf, we stop.
                // We check if this cell is a limiter.
                // Exception: if rowIndex IS the very first row we are processing for this lesson, we can't be blocked by "another lesson starting here"
                // unless we want to disappear completely. Let's assume starts can coexist (overlap), but expansions stop.
                // So checking `rowIndex !== minRowOfThisLesson` prevents stopping at our own start.

                // NEW: We allow expansion if blocking lesson is SAME GROUP (e.g. 5-6-7 separate entries for same group)
                const blockingGroupId = flowStartLimiters.get(cellKey);

                if (blockingGroupId !== undefined &&
                    blockingGroupId !== String(lesson.group?.id) &&
                    rowIndex !== minRowOfThisLesson) {

                    // Found another flow start here (diff group). Treat as obstacle.
                    finalizeSegment();
                    currentStart = -1;
                    currentLength = 0;
                    prevRow = rowIndex;
                    continue;
                }

                // Standard gap check
                if (currentStart !== -1 && rowIndex !== prevRow + 1) {
                    finalizeSegment();
                    currentStart = rowIndex;
                    currentLength = 1;
                } else if (currentStart === -1) {
                    currentStart = rowIndex;
                    currentLength = 1;
                } else {
                    currentLength++;
                }

                prevRow = rowIndex;
            }

            finalizeSegment();
        });

        return map;
    }, [classes, classIndexMap]);

    const getFlowAnchorsForCell = useCallback(
        (classId, hourId) => {
            const rowIndex = classIndexMap.get(String(classId));
            if (rowIndex === undefined) return [];

            return Array.from(flowAnchors.values()).filter(
                (a) => a.lesson.hours === hourId && a.startRowIndex === rowIndex
            );
        },
        [flowAnchors, classIndexMap]
    );

    const isFlowOccupied = useCallback(
        (classId, hourId) => {
            const rowIndex = classIndexMap.get(String(classId));
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
                (l) => !l.is_flow && !!l.status && l.hours === hourId
            ) ?? null,
        []
    );

    if (!classes || !hours) return null;

    return (
        <div className={cls.container}>

            <button
                onClick={handleSavePng}
                style={{
                    position: "absolute",
                    right: "6rem",
                    top: "3rem",
                    zIndex: "222222222",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    fontSize: "1.4rem",
                    fontWeight: "600",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
            >
                Rasm ko'rinishida saqlash
            </button>
            <i onClick={() => {
                setActive(false)
                console.log("dasdsa")
            }} style={{ position: "absolute", right: "3rem", color: "black", fontSize: "3rem", top: "3rem", zIndex: "22222222222222222" }} className={"fa fa-times"} />
            <TransformWrapper
                initialScale={0.7}
                minScale={0.3}
                maxScale={3}
                doubleClick={{ disabled: true }}
                onTransformed={(e) => setScale(e.instance.transformState.scale)}
            >
                <TransformComponent>
                    <div className={cls.contentWrapper} ref={contentRef}>
                        {/* ================= HEADER ================= */}
                        <div
                            className={cls.headerRow}
                            style={{ marginLeft: LABEL_WIDTH }}
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
                                        style={{ fontSize: 10 * fontScale }}
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
                                            style={{ width: COL_WIDTH, height: ROW_HEIGHT }}
                                        >
                                            {/* FLOW LESSONS */}
                                            {visibleFlows.map((fa, i) => {
                                                const width = COL_WIDTH / columnCount;

                                                // Calculate background style (solid or gradient)
                                                const spanColors = [];
                                                for (let j = 0; j < fa.spanCount; j++) {
                                                    const idx = fa.startRowIndex + j;
                                                    if (classes[idx]) spanColors.push(classes[idx].color);
                                                }
                                                const uniqueColors = [...new Set(spanColors)];

                                                let backgroundStyle = { backgroundColor: clsItem.color };
                                                if (uniqueColors.length > 1) {
                                                    // Create sharp diagonal stripes for mixed colors
                                                    const stops = uniqueColors.map((c, idx) => {
                                                        const start = (idx / uniqueColors.length) * 100;
                                                        const end = ((idx + 1) / uniqueColors.length) * 100;
                                                        return `${c} ${start}%, ${c} ${end}%`;
                                                    }).join(', ');
                                                    backgroundStyle = { background: `linear-gradient(45deg, ${stops})` };
                                                }

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
                                                            ...backgroundStyle,
                                                            color: hexToBrightness(clsItem.color) > 125 ? "#000" : "#fff",
                                                        }}
                                                    >
                                                        <span>{fa.lesson.group?.name}</span>
                                                        <span className={cls.teacherName}>
                                                            {fa?.lesson?.teacher?.name} {fa?.lesson?.teacher?.surname}
                                                        </span>
                                                        <span className={cls.roomName}>{fa.lesson.room?.name}</span>
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
                                                        backgroundColor: "#a5f3fc",
                                                        color: "#000",
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
