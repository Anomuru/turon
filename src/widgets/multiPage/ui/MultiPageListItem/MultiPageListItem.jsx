import React from 'react';
import classNames from "classnames";
import {Link} from "shared/ui/link";

import cls from "./MultiPageListItem.module.sass";
import {useNavigate} from "react-router";
import {useDispatch} from "react-redux";
import {onChangeBranch} from "features/branchSwitcher";

const MultiPageListItem = ({data, title, item: type,isType,id}) => {


    const dispatch = useDispatch()

    const renderData = () => {
        return data.map((item, i) =>
            <div className={cls.studentsListItem__item}>
                <h2
                    className={classNames(cls.studentsListItem__innerTitle, {
                        [cls.eval]: (i + 1) % 2 === 0
                    })}
                >
                    {item.name}
                    <span>{item.count}</span>
                </h2>
                {
                    item?.list?.map(branch =>
                        <Link
                            to={{
                                pathname: id ? `${branch?.id}` : `./${type.type}`,
                                search: isType && id ? `type=${type.type}` : null,
                            }}
                            onClick={() => {
                                dispatch(onChangeBranch(branch?.id))
                            }}
                            relative="path"
                        >
                            <h2
                                className={classNames(cls.studentsListItem__inner, {
                                    [cls.eval]: (i + 1) % 2 === 0
                                })}
                            >
                                {branch?.name}
                                <span>{branch?.count}</span>
                            </h2>
                        </Link>
                    )
                }
            </div>
        )
    }

    const render = renderData()

    return (
        <div className={cls.studentsListItem}>
            <h1 className={cls.studentsListItem__title}>
                <i className="fas fa-user-alt"/>
                {title}
            </h1>
            {render}
        </div>
    )
};

export default MultiPageListItem;