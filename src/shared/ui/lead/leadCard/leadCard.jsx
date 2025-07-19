import React, {useEffect} from 'react';
import classNames from "classnames";
import cls from "./leadCard.module.sass";

// export const LeadCard = (props) => {
//     const {
//         item,
//         isDragging,
//         isDragOverlay,
//         attributes,
//         listeners,
//         setNodeRef,
//         transform,
//         transition,
//     } = props
//
//
//
//     const style = {
//         transition,
//         transform: CSS.Transform?.toString(transform)
//     };
//
//
//     return (
//         <div
//             className={classNames(cls.leadCard, {
//                 [cls.dragging]: isDragging,
//                 [cls.dragOverlay]: isDragOverlay
//             })}
//             ref={setNodeRef}
//             style={style}
//             {...attributes}
//             {...listeners}
//         >
//
//             <div className={cls.header}>
//
//                 <div className={cls.info}>
//                     <div className={cls.name}>Ulug'bek</div>
//                     <div className={cls.surname}>Fatxullayev</div>
//                 </div>
//
//
//                 <div className={cls.date}>
//                     <div className={cls.date__title}>22-iyul 16:30</div>
//                 </div>
//
//             </div>
//
//
//
//             <div className={cls.footer}>
//
//                 <div className={cls.task}>
//                     Task: yes
//                 </div>
//
//             </div>
//
//         </div>
//     )
// };


export const LeadCard = React.memo(
    React.forwardRef(
    (
        {
            color,
            dragOverlay,
            dragging,
            disabled,
            fadeIn,
            handle,
            handleProps,
            height,
            index,
            listeners,
            attributes,
            onRemove,
            renderItem,
            sorting,
            transition,
            transform,
            value,
            wrapperStyle,
            ...props
        },
        ref
    ) => {

        // useEffect(() => {
        //     if (!dragOverlay) {
        //         return;
        //     }
        //
        //
        //     document.body.style.cursor = "grabbing";
        //
        //     return () => {
        //         document.body.style.cursor = "";
        //     };
        // }, [dragOverlay]);


        const style = {
            transition,
            transform: CSS.Transform?.toString(transform)
        };

        return (
            <div
                className={classNames(cls.leadCard, {
                    [cls.dragging]: dragging,
                    [cls.dragOverlay]: dragOverlay
                })}
                // data-cypress="draggable-item"
                ref={ref}
                // style={style}
                style={
                    {
                        ...wrapperStyle,
                        transition: [transition, wrapperStyle?.transition]
                            .filter(Boolean)
                            .join(", "),
                        "--translate-x": transform
                            ? `${Math.round(transform.x)}px`
                            : undefined,
                        "--translate-y": transform
                            ? `${Math.round(transform.y)}px`
                            : undefined,
                        "--scale-x": transform?.scaleX
                            ? `${transform.scaleX}`
                            : undefined,
                        "--scale-y": transform?.scaleY
                            ? `${transform.scaleY}`
                            : undefined,
                        "--index": index,
                        "--color": color
                    }
                }
                {...listeners}
                {...attributes}
            >

                <div className={cls.header}>

                    <div className={cls.info}>
                        <div className={cls.name}>Ulug'bek {value}</div>
                        <div className={cls.surname}>Fatxullayev</div>
                    </div>


                    <div className={cls.date}>
                        <div className={cls.date__title}>22-iyul 16:30</div>
                    </div>

                </div>



                <div className={cls.footer}>

                    <div className={cls.task}>
                        Task: yes
                    </div>

                </div>

            </div>
        );
    }
));


