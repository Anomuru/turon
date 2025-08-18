import React, {useCallback, useEffect} from 'react';
import classNames from "classnames";

import {usePagination, DOTS} from "shared/lib/hooks/usePagination";

import cls from "./pagination.module.sass";

export const Pagination = React.memo((props) => {
    const {
        onPageChange,
        currentPage,
        pageSize,
        className,
        type = "basic",
        totalCount
    } = props;


    // useEffect(() => {
    //     setCurrentTableData(() => {
    //         const firstPageIndex = (currentPage - 1) * pageSize;
    //         const lastPageIndex = firstPageIndex + pageSize;
    //         return users?.slice(firstPageIndex, lastPageIndex);
    //     })
    // }, [pageSize, currentPage, users, setCurrentTableData])

    const totalPages = Math.ceil(totalCount / pageSize);
    const maxVisiblePages = 5;


    const getPageNumbers = useCallback(() => {
        let startPage = Math.max(
            currentPage - Math.floor(maxVisiblePages / 2),
            1
        );
        let endPage = startPage + maxVisiblePages - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(endPage - maxVisiblePages + 1, 1);
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    }, [currentPage, maxVisiblePages, totalPages]);

    const pages = getPageNumbers();

    const renderPageNumbers = useCallback(() => {
        return pages?.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
                return <li key={index} className={classNames(cls.pagination_item, "dots")}>&#8230;</li>;
            }

            return (
                <li
                    key={index}
                    className={classNames(cls.pagination_item, {
                        [cls.selected]: pageNumber === currentPage && type === "basic",
                        [cls.customSelected]: pageNumber === currentPage && type === "custom"
                    })}
                    onClick={() => onPageChange(pageNumber)}
                >
                    {pageNumber}
                </li>
            );
        });
    }, [currentPage, onPageChange]);


    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    // let lastPage = paginationRange[paginationRange?.length - 1] ? paginationRange[paginationRange?.length - 1] : 1;


    const renderedPages = renderPageNumbers();


    return (
        <>

            {totalPages > 1 && (
                <ul className={classNames(cls.pagination_container, {[className]: className})}>
                    <li
                        key={10000}
                        className={classNames(cls.pagination_item, cls.arrow, {
                            [cls.disabled]: currentPage === 1
                        })}
                        onClick={onPrevious}
                    >
                        <i className="fas fa-arrow-left"></i>
                    </li>
                    <div className={cls.numbers}>
                        {renderedPages}
                    </div>

                    <li
                        key={100001}
                        className={classNames(cls.pagination_item, cls.arrow, {
                            [cls.disabled]: currentPage === totalPages
                        })}
                        onClick={onNext}
                    >
                        <i className="fas fa-arrow-right"></i>
                    </li>
                </ul>
            )}
        </>
    );
});