import {useDraggable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";

export function Draggable({id, children, extraClass,data,style}) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: id,
        data
    });


    const newStyle = transform
        ? {
            transform: CSS.Translate.toString(transform),
            ...style
        }
        : style;

    return (
        <div
            ref={setNodeRef}
            className={extraClass}
            style={newStyle}
            {...listeners}
            {...attributes}
        >
            {children}
        </div>
    );
}