import cls from "../category.module.sass"

export const EmployerCategoryHeader = ({activeCategory, setActiveCategory}) => {
    return (
        <div className={cls.categoryPlus} onClick={() => setActiveCategory(!activeCategory)}>
            <i className={"fa fa-plus"}/>
        </div>
    );
};

