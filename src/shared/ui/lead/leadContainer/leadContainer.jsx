import React, {forwardRef, useMemo} from 'react';

import cls from "./leadContainer.module.sass"
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";

export const LeadContainer = forwardRef((props, ref) => {


    const {
        attributes,
        listeners,
        items,
        activeDown,
        onToggleChapter,
        style,
        dragOverlay,
        container,
        children
    } = props


    const itemsIds = useMemo(() => {
        // if (!items.length) return [];

        return items.map(item => item.id)
    }, [items])


    return (
        <div
            style={style}
            {...attributes}
            className={cls.funnel}
            ref={ref}
        >
            <div className={cls.funnel__header}>
                <h1>{container.title}</h1>
            </div>
            <div className={cls.funnel__wrapper}>

                <SortableContext
                    strategy={verticalListSortingStrategy}
                    items={itemsIds}
                >
                    {children}


                </SortableContext>
            </div>
        </div>
    )
});

