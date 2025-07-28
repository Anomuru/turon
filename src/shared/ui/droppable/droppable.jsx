import {useDroppable} from "@dnd-kit/core";

export function Droppable({id, children, extraClass,overStyle,disabled,data,...props}) {

    const {isOver, setNodeRef} = useDroppable({
        id: id,
        disabled: disabled,
        data
    });




    return (
        <div
            key={id}
            ref={setNodeRef}
            style={isOver  ? overStyle : null}
            className={extraClass}
            {...props}
        >
            {children}
        </div>
    );
}