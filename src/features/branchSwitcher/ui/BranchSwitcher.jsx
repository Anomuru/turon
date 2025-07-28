import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchBranchesByLocationsThunk} from "../model/thunk/branchSwitcherThunk";
import {onChangeBranch, onDeleteBranch} from "../model/slice/branchSwitcherSlice";
import {getBranches, getBranchLoading} from "../model/selector/brachSwitcherSelector";
import {getBranch} from "../model/selector/brachSwitcherSelector";
import {Select} from "shared/ui/select";

import cls from "./BranchSwitcher.module.sass"


export const BranchSwitcher = ({location}) => {


    const branches = useSelector(getBranches)
    const branch = useSelector(getBranch)
    const loading = useSelector(getBranchLoading)

    const dispatch = useDispatch();


    // useEffect(() => {
    //     if (location?.id) {
    //         dispatch(fetchBranchesByLocationsThunk(location.id))
    //     } else {
    //         dispatch(onDeleteBranch())
    //     }
    // }, [location?.id])


    const changeSelectedBranches = useCallback((id) => {
        dispatch(onChangeBranch(id))
    }, []);


    if (loading) return

    return (
        <>
            {branches.length > 1 ?
                <Select
                    // title={"Branch"}
                    onChangeOption={changeSelectedBranches}
                    options={branches}
                    defaultValue={branch?.id}
                />
                :
                !!branch?.name && <div className={cls.branch}>
                    <span>Branch:</span>
                    <span>{branch.name}</span>
                </div>
            }

        </>


    );
};

