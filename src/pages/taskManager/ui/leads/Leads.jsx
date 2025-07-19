import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';


import cls from "./leads.module.sass"
import {Input} from "shared/ui/input";
import {Button} from "shared/ui/button";
import {Droppable} from "shared/ui/droppable";
import {
    closestCenter,
    defaultDropAnimationSideEffects,
    DndContext,
    DragOverlay, getFirstCollision,
    KeyboardSensor,
    MeasuringStrategy,
    PointerSensor, pointerWithin, rectIntersection,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext, sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import classNames from "classnames";
import {LeadContainer} from "shared/ui/lead/leadContainer/leadContainer";
import {LeadCard} from "shared/ui/lead/leadCard/leadCard";
import {createPortal} from "react-dom";
import {useLocation, useNavigate} from "react-router";

export const Leads = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const onClickAddLead = () => {
        navigate(`../lead/new`, {
            state: {backgroundLocation: location},
        });
    };

    return (
        <div className={cls.leads}>
            <div className={cls.header}>

                <div>
                    <Input title={"Search"}/>
                    <Button>Filters</Button>
                </div>
                <div>
                    <Button onClick={onClickAddLead}>Add Lead</Button>
                </div>
            </div>

            <Wrapper/>

        </div>
    );
};

const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
};


const Wrapper = () => {


    const [containers, setContainers] = useState([
        {
            id: `container1`,
            title: "Container 1",
            items: [
                {
                    id: 1,
                    title: "Item 1",
                },
                {
                    id: 2,
                    title: "Item 2",
                }
            ],
        },
        {
            id: `container2`,
            title: "Container 2",
            items: [
                {
                    id: 3,
                    title: "Item 1",
                },
                {
                    id: 4,
                    title: "Item 2",
                },
                {
                    id: 5,
                    title: "Item 3",
                },
                {
                    id: 6,
                    title: "Item 3",
                },
                {
                    id: 7,
                    title: "Item 3",
                }
            ],
        },
        {
            id: `container3`,
            title: "Container 3",
            items: [],
        },

    ])
    const [activeItem, setActiveItem] = useState();
    const [activeContainer, setActiveContainer] = useState();
    const [activeId, setActiveId] = useState();
    const [changedIndex, setChangedIndex] = useState()

    const lastOverId = useRef(null);
    const recentlyMovedToNewContainer = useRef(false);


    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const findContainer = (id) => {
        if (containers.some(item => item.id === id)) {
            return id;
        }

        return containers.filter((key) => key?.items?.some(item => item.id === +id))[0].id;
    };


    const collisionDetectionStrategy = useCallback(
        (args) => {
            if (activeId && containers.some(item => item.id === activeId)) {
                return closestCenter({
                    ...args,
                    droppableContainers: args.droppableContainers.filter(
                        (container) => containers.some(item => item.id === container.id)
                    ),
                });
            }

            // Start by finding any intersecting droppable
            const pointerIntersections = pointerWithin(args);
            const intersections =
                pointerIntersections.length > 0
                    ?
                    pointerIntersections
                    : rectIntersection(args);
            let overId = getFirstCollision(intersections, "id");


            if (overId != null) {


                if (containers.some(item => item.id === overId)) {

                    const containerItems = containers.filter(item => item.id === overId)[0].lessons;
                    // If a container is matched, and it contains items (columns 'A', 'B', 'C')
                    if (containerItems?.length > 0) {
                        // Return the closest droppable within that container
                        const isNumber = typeof overId === "number" ? +overId : overId

                        overId = closestCenter({
                            ...args,
                            droppableContainers: args.droppableContainers.filter(
                                (container) => {
                                    return (
                                        container.id !== isNumber &&
                                        containerItems.some(item => item.id === container.id)
                                    )
                                }
                            ),
                        })[0]?.id;
                    }
                }

                lastOverId.current = overId;

                return [{id: overId}];
            }


            // When a draggable item moves to a new container, the layout may shift
            // and the `overId` may become `null`. We manually set the cached `lastOverId`
            // to the id of the draggable item that was moved to the new container, otherwise
            // the previous `overId` will be returned which can cause items to incorrectly shift positions
            if (recentlyMovedToNewContainer.current) {
                lastOverId.current = activeId;
            }

            // If no droppable is matched, return the last match
            return lastOverId.current ? [{id: lastOverId.current}] : [];
        },
        [activeId, containers]
    );

    useEffect(() => {
        requestAnimationFrame(() => {
            recentlyMovedToNewContainer.current = false;
        });
    }, [containers]);




    return (
        <DndContext
            sensors={sensors}
            collisionDetection={collisionDetectionStrategy}
            // collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            measuring={{
                droppable: {
                    strategy: MeasuringStrategy.Always,
                },
            }}

        >
            <div className={cls.wrapper}>
                <SortableContext
                    items={containers.map(item => item.id)}
                    strategy={horizontalListSortingStrategy}
                >
                    {
                        containers.map(item => {
                            return (
                                <SortableContainer
                                    item={item}
                                />
                            )
                        })
                    }
                </SortableContext>


            </div>


            {createPortal(
                <DragOverlay adjustScale={false} dropAnimation={dropAnimation}>
                    {activeId
                        ? renderSortableItemDragOverlay(activeId)
                        : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    )
    function getIndex(id) {
        const container = findContainer(id);

        if (!container) {
            return -1;
        }

        const index = containers.findIndex(item => item.id === id);

        return index;
    }


    function handleDragStart(event) {
        const {active} = event;
        const {id} = active;
        const activeContainer = findContainer(id);
        let activeIndex

        if (containers.some(item => item.id === id)) {
            setActiveItem(containers.filter(item => item.id === id)[0])
            activeIndex = containers.findIndex(item => item.id === activeContainer);
        } else {
            setActiveItem(containers.filter(item => item.id === activeContainer)[0]?.items?.filter(item => item.id === id)[0])
            activeIndex = containers.filter(item => item.id === activeContainer)[0].items.findIndex(item => item.id === id)
        }
        setChangedIndex(activeIndex)
        setActiveContainer(activeContainer)
        setActiveId(id);
    }


    function handleDragOver(event) {
        const {active, over} = event;
        const {id} = active;

        const overId = over?.id

        if (containers.some(item => item.id === id) && over?.id) {

            setContainers((containers) => {
                const activeIndex = containers.findIndex(item => item.id === active.id);
                const overIndex = containers.findIndex(item => item.id === over.id);
                return arrayMove(containers, activeIndex, overIndex);
            });
        }
        if (overId == null || containers.some(item => item.id === id)) {
            return;
        }

        // Find the containers
        const activeContainer = findContainer(id);
        const overContainer = findContainer(overId);

        if (
            !activeContainer ||
            !overContainer
        ) {
            return;
        }
        console.log(activeContainer, overContainer)
        if (activeContainer !== overContainer) {

            setContainers((items) => {
                const activeItems = items.filter(item => item.id === activeContainer)[0];
                const overItems = items.filter(item => item.id === overContainer)[0];
                const overIndex = overItems.items.findIndex(item => item.id === overId);
                const activeIndex = activeItems.items.findIndex(item => item.id === id);

                let newIndex;

                if (items.some(item => item.id === overId)) {
                    newIndex = overItems.items.length + 1;
                } else {
                    const isBelowOverItem =
                        over &&
                        active.rect.current.translated &&
                        active.rect.current.translated.top >
                        over.rect.top + over.rect.height;

                    const modifier = isBelowOverItem ? 1 : 0;

                    newIndex =
                        overIndex >= 0 ? overIndex + modifier : overItems.items.length + 1;
                }

                recentlyMovedToNewContainer.current = true;


                return items.map(item => {
                    if (item.id === activeContainer) {
                        return {
                            ...item,
                            items: activeItems.items.filter((item) => item.id !== id)
                        }
                    } else if (item.id === overContainer) {
                        return {
                            ...item,
                            active: true,
                            items: [
                                ...overItems.items.slice(0, newIndex),
                                activeItems.items[activeIndex],
                                ...overItems.items.slice(
                                    newIndex,
                                    overItems.items.length
                                ),
                            ]
                        }
                    }
                    return item
                })
            });
        }
    }

    function handleDragEnd(event) {
        const {active, over} = event;
        const {id} = active;

        const activeContainer = findContainer(id);
        const overId = over?.id


        if (!activeContainer) {
            setActiveId(null);
            return;
        }


        if (overId == null) {
            setActiveId(null);
            return;
        }

        const overContainer = findContainer(overId);

        if (overContainer) {

            const activeItems = containers.filter(item => item.id === activeContainer)[0];
            const overItems = containers.filter(item => item.id === overContainer)[0];
            const activeIndex = activeItems.items.findIndex(item => item.id === id);
            const overIndex = overItems.items.findIndex(item => item.id === overId);

            if (activeIndex !== overIndex) {

                setContainers((items) => items.map(item => {
                    if (item.id === overContainer) {
                        return {
                            ...item,
                            items: arrayMove(
                                overItems.items,
                                activeIndex,
                                overIndex
                            )
                        }
                    }
                    return item
                }))
            }
        }
        // setActiveId(null);
        // setActiveItem(null);
    }

    function renderSortableItemDragOverlay(id) {
        return (
            <LeadCard
                value={id}
                handle={false}
                style={{
                    containerId: findContainer(id),
                    overIndex: -1,
                    index: getIndex(id),
                    value: id,
                    isSorting: true,
                    isDragging: true,
                    isDragOverlay: true,
                }}
                wrapperStyle={{index: 0}}
                dragOverlay={true}
            />
        );
    }
}


const SortableContainer = React.memo((props) => {

    const {item} = props


    const {
        active,
        attributes,
        isDragging,
        listeners,
        over,
        setNodeRef,
        transition,
        transform,
    } = useSortable({
        id: item.id,
        data: {
            type: 'container',
            children: item.items,
        },
    });

    const isOverContainer = over
        ? (item.id === over.id && active?.data.current?.type !== 'container') ||
        item.items.some(key => key.id === over.id)
        : false;


    return (
        <LeadContainer
            style={{
                // ...style,
                transition,
                transform: CSS?.Translate?.toString(transform),
                opacity: isDragging ? 0.5 : undefined,
            }}
            attributes={attributes}
            listeners={listeners}
            ref={setNodeRef}
            items={item?.items}
            container={item}
        >
            {
                item.items.map(item => <SortableItem key={item.id} item={item}/>)
            }
        </LeadContainer>
    )
})


function SortableItem({item}) {

    const {
        isDragging,
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({
        id: item.id,
        // disabled: !changeLessonsSort,
        transition: {
            duration: 150, // milliseconds
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        }
    });


    return (
        <LeadCard
            attributes={attributes}
            listeners={listeners}
            ref={setNodeRef}
            transform={transform}
            transition={transition}
            id={item.id}
            item={item}
            dragging={isDragging}
        />
    );
}



